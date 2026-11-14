import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
const url = process.env.DATABASE_URL;
if (!url || new URL(url).hostname.includes("-pooler"))
  throw new Error("Use DATABASE_URL direta para migrações.");
const sql = neon(url);
const migration = await readFile(
  new URL(
    "../packages/database/migrations/0001_bootstrap.sql",
    import.meta.url,
  ),
  "utf8",
);
const checksum = createHash("sha256").update(migration).digest("hex");
const [existing] =
  await sql`SELECT to_regclass('public.schema_migrations') AS name`;
if (existing.name) {
  const [record] =
    await sql`SELECT checksum FROM schema_migrations WHERE version = '0001'`;
  if (record?.checksum !== checksum)
    throw new Error("Migração divergente; não foi aplicada.");
  console.log("0001 já aplicada; checksum validado.");
} else {
  const statements = migration
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  await sql.transaction([
    ...statements.map((s) => sql.query(s)),
    sql`INSERT INTO schema_migrations(version, checksum) VALUES ('0001', ${checksum})`,
  ]);
  console.log("0001 aplicada em transação.");
}
