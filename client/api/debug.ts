import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initDb, dbQuery, DB_TYPE } from "../../src/config/db";

let _inited = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!_inited) {
      try {
        await initDb();
      } catch (e: any) {
        // continue — initDb may have been run elsewhere
        console.warn('debug: initDb error', e?.message || e);
      }
      _inited = true;
    }

    // Try to get user count and a sample row
    let count: number | string | null = null;
    let sample: any = null;
    try {
      const rows = await dbQuery('SELECT COUNT(*) as count FROM users');
      if (rows && rows.length > 0) {
        // pg returns count as string
        count = rows[0].count ?? rows[0].COUNT ?? null;
      }
    } catch (err) {
      console.warn('debug: count query failed', err);
    }

    try {
      const s = await dbQuery('SELECT id, name, email, password_hash, created_at FROM users ORDER BY id DESC LIMIT 1');
      if (s && s.length > 0) sample = s[0];
    } catch (err) {
      console.warn('debug: sample query failed', err);
    }

    return res.status(200).json({ ok: true, dbType: DB_TYPE, count, sample });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}
