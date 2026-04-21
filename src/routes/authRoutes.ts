import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

/**
 * Auth endpoints
 */
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
