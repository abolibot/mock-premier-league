import { Router } from "express";

const router = Router() as Router;

// Health check
router.get("/health", (_req, res) => res.sendStatus(200));

// generate a function that returns random numbers in typescript

export default router;
