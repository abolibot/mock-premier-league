import { CustomBaseError } from "./custom-base.error";

export default class AuthorizationError extends CustomBaseError {
    protected _statusCode: number = 403;

    serializeErrors() {
        return {
            status: this._status,
            error: "You are not authorized for this action",
        };
    }
}
