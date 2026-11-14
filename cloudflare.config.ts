import { bindings, defineConfig } from "cf/config";

export default defineConfig(({ mode }) => ({
  accountId: "40caaf5dbadf0caaf91fb262d7e158a5",
  worker: {
    name: mode === "production" ? "codeatlas" : "codeatlas-dev",
    entrypoint: "./apps/api/src/index.ts",
    compatibilityDate: "2026-11-14",
    compatibilityFlags: ["nodejs_compat"],
    env: {
      DATABASE_URL: bindings.secret(),
      INSPECT_LIMITER: bindings.rateLimit({
        namespace: "184211401",
        simple: { limit: 10, period: 60 },
      }),
    },
    assets: {
      notFoundHandling: "single-page-application",
      runWorkerFirst: ["/api/*"],
    },
    observability: {
      enabled: true,
      redactQueryString: true,
      logs: { enabled: true },
      traces: { enabled: true, headSamplingRate: 0.01 },
    },
  },
}));
