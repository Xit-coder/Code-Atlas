import assert from "node:assert/strict";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const id = crypto.randomUUID();
await sql.transaction([
  sql`INSERT INTO environment_checks(id, component) VALUES (${id}, 'database-smoke')`,
  sql`SELECT id FROM environment_checks WHERE id = ${id}`,
]);
const [row] =
  await sql`SELECT id, component FROM environment_checks WHERE id = ${id}`;
assert.equal(row.id, id);
assert.equal(row.component, "database-smoke");
const rollbackId = crypto.randomUUID();
await assert.rejects(
  sql.transaction([
    sql`INSERT INTO environment_checks(id, component) VALUES (${rollbackId}, 'database-smoke')`,
    sql`INSERT INTO environment_checks(component) VALUES ('invalid-component')`,
  ]),
  (error) => error.code === "23514",
);
const rolledBack =
  await sql`SELECT id FROM environment_checks WHERE id = ${rollbackId}`;
assert.equal(rolledBack.length, 0);
console.log(
  JSON.stringify({
    result: "passed",
    persistedCheckId: id,
    checks: [
      "transaction",
      "insert",
      "read-after-commit",
      "check-constraint",
      "atomic-rollback",
    ],
  }),
);
