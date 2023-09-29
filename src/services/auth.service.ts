import { Request } from "express";
import { findOneUser, storeUser } from "./user.service";
import { UserAttributes, UserDoc } from "@/models/user.model";
import BadRequestError from "@/errors/bad-request.error";
import AuthenticationError from "@/errors/authentication.error";
import Password from "@/helpers/password";
import InternalServerError from "@/errors/internal-server.error";

export const buildSessionObject = async (
    req: Request,
    jwt: string,
): Promise<void> => {
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
        if (err)
            throw new InternalServerError(
                "error creating user session, please try signin shortly",
            );

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
            if (err)
                throw new InternalServerError(
                    "error creating user session, please try signin shortly",
                );
        });
    });

    // store user information in session, typically a user id
    req.session.jwt = jwt;
};

export const signupUser = async (userObj: UserAttributes): Promise<UserDoc> => {
    const { email } = userObj;

    const existingUser = await findOneUser({ email });

    if (existingUser) {
        throw new BadRequestError("user with email already exist");
    }

    const user = await storeUser(userObj);

    return user;
};

export const signinUser = async (
    email: string,
    password: string,
): Promise<UserDoc> => {
    const userExists = await findOneUser({ email });

    if (!userExists) {
        throw new AuthenticationError("invalid email or password");
    }

    const passwordsMatch = await Password.compare(
        userExists.password,
        password,
    );

    if (!passwordsMatch) {
        throw new AuthenticationError("invalid email or password");
    }

    return userExists;
};
