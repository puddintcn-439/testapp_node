const mssql = require('mssql');

/**
 * Get connection string from ENV or CLI
 */
function getConnectionString() {
  const conn = process.env.MSSQL_ADMIN || process.argv[2];

  if (!conn) {
    throw new Error(
      'Missing connection string. Use MSSQL_ADMIN or pass as first argument (mssql://user:pass@host:port)'
    );
  }

  if (!conn.startsWith('mssql://')) {
    throw new Error('Invalid connection string format. Expected: mssql://...');
  }

  return conn;
}

/**
 * Build MSSQL config from URL
 */
function buildConfig(conn) {
  const u = new URL(conn);

  return {
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    server: u.hostname,
    port: u.port ? Number(u.port) : 1433,
    database: 'master', // only for admin script
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  };
}

/**
 * Validate database name (prevent injection)
 */
function validateDbName(name) {
  // chỉ cho phép chữ, số, underscore
  const valid = /^[a-zA-Z0-9_]+$/.test(name);
  if (!valid) {
    throw new Error('Invalid database name. Only letters, numbers, underscore allowed.');
  }
}

/**
 * Ensure database exists
 */
async function ensureDatabase(pool, dbName) {
  await pool.request()
    .input('dbName', mssql.NVarChar, dbName)
    .query(`
      IF DB_ID(@dbName) IS NULL
      BEGIN
          DECLARE @sql NVARCHAR(MAX) = 'CREATE DATABASE [' + @dbName + ']'
          EXEC(@sql)
      END
    `);
}

/**
 * Main execution
 */
async function main() {
  let pool;

  try {
    const conn = getConnectionString();
    const config = buildConfig(conn);

    const dbName = process.env.CREATE_DB_NAME || 'testapp_node';
    validateDbName(dbName);

    console.log(`Connecting to ${config.server}:${config.port}`);
    pool = await mssql.connect(config);

    console.log(`Ensuring database: ${dbName}`);
    await ensureDatabase(pool, dbName);

    console.log(`✅ Database ready: ${dbName}`);
    process.exit(0);

  } catch (err) {
    console.error('❌ Failed to create database');
    console.error(err);
    process.exit(1);

  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (e) {
        console.error('Error closing pool:', e);
      }
    }
  }
}

main();