import AuthenticationError from "@/errors/authentication.error";
import { UserDoc } from "@/models/user.model";
import { NextFunction, Response, Request } from "express";
import { verifyJwt } from "@/helpers/jwt";

export default () => (req: Request, _res: Response, next: NextFunction) => {
    const token = req.session?.jwt;

    if (!token) {
        throw new AuthenticationError(
            "Missing or invalid authentication token",
        );
    }

    // let payload: JwtPayload;
    const payload = verifyJwt(token);

    const user = payload.user as UserDoc;

    if (!user) {
        return next();
    }

    req.session.user = user;

    next();
};
