import { Pool as PgPool } from "pg";
import * as mssql from "mssql";

export const DB_TYPE = (process.env.DB_TYPE || "pg").toLowerCase();

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
    const createSql = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
  CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password_hash NVARCHAR(255) NULL,
    created_at DATETIME2 NULL
  );
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'password_hash')
  ALTER TABLE users ADD password_hash NVARCHAR(255) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'created_at')
  ALTER TABLE users ADD created_at DATETIME2 NULL;
-- Restaurant tables (physical tables in the venue)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='restaurant_tables' AND xtype='U')
  CREATE TABLE restaurant_tables (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NULL,
    capacity INT NULL,
    location NVARCHAR(255) NULL,
    is_active BIT DEFAULT 1
  );

-- Menu items for pre-orders
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='menu_items' AND xtype='U')
  CREATE TABLE menu_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NULL,
    price DECIMAL(10,2) NOT NULL,
    is_available BIT DEFAULT 1,
    created_at DATETIME2 NULL
  );

-- Bookings/reservations
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bookings' AND xtype='U')
  CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    table_id INT NULL,
    party_size INT NOT NULL,
    start_time DATETIME2 NOT NULL,
    end_time DATETIME2 NULL,
    status NVARCHAR(50) DEFAULT 'pending',
    notes NVARCHAR(MAX) NULL,
    created_at DATETIME2 NULL
  );

-- Booking items (optional pre-ordered menu items attached to a booking)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='booking_items' AND xtype='U')
  CREATE TABLE booking_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT NOT NULL,
    menu_item_id INT NULL,
    quantity INT DEFAULT 1,
    price_at_order DECIMAL(10,2) NOT NULL
  );

-- Foreign keys (add only if not present)
IF EXISTS (SELECT * FROM sysobjects WHERE name='bookings' AND xtype='U')
  AND EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
  AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_bookings_user')
BEGIN
  ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id);
END

IF EXISTS (SELECT * FROM sysobjects WHERE name='bookings' AND xtype='U')
  AND EXISTS (SELECT * FROM sysobjects WHERE name='restaurant_tables' AND xtype='U')
  AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_bookings_table')
BEGIN
  ALTER TABLE bookings ADD CONSTRAINT fk_bookings_table FOREIGN KEY (table_id) REFERENCES restaurant_tables(id);
END

IF EXISTS (SELECT * FROM sysobjects WHERE name='booking_items' AND xtype='U')
  AND EXISTS (SELECT * FROM sysobjects WHERE name='bookings' AND xtype='U')
  AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_booking_items_booking')
BEGIN
  ALTER TABLE booking_items ADD CONSTRAINT fk_booking_items_booking FOREIGN KEY (booking_id) REFERENCES bookings(id);
END

IF EXISTS (SELECT * FROM sysobjects WHERE name='booking_items' AND xtype='U')
  AND EXISTS (SELECT * FROM sysobjects WHERE name='menu_items' AND xtype='U')
  AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_booking_items_menu')
BEGIN
  ALTER TABLE booking_items ADD CONSTRAINT fk_booking_items_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(id);
END;
`;
    await mssqlPool.request().batch(createSql);
  } else {
    const connStr =
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/testapp_node";
    pgPool = new PgPool({
      connectionString: connStr,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await pgPool.query(`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE TABLE IF NOT EXISTS restaurant_tables (
  id SERIAL PRIMARY KEY,
  name TEXT,
  capacity INT,
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  table_id INT REFERENCES restaurant_tables(id) ON DELETE SET NULL,
  party_size INT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_items (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
  menu_item_id INT REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  price_at_order NUMERIC(10,2) NOT NULL
);
`);
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
