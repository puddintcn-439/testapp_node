#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { initDb, dbQuery, DB_TYPE } from "../src/config/db";

const MIGRATIONS_DIR = path.join(
  __dirname,
  "..",
  "migrations",
  DB_TYPE === "mssql" ? "mssql" : "postgres"
);

function checksum(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function ensureMigrationsTable() {
  if (DB_TYPE === "mssql") {
    const sql = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='migrations' AND xtype='U')
  CREATE TABLE migrations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    checksum NVARCHAR(64) NOT NULL,
    run_on DATETIME2 NOT NULL
  );
`;
    await dbQuery(sql);
  } else {
    await dbQuery(`
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  checksum TEXT NOT NULL,
  run_on TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`);
  }
}

async function appliedMigrations() {
  const rows = await dbQuery("SELECT name FROM migrations ORDER BY id");
  return rows.map((r: any) => r.name);
}

async function applyMigration(filename: string) {
  const full = path.join(MIGRATIONS_DIR, filename);
  const content = fs.readFileSync(full, "utf8");
  console.log("Applying", filename);
  await dbQuery(content);
  const ch = checksum(content);
  await dbQuery("INSERT INTO migrations(name, checksum, run_on) VALUES($1,$2,$3)", [
    filename,
    ch,
    new Date(),
  ]);
}

async function rollbackMigration(filename: string) {
  const downFile = filename.replace(/\.sql$/, ".down.sql");
  const downPath = path.join(MIGRATIONS_DIR, downFile);
  if (!fs.existsSync(downPath)) {
    throw new Error(`No down migration found for ${filename}`);
  }
  const content = fs.readFileSync(downPath, "utf8");
  console.log("Rolling back", filename);
  await dbQuery(content);
  await dbQuery("DELETE FROM migrations WHERE name=$1", [filename]);
}

async function run() {
  const cmd = process.argv[2] || "up";
  await initDb();

  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.warn("Migrations directory not found:", MIGRATIONS_DIR);
    process.exit(1);
  }

  await ensureMigrationsTable();
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql") && !f.endsWith(".down.sql"))
    .sort();
  const applied = await appliedMigrations();

  if (cmd === "up") {
    for (const f of files) {
      if (!applied.includes(f)) {
        await applyMigration(f);
      } else {
        console.log("Skipping already applied", f);
      }
    }
    console.log("Migrations applied");
    process.exit(0);
  } else if (cmd === "down") {
    const last = applied[applied.length - 1];
    if (last) {
      await rollbackMigration(last);
      console.log("Rolled back", last);
    } else {
      console.log("No migrations to rollback");
    }
    process.exit(0);
  } else if (cmd === "status") {
    console.log("Applied migrations:", applied.join(", "));
    process.exit(0);
  } else {
    console.error("Unknown command", cmd);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
