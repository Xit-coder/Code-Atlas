// Local-only harness: forwards Worker fetch through Node's inherited environment proxy.
// No mocked responses; production continues to use native Workers fetch.
import {
  Miniflare,
  Response as MiniflareResponse,
  convertV4MiniflareOptions,
} from "miniflare";
import { resolve } from "node:path";
if (!process.env.DATABASE_URL)
  throw new Error("Configure .env.local antes de iniciar.");
const mf = new Miniflare(
  convertV4MiniflareOptions({
    name: "codeatlas-proxy-local",
    port: 8787,
    modules: true,
    scriptPath: resolve(
      ".cloudflare/output/v0/workers/default/bundle/index.js",
    ),
    compatibilityDate: "2026-11-14",
    compatibilityFlags: ["nodejs_compat"],
    bindings: { DATABASE_URL: process.env.DATABASE_URL },
    ratelimits: {
      INSPECT_LIMITER: {
        namespace_id: "184211401",
        simple: { limit: 10, period: 60 },
      },
    },
    assets: {
      directory: resolve(".cloudflare/output/v0/workers/default/assets"),
      run_worker_first: ["/api/*"],
      routerConfig: { has_user_worker: true },
      assetConfig: { not_found_handling: "single-page-application" },
    },
    outboundService: async (request) => {
      const url = new URL(request.url);
      const database = new URL(process.env.DATABASE_URL);
      const neonApiHost = `api.${database.hostname.split(".").slice(1).join(".")}`;
      if (
        url.protocol !== "https:" ||
        !["api.github.com", database.hostname, neonApiHost].includes(
          url.hostname,
        )
      )
        return new MiniflareResponse("Outbound destination denied", {
          status: 403,
        });
      const response = await fetch(request.url, {
        method: request.method,
        headers: Object.fromEntries(request.headers),
        ...(request.body ? { body: await request.arrayBuffer() } : {}),
        redirect: "error",
        signal: AbortSignal.timeout(15000),
      });
      const headers = new Headers(response.headers);
      // Node fetch already decompresses; forwarding encoding/length would corrupt the body.
      headers.delete("content-encoding");
      headers.delete("content-length");
      return new MiniflareResponse(await response.arrayBuffer(), {
        status: response.status,
        headers: Object.fromEntries(headers),
      });
    },
  }),
);
console.log(`CodeAtlas local proxy runtime: ${await mf.ready}`);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, async () => {
    await mf.dispose();
    process.exit(0);
  });
