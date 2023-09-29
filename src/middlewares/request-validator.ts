import RequestValidationError from "@/errors/request-validation.error";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export default (schema: AnyZodObject) =>
    (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse({
                params: req.params,
                query: req.query,
                body: req.body,
            });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                throw new RequestValidationError(error.errors);
            }
            next(error);
        }
    };
