import { ZodIssue } from "zod/lib";
import { CustomBaseError } from "./custom-base.error";

export default class RequestValidationError extends CustomBaseError {
    protected _statusCode: number = 422;
    message: string;
    private errors: ZodIssue[];

    constructor(errors: ZodIssue[]) {
        const message =
            "Invalid request data. Please review request and try again.";
        super(message);

        this.message = message;
        this.errors = errors;

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return {
            status: this._status,
            error: this.message,
            errors: this.errors,
        };
    }
}
