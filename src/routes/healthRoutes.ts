import { Router } from 'express';
import { DB_TYPE, dbQuery, pgPool, mssqlPool } from '../config/db';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/ready', async (_req, res) => {
  try {
    if (DB_TYPE === 'mssql') {
      if (!mssqlPool) return res.status(503).json({ ready: false, reason: 'db not initialized' });
      // quick check
      await dbQuery('SELECT 1 AS ok');
    } else {
      if (!pgPool) return res.status(503).json({ ready: false, reason: 'db not initialized' });
      await dbQuery('SELECT 1 AS ok');
    }
    res.json({ ready: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(503).json({ ready: false, error: msg });
  }
});

export default router;
