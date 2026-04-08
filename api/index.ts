import { app, initDb } from "../src/index";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { IncomingMessage, ServerResponse } from "http";

let isDbInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isDbInitialized) {
    await initDb();
    isDbInitialized = true;
  }
  return app(req as unknown as IncomingMessage, res as unknown as ServerResponse);
}
