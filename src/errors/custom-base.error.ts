import { isProduction } from "@/config";
import { ZodIssue } from "zod/lib";

export class CustomBaseError extends Error {
    protected _statusCode: number = 500;
    protected _status: boolean = false;
    message: string;

    constructor(message: string) {
        super(message);

        this.message = message;

        Object.setPrototypeOf(this, CustomBaseError.prototype);
    }

    serializeErrors(): SerializedError {
        return {
            status: this._status,
            error: this.message,
            stack: isProduction ? undefined : this.stack, // Only show stack in development
        };
    }

    get statusCode(): number {
        return this._statusCode;
    }
}

export interface SerializedError {
    status: boolean;
    error: string;
    errors?: ZodIssue[];
    stack?: string;
}

export interface ICustomBaseError extends Error {
    _statusCode: number;
    message: string;
    _status: boolean;
    serializeErrors(): SerializedError;
    getStatusCode(): number;
}
