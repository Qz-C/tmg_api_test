import { Response } from "express";
import { HttpResponse } from "../../utils/HttpResponse";
import { AppErrorCode } from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

describe("HttpResponse", () => {
    let mockResponse: Response;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
    });

    test("Should send a successful response", () => {
        const message = "Request successful";
        const data = { key: "value" };

        HttpResponse.success(mockResponse, message, data, StatusCodes.OK);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockResponse.send).toHaveBeenCalledWith({
            success: true,
            message,
            data,
            errorCode: undefined,
        });
    });

    test("Should send an error response with default error code", () => {
        const message = "An error occurred";

        HttpResponse.error(mockResponse, message);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(mockResponse.send).toHaveBeenCalledWith({
            success: false,
            message,
            data: null,
            errorCode: AppErrorCode.UNKNOWN,
        });
    });

    test("Should send an error response with a specific error code", () => {
        const message = "Resource not found";

        HttpResponse.error(mockResponse, message, StatusCodes.NOT_FOUND, AppErrorCode.RESOURCE_NOT_FOUND);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(mockResponse.send).toHaveBeenCalledWith({
            success: false,
            message,
            data: null,
            errorCode: AppErrorCode.RESOURCE_NOT_FOUND,
        });
    });
});
