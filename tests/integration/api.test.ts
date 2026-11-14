import { expect, it } from "vitest";
import { app } from "../../apps/api/src/app";
it("serves liveness with request id and security headers", async () => {
  const response = await app.request("/api/v1/health");
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ status: "ok" });
  expect(response.headers.get("x-request-id")).toBeTruthy();
  expect(response.headers.get("x-content-type-options")).toBe("nosniff");
});
it("fails readiness clearly without database configuration", async () => {
  const response = await app.request("/api/v1/readiness", {}, {});
  expect(response.status).toBe(503);
  expect(await response.json()).toMatchObject({ database: "not_configured" });
});
it.each([
  { url: "http://169.254.169.254/latest/meta-data" },
  { url: "https://github.com/a/b", extra: true },
  {},
])("rejects invalid input", async (input) => {
  const response = await app.request("/api/v1/repositories/inspect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  expect(response.status).toBe(400);
});
it("rejects cross origin requests", async () => {
  const response = await app.request("/api/v1/repositories/inspect", {
    method: "POST",
    headers: {
      Origin: "https://evil.test",
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  expect(response.status).toBe(403);
});
it("rejects excessive bodies", async () => {
  const response = await app.request("/api/v1/repositories/inspect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "x".repeat(1025),
  });
  expect(response.status).toBe(413);
});
it("returns a JSON 404 rather than an application page", async () => {
  const response = await app.request("/api/v1/projects");
  expect(response.status).toBe(404);
  expect(response.headers.get("content-type")).toContain("application/json");
});
it("returns 429 before contacting GitHub when limited", async () => {
  const response = await app.request(
    "/api/v1/repositories/inspect",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://github.com/a/b" }),
    },
    { INSPECT_LIMITER: { limit: async () => ({ success: false }) } },
  );
  expect(response.status).toBe(429);
  expect(response.headers.get("retry-after")).toBe("60");
});
