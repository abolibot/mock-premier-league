import "dotenv/config";

import { CustomBaseError } from "@/errors/custom-base.error";
import { NextFunction, Response, Request } from "express";

export default (
    err: Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
) => {
    if (err instanceof CustomBaseError) {
        return res.status(err.statusCode).json(err.serializeErrors());
    }

    return res.status(500).json({
        status: false,
        message: "Oops! Internal server error",
    });
};
