import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import StackService from "../services/stackService";
import {HttpResponse} from "../utils/HttpResponse";
import {AppErrorCode} from "../utils/AppError";

/**
 * @class StackController
 * @description Handles requests related to the stack.
 */
class StackController {
    constructor(private service: StackService) {}

    /**
     * Adds an item to the stack.
     * @param {Request} req - The incoming HTTP request object.
     * @param {Response} res - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middlewares function in the pipeline.
     */
    add(req: Request, res: Response, next: NextFunction): void {
        try {
            const { item } = req.body;

            if (!item) {
                return HttpResponse.error(
                    res,
                    "The 'item' field is required in the request body.",
                    StatusCodes.BAD_REQUEST,
                    AppErrorCode.INVALID_PARAMS
                );
            }

            this.service.add(item);

            HttpResponse.success(
                res,
                `Item '${item}' successfully added to the stack.`,
                item,
                StatusCodes.CREATED
            );
        } catch (err) {
            next(err);
        }
    }

    /**
     * Removes and returns the last item added to the stack.
     * @param {Request} req - The incoming HTTP request object.
     * @param {Response} res - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middlewares function in the pipeline.
     */
    getItem(req: Request, res: Response, next: NextFunction): void {
        try {
            // Pop the last item from the stack
            const item = this.service.pop();

            HttpResponse.success(
                res,
                `Item '${item}' successfully removed from the stack.`,
                item,
                StatusCodes.OK
            );
        } catch (err) {
            next(err);
        }
    }
}

export default StackController;
