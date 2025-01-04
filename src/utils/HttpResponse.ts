import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppErrorCode } from './AppError';

/**
 * @class HttpResponse
 * @description A utility class for creating standardized HTTP responses.
 * @template T - The type of the data being returned in the response.
 */
export class HttpResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errorCode?: AppErrorCode;

    constructor(success: boolean, message: string, data?: T, errorCode?: AppErrorCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
    }

    /**
     * Sends a successful HTTP response.
     */
    static success<T>(
        res: Response,
        message = 'Request successful',
        data?: T,
        httpStatusCode: number = StatusCodes.OK
    ): void {
        res.status(httpStatusCode);
        res.send(new HttpResponse<T>(true, message, data));
    }

    /**
     * Sends an error HTTP response.
     */
    static error(
        res: Response,
        message: string,
        httpStatusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
        errorCode: AppErrorCode = AppErrorCode.UNKNOWN
    ): void {
        res.status(httpStatusCode);
        res.send(new HttpResponse<null>(false, message, null, errorCode));
    }
}
