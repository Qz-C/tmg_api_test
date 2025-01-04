import { Request, Response, NextFunction } from "express";
import StackController from "../../controllers/stackController";
import StackService from "../../services/stackService";
import { AppErrorCode } from "../../utils/AppError";

describe("StackController", () => {
    let stackController: StackController;
    let stackService: StackService;
    let mockResponse: Response;
    let mockRequest: Partial<Request>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        stackService = new StackService();
        stackController = new StackController(stackService);

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            statusCode: undefined,
        } as unknown as Response;

        mockRequest = {};
        nextFunction = jest.fn();
    });

    test("Should add an item to the stack", () => {
        const payload = { item: "item" };
        mockRequest.body = payload;

        stackController.add(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: expect.any(String),
                data: payload.item,
            })
        );
    });

    test("Should return error if item field is missing in add request", () => {
        mockRequest.body = {};

        stackController.add(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: expect.any(String),
                data: null,
            })
        );
    });

    test("Should retrieve and remove the last added item", () => {
        stackService.add("item");
        mockRequest = {};

        stackController.getItem(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: expect.any(String),
                data: "item",
            })
        );
    });

    test("Should return error if stack is empty when trying to retrieve an item", () => {
        mockRequest = {};

        stackController.getItem(mockRequest as Request, mockResponse, nextFunction);

        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                errorCode: AppErrorCode.EMPTY_STACK,
            })
        );
    });
});
