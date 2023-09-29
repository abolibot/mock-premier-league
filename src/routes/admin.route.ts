import { Router } from "express";
import validate from "@/middlewares/request-validator";
import { userSignup as userSignupSchema } from "@/validation-schemas/auth.schema";
import adminController from "@/controllers/admin.controller";
import getCurrentUserMiddleware from "@/middlewares/get-current-user";
import requireAuthMiddleware from "@/middlewares/require-auth";
import adminOnlyMiddleware from "@/middlewares/admin-only";

const router = Router() as Router;
const getCurrentUser = getCurrentUserMiddleware();
const requireAuth = requireAuthMiddleware();
const adminOnly = adminOnlyMiddleware();

// register admin
router.post(
    "/",
    getCurrentUser,
    requireAuth,
    adminOnly,
    validate(userSignupSchema),
    adminController.registerAdmin,
);

export default router;
