import { CustomBaseError } from "./custom-base.error";

export default class AuthenticationError extends CustomBaseError {
    protected _statusCode: number = 401;
}
