import { Router } from "express";
import validate from "@/middlewares/request-validator";
import {
    userSignup as userSignupSchema,
    userSignin as userSigninSchema,
} from "@/validation-schemas/auth.schema";
import authController from "@/controllers/auth.controller";
import getCurrentUserMiddleware from "@/middlewares/get-current-user";
import requireAuthMiddleware from "@/middlewares/require-auth";

const router = Router() as Router;
const getCurrentUser = getCurrentUserMiddleware();
const requireAuth = requireAuthMiddleware();

// regular user signup
router.post("/signup", validate(userSignupSchema), authController.userSignup);

// admin and regular user signin
router.post("/signin", validate(userSigninSchema), authController.userSignin);

// get current user
router.get(
    "/current-user",
    getCurrentUser,
    requireAuth,
    authController.getCurrentUser,
);

// get current user
router.get("/signout", getCurrentUser, requireAuth, authController.userSignout);

export default router;
