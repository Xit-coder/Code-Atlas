import assert from "node:assert/strict";
const base = process.env.CODEATLAS_SMOKE_URL ?? "http://127.0.0.1:8787";
const ready = await fetch(`${base}/api/v1/readiness`);
assert.equal(ready.status, 200);
assert.equal((await ready.json()).database, "connected");
const inspected = await fetch(`${base}/api/v1/repositories/inspect`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://github.com/octocat/Hello-World" }),
});
assert.equal(inspected.status, 200);
const info = await inspected.json();
assert.match(info.commit, /^[a-f0-9]{40}$/);
assert.equal(info.repo, "Hello-World");
console.log(
  JSON.stringify({
    result: "passed",
    runtime: "workerd",
    database: "connected",
    repository: info.url,
    branch: info.defaultBranch,
    commit: info.commit,
  }),
);
