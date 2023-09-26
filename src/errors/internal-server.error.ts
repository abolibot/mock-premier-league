import { CustomBaseError } from "./custom-base.error";

export default class InternalServerError extends CustomBaseError {
    protected _statusCode: number = 500;
}
