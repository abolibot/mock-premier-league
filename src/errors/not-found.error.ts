import { CustomBaseError } from "./custom-base.error";

export default class NotFoundError extends CustomBaseError {
    protected _statusCode: number = 404;
}
