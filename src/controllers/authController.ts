import { Request, Response } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });
  try {
    const { user, token } = await authService.register(name, email, password);
    return res.status(201).json({ user, token });
  } catch (err: any) {
    if (err.message === "User exists") return res.status(409).json({ message: "User already exists" });
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  try {
    const { user, token } = await authService.login(email, password);
    return res.json({ user, token });
  } catch (err: any) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}
