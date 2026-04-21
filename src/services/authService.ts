import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userService from "./userService";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const SALT_ROUNDS = 10;

export async function register(name: string, email: string, password: string) {
  const existing = await userService.getUserByEmail(email);
  if (existing) throw new Error("User exists");
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userService.createUser(name, email, hash);
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
}

export async function login(email: string, password: string) {
  const user = await userService.getUserByEmail(email);
  if (!user || !user.password_hash) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error("Invalid credentials");
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
