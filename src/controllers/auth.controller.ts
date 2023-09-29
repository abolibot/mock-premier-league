import { Request, Response } from "express";

import { jsonSuccessResponse } from "@/helpers/utils";
import {
    buildSessionObject,
    signinUser,
    signupUser,
} from "@/services/auth.service";
import InternalServerError from "@/errors/internal-server.error";
import { generateJwt } from "@/helpers/jwt";

export default {
    userSignup: async (req: Request, res: Response) => {
        const userObj = { ...req.body, is_admin: false };

        const user = await signupUser(userObj);

        const userJwt = generateJwt(user);

        await buildSessionObject(req, userJwt);

        return jsonSuccessResponse(
            res,
            201,
            "user signed up successfully",
            user,
        );
    },

    userSignin: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await signinUser(email, password);

        const userJwt = generateJwt(user);

        await buildSessionObject(req, userJwt);

        return jsonSuccessResponse(
            res,
            200,
            "user signed in successfully",
            user,
        );
    },

    getCurrentUser: (req: Request, res: Response) => {
        const user = req.session.user;

        return jsonSuccessResponse(
            res,
            200,
            "user signed in successfully",
            user,
        );
    },

    userSignout: async (req: Request, res: Response) => {
        // clear the user from the session object and save.
        // this will ensure that re-using the old session id
        // does not have a logged in user
        req.session.user = null;
        req.session.save(function (err) {
            if (err)
                throw new InternalServerError(
                    "error signing out user, please try again shortly",
                );

            // regenerate the session, which is good practice to help
            // guard against forms of session fixation
            req.session.regenerate(function (err) {
                if (err)
                    throw new InternalServerError(
                        "error signing out user, please try again shortly",
                    );
            });
        });

        return jsonSuccessResponse(res, 200);
    },
};
