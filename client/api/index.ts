import { app, initDb } from "../../src/index";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { IncomingMessage, ServerResponse } from "http";

let isDbInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isDbInitialized) {
    try {
      await initDb();
      isDbInitialized = true;
    } catch (err: any) {
      console.warn("DB init failed on Vercel:", err.message || err);
      isDbInitialized = true; // don't retry every request
    }
  }
  return app(req as unknown as IncomingMessage, res as unknown as ServerResponse);
}
