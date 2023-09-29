import AuthorizationError from "@/errors/authorization.error";
import { NextFunction, Response, Request } from "express";

export default () => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.session?.user?.is_admin) {
        throw new AuthorizationError();
    }
    next();
};
