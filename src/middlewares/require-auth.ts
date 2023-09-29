import AuthenticationError from "@/errors/authentication.error";
import { NextFunction, Response, Request } from "express";

export default () => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.session?.user) {
        throw new AuthenticationError(
            "Missing or invalid authentication token",
        );
    }
    next();
};
