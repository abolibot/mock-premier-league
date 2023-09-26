import { Response } from "express";

export const jsonSuccessResponse = (
    res: Response,
    statusCode: number,
    message?: string,
    data?: {
        [key: string]: string;
    },
): Response => {
    return res.status(statusCode).json({
        status: true,
        message,
        data,
    });
};
