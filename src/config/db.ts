import { Pool as PgPool } from "pg";
import * as mssql from "mssql";

export const DB_TYPE = (process.env.DB_TYPE || "mssql").toLowerCase();

export let pgPool: PgPool | null = null;
export let mssqlPool: mssql.ConnectionPool | null = null;

export async function initDb() {
  if (DB_TYPE === "mssql") {
    const conn =
      process.env.DATABASE_URL ||
      process.env.MSSQL_CONNECTION ||
      "mssql://sa:NewPass123@V005056:1433/testapp_node";
    const u = new URL(conn);
    const config: mssql.config = {
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      server: u.hostname,
      port: u.port ? Number(u.port) : 1433,
      database: u.pathname ? u.pathname.replace(/^\//, "") : undefined,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    };
    mssqlPool = await new mssql.ConnectionPool(config).connect();
    const createSql = `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL, email NVARCHAR(255) NOT NULL)`;
    await mssqlPool.request().batch(createSql);
  } else {
    const connStr =
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/testapp_node";
    pgPool = new PgPool({ connectionString: connStr });
    await pgPool.query(
      `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL)`
    );
  }
}

function toMssqlSql(sql: string) {
  return sql.replace(/\$([0-9]+)/g, (_, n) => `@p${Number(n) - 1}`);
}

export async function dbQuery(sql: string, params: any[] = []) {
  if (DB_TYPE === "mssql") {
    if (!mssqlPool) throw new Error("MSSQL pool not initialized");
    const req = mssqlPool.request();
    params.forEach((p, i) => req.input(`p${i}`, p));
    const result = await req.query(toMssqlSql(sql));
    return result.recordset;
  } else {
    if (!pgPool) throw new Error("Postgres pool not initialized");
    const res = await pgPool.query(sql, params);
    return res.rows;
  }
}
