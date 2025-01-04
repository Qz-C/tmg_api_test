import { Request, Response, NextFunction } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { HttpResponse } from "../utils/HttpResponse";
import { AppError, AppErrorCode } from "../utils/AppError";

/**
 * Express middlewares to handle errors and send a consistent error response.
 * @param {Error} err - The error object thrown by the application.
 * @param {Request} req - The incoming HTTP request object.
 * @param {Response} res - The outgoing HTTP response object.
 * @param {NextFunction} next - The next middlewares function in the pipeline.
 *
 * Handles:
 * - Known application errors (e.g., instances of `AppError`) with custom error codes and status.
 * - Unknown errors defaulting to HTTP 500 (Internal Server Error).
 */
export function httpErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(`[Error] ${err.message}`);

    let httpStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let errorCode = AppErrorCode.UNKNOWN;

    // Handle known application errors
    if (err instanceof AppError) {
        switch (err.errorCode) {
            case AppErrorCode.EMPTY_STACK:
                httpStatusCode = StatusCodes.BAD_REQUEST;
                break;
            case AppErrorCode.RESOURCE_NOT_FOUND:
                httpStatusCode = StatusCodes.NOT_FOUND;
                break;
            default:
                httpStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }

        errorCode = err.errorCode;
    }

    // Fallback for unknown errors
    const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

    HttpResponse.error(res, message, httpStatusCode, errorCode);
}
