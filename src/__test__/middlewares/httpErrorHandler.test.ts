import { Request, Response, NextFunction } from "express";
import { httpErrorHandler } from "../../middleware/httpErrorHandler";
import { AppError, AppErrorCode } from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

describe("httpErrorHandler Middleware", () => {
    let mockResponse: Response;
    let mockRequest: Partial<Request>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;

        mockRequest = {};
        nextFunction = jest.fn();
    });

    test("Should handle AppError and send appropriate response", () => {
        const error = new AppError("", AppErrorCode.RESOURCE_NOT_FOUND);

        httpErrorHandler(error, mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(mockResponse.send).toHaveBeenCalledWith({
            success: false,
            message: expect.any(String),
            data: null,
            errorCode: AppErrorCode.RESOURCE_NOT_FOUND,
        });
    });

    test("Should handle generic errors and send default response", () => {
        const error = new Error();

        httpErrorHandler(error, mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(mockResponse.send).toHaveBeenCalledWith({
            success: false,
            message: expect.any(String),
            data: null,
            errorCode: AppErrorCode.UNKNOWN,
        });
    });
});
