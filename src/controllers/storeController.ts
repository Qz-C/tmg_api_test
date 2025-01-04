import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {HttpResponse} from "../utils/HttpResponse";
import StoreService from "../services/storeService";
import {AppErrorCode} from "../utils/AppError";

/**
 * @class StoreController
 * @description Handles requests related to the key-value store.
 */
class StoreController {
    constructor(private service: StoreService) {}

    /**
     * Sets a key-value pair in the store, optionally with a TTL.
     * @param {Request} req - The incoming HTTP request object. (Must contain 'key', 'value', and optionally 'ttl' in the body).
     * @param {Response} res - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middlewares function in the pipeline.
     */
    set(req: Request, res: Response, next: NextFunction): void {
        try {
            const { key, value, ttl } = req.body;

            if (!key || !value) {
                return HttpResponse.error(
                    res,
                    "The 'key' and 'value' fields are required in the request body.",
                    StatusCodes.BAD_REQUEST,
                    AppErrorCode.INVALID_PARAMS
                );
            }

            if (ttl && isNaN(ttl)) {
                return HttpResponse.error(
                    res,
                    "The 'ttl' field must be a valid number expressed in seconds.",
                    StatusCodes.BAD_REQUEST,
                    AppErrorCode.INVALID_PARAMS
                );
            }

            const item = this.service.set(key, value, ttl);

            HttpResponse.success(
                res,
                `Item successfully added to the store.`,
                item,
                StatusCodes.CREATED
            );
        } catch (err) {
            next(err);
        }
    }

    /**
     * Retrieves the value associated with a key from the store.
     * @param {Request} req - The incoming HTTP request object. (Must contain the 'key' parameter in the URL).
     * @param {Response} res - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middlewares function in the pipeline.
     */
    get(req: Request, res: Response, next: NextFunction): void {
        try {
            const { key } = req.params;

            if (!key) {
                return HttpResponse.error(
                    res,
                    "The 'key' parameter is required in the request URL.",
                    StatusCodes.BAD_REQUEST,
                    AppErrorCode.INVALID_PARAMS

                );
            }

            const item = this.service.get(key as string);

            HttpResponse.success(
                res,
                "Item successfully retrieved from the store.",
                item?.value || null,
                StatusCodes.OK
            );
        } catch (err) {
            next(err);
        }
    }

    /**
     * Deletes a key-value pair from the store.
     * @param {Request} req - The incoming HTTP request object. (Must contain the 'key' parameter in the URL).
     * @param {Response} res - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middlewares function in the pipeline.
     */
    delete(req: Request, res: Response, next: NextFunction): void {
        try {
            const { key } = req.params;

            if (!key) {
                return HttpResponse.error(
                    res,
                    "The 'key' parameter is required in the request URL.",
                    StatusCodes.BAD_REQUEST,
                    AppErrorCode.INVALID_PARAMS
                );
            }

            this.service.delete(key);

            HttpResponse.success(
                res,
                `Item successfully removed from the store.`,
                null,
                StatusCodes.OK
            );
        } catch (err) {
            next(err);
        }
    }
}

export default StoreController;
