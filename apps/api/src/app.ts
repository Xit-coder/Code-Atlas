import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { bodyLimit } from "hono/body-limit";
import { neon } from "@neondatabase/serverless";
import {
  repositoryInput,
  parseRepository,
} from "../../../packages/shared/src/repository";
import { inspectRepository, UpstreamError } from "./github";
import { openapi } from "./openapi";

type Bindings = Partial<Pick<Env, "DATABASE_URL" | "INSPECT_LIMITER">>;

export const app = new Hono<{ Bindings: Bindings }>();
app.use("*", requestId());
app.use("*", secureHeaders());
app.use("/api/*", async (c, next) => {
  c.header("Cache-Control", "no-store");
  if (
    c.req.method === "POST" &&
    c.req.header("Origin") &&
    c.req.header("Origin") !== new URL(c.req.url).origin
  ) {
    return c.json(
      { error: "Origem não permitida.", requestId: c.get("requestId") },
      403,
    );
  }
  await next();
});
app.use(
  "/api/*",
  bodyLimit({
    maxSize: 1024,
    onError: (c) =>
      c.json(
        { error: "Corpo excede 1 KiB.", requestId: c.get("requestId") },
        413,
      ),
  }),
);

app.get("/api/v1/health", (c) =>
  c.json({
    status: "ok",
    service: "codeatlas-api",
    version: "0.1.0",
    phase: 0,
  }),
);
app.get("/api/v1/readiness", async (c) => {
  if (!c.env?.DATABASE_URL)
    return c.json({ status: "unavailable", database: "not_configured" }, 503);
  try {
    const sql = neon(c.env.DATABASE_URL, {
      fetchOptions: { signal: AbortSignal.timeout(6000) },
    });
    const rows =
      await sql`SELECT EXISTS(SELECT 1 FROM public.schema_migrations WHERE version = '0001') AS ready`;
    if (rows[0]?.ready !== true)
      return c.json(
        { status: "unavailable", database: "migration_required" },
        503,
      );
    return c.json({
      status: "ready",
      database: "connected",
      schemaVersion: "0001",
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "database_unavailable",
        kind: error instanceof Error ? error.name : "unknown",
        requestId: c.get("requestId"),
      }),
    );
    return c.json(
      {
        status: "unavailable",
        database: "unreachable_or_unmigrated",
        requestId: c.get("requestId"),
      },
      503,
    );
  }
});
app.post("/api/v1/repositories/inspect", async (c) => {
  if (c.env?.INSPECT_LIMITER) {
    const result = await c.env.INSPECT_LIMITER.limit({
      key: "codeatlas:inspect:" + (c.req.header("CF-Connecting-IP") ?? "local"),
    });
    if (!result.success) {
      c.header("Retry-After", "60");
      return c.json(
        {
          error: "Limite de consultas atingido. Aguarde um minuto.",
          requestId: c.get("requestId"),
        },
        429,
      );
    }
  }
  if (!c.req.header("Content-Type")?.startsWith("application/json"))
    return c.json(
      { error: "Use application/json.", requestId: c.get("requestId") },
      415,
    );
  const input = repositoryInput.safeParse(await c.req.json().catch(() => null));
  if (!input.success)
    return c.json(
      {
        error: "Informe uma URL válida no campo url.",
        requestId: c.get("requestId"),
      },
      400,
    );
  try {
    parseRepository(input.data.url);
  } catch {
    return c.json(
      {
        error:
          "Use https://github.com/proprietario/repositorio, sem parâmetros.",
        requestId: c.get("requestId"),
      },
      400,
    );
  }
  try {
    return c.json(await inspectRepository(input.data.url));
  } catch (error) {
    if (error instanceof UpstreamError)
      return c.json(
        { error: error.message, requestId: c.get("requestId") },
        error.status,
      );
    console.error(
      JSON.stringify({
        event: "github_unavailable",
        kind: error instanceof Error ? error.name : "unknown",
        requestId: c.get("requestId"),
      }),
    );
    return c.json(
      {
        error: "Não foi possível consultar o GitHub. Tente novamente.",
        requestId: c.get("requestId"),
      },
      502,
    );
  }
});
app.get("/api/v1/openapi.json", (c) => c.json(openapi));
app.notFound((c) =>
  c.json(
    { error: "Recurso não encontrado.", requestId: c.get("requestId") },
    404,
  ),
);
app.onError((_error, c) => {
  console.error(
    JSON.stringify({ event: "request_failed", requestId: c.get("requestId") }),
  );
  return c.json({ error: "Erro interno.", requestId: c.get("requestId") }, 500);
});
