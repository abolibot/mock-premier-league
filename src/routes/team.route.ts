import { Router } from "express";
import validate from "@/middlewares/request-validator";
import {
    createTeam as createTeamSchema,
    updateTeam as updateTeamSchema,
    updateTeamStatus as updateTeamStatusSchema,
} from "@/validation-schemas/team.schema";
import teamController from "@/controllers/team.controller";
import getCurrentUserMiddleware from "@/middlewares/get-current-user";
import requireAuthMiddleware from "@/middlewares/require-auth";
import adminOnlyMiddleware from "@/middlewares/admin-only";

const router = Router() as Router;
const getCurrentUser = getCurrentUserMiddleware();
const requireAuth = requireAuthMiddleware();
const adminOnly = adminOnlyMiddleware();

router.post(
    "/",
    getCurrentUser,
    requireAuth,
    adminOnly,
    validate(createTeamSchema),
    teamController.createTeam,
);

router.get("/", getCurrentUser, requireAuth, teamController.getTeams);

router.get("/:id", getCurrentUser, requireAuth, teamController.getTeam);

router.patch(
    "/:id",
    getCurrentUser,
    requireAuth,
    adminOnly,
    validate(updateTeamSchema),
    teamController.updateTeam,
);

router.patch(
    "/:id/status",
    getCurrentUser,
    requireAuth,
    adminOnly,
    validate(updateTeamStatusSchema),
    teamController.updateTeamStatus,
);

export default router;
