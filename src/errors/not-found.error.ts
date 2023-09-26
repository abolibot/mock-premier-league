import { CustomBaseError } from "./custom-base.error";

export default class NotFoundError extends CustomBaseError {
    protected _statusCode: number = 404;

    // constructor(public message: string) {
    //   super(message);

    //   // Object.setPrototypeOf(this, NotFoundError.prototype);
    // }
}
