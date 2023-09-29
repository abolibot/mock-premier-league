import { UserDoc } from "@/models/user.model";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { jwtSecret, jwtConfiguration } from "@/config";
import AuthenticationError from "@/errors/authentication.error";
import InternalServerError from "@/errors/internal-server.error";

export const generateJwt = (userObj: UserDoc): string => {
    const userJwt = jwt.sign(
        {
            user: {
                id: userObj.id,
                first_name: userObj.first_name,
                last_name: userObj.last_name,
                email: userObj.email,
                is_admin: userObj.is_admin,
            },
        },
        jwtSecret,
        jwtConfiguration,
    );

    return userJwt;
};

export const verifyJwt = (token: string): JwtPayload => {
    try {
        const payload = jwt.verify(
            token,
            jwtSecret,
            jwtConfiguration,
        ) as JwtPayload;

        return payload;
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            throw new AuthenticationError("Invalid authentication token");
        }

        throw new InternalServerError("Error authenticating user");
    }
};
