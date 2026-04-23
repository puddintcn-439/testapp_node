import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initDb } from "../../src/config/db";
import * as authService from "../../src/services/authService";

let isDbInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!isDbInitialized) {
    try {
      await initDb();
    } catch (err: any) {
      console.warn("DB init failed:", err?.message || err);
    }
    isDbInitialized = true;
  }

  let body: any = (req as any).body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { /* ignore */ }
  }

  const { name, email, password } = body ?? {};
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

  try {
    const { user, token } = await authService.register(name, email, password);
    return res.status(201).json({ user, token });
  } catch (err: any) {
    if (err?.message === "User exists") return res.status(409).json({ message: "User already exists" });
    console.error("register error", err);
    return res.status(500).json({ message: "Internal error" });
  }
}
