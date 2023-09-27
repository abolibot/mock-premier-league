import { Router } from "express";

const router = Router() as Router;

// Health check
router.get("/health", (_req, res) => res.sendStatus(200));

export default router;
