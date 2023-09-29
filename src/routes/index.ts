import { Router } from "express";
import authRouter from "./auth.route";
import adminRouter from "./admin.route";
import teamRouter from "./team.route";
import fixtureRouter from "./fixture.route";

const router = Router() as Router;

// Health check
router.get("/health", (_req, res) => res.sendStatus(200));

router.use("/api/v1/auth", authRouter);

router.use("/api/v1/admins", adminRouter);

router.use("/api/v1/teams", teamRouter);

router.use("/api/v1/fixtures", fixtureRouter);

export default router;
