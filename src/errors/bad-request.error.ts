import { CustomBaseError } from "./custom-base.error";

export default class BadRequestError extends CustomBaseError {
    protected _statusCode: number = 400;
}
