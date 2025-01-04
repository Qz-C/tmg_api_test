/**
 * @enum AppErrorCode
 * @description Enumerates error codes for application-specific errors.
 */
export enum AppErrorCode {
    UNKNOWN = "UNKNOWN",
    EMPTY_STACK = "EMPTY_STACK",
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
    INVALID_PARAMS = "INVALID_PARAMS"
}

/**
 * @class AppError
 * @description Custom error class for handling application-specific errors.
 * Extends the native `Error` class to include error codes for better error categorization.
 */
export class AppError extends Error {
    errorCode: AppErrorCode;

    constructor(message: string, errorCode: AppErrorCode = AppErrorCode.UNKNOWN) {
        super(message);
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
