export class HttpError extends Error {
    public errorCode: number;
    constructor(msg: string, errorCode?: number) {
        super(msg);
        Object.setPrototypeOf(this, HttpError.prototype);
        this.errorCode = errorCode ?? 400;
    }
}