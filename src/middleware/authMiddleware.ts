import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/authService";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = (req.headers.authorization || (req.headers as any).Authorization) as string | undefined;
  if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !(decoded as any).userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  (req as any).user = { id: (decoded as any).userId };
  next();
}
