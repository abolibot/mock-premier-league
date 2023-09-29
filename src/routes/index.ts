import { Router } from "express";
import authRouter from "./auth.route";
import adminRouter from "./admin.route";

const router = Router() as Router;

// Health check
router.get("/health", (_req, res) => res.sendStatus(200));

router.use("/api/v1/auth", authRouter);

router.use("/api/v1/admins", adminRouter);

export default router;
