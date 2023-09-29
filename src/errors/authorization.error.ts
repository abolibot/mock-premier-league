import { CustomBaseError } from "./custom-base.error";

export default class AuthorizationError extends CustomBaseError {
    protected _statusCode: number = 403;
    message: string;

    constructor() {
        const message = "You are not authorized for this action";
        super(message);

        this.message = message;

        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }

    serializeErrors() {
        return {
            status: this._status,
            error: this.message,
        };
    }
}
