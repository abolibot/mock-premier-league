import { Router } from "express";
import validate from "@/middlewares/request-validator";
import {
    createFixture as createFixtureSchema,
    updateFixture as updateFixtureSchema,
    updateFixtureResult as updateFixtureResultSchema,
} from "@/validation-schemas/fixture.schema";
import fixtureController from "@/controllers/fixture.controller";
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
    validate(createFixtureSchema),
    fixtureController.createFixture,
);

router.get("/", getCurrentUser, requireAuth, fixtureController.getFixtures);

router.get("/:id", getCurrentUser, requireAuth, fixtureController.getFixture);

router.patch(
    "/:id",
    getCurrentUser,
    requireAuth,
    adminOnly,
    validate(updateFixtureSchema),
    fixtureController.updateFixture,
);

router.patch(
    "/:id/result",
    getCurrentUser,
    requireAuth,
    adminOnly,
    validate(updateFixtureResultSchema),
    fixtureController.updateFixtureResult,
);

router.delete(
    "/:id",
    getCurrentUser,
    requireAuth,
    adminOnly,
    fixtureController.deleteFixture,
);

export default router;
