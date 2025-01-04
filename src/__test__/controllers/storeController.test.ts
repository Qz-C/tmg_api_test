import { Request, Response, NextFunction } from "express";
import StoreController from "../../controllers/storeController";
import StoreService from "../../services/storeService";
import { AppError, AppErrorCode } from "../../utils/AppError";
import objectContaining = jasmine.objectContaining;

describe("StoreController", () => {
    let storeController: StoreController;
    let storeService: StoreService;
    let mockResponse: Response;
    let mockRequest: Partial<Request>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        storeService = new StoreService();
        storeController = new StoreController(storeService);

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            statusCode: undefined,
        } as unknown as Response;

        mockRequest = {};
        nextFunction = jest.fn();
    });

    test("Should add a store item with TTL", () => {
        const payload =  { key: "item", value: "4585784", ttl: 5 };
        mockRequest.body = payload;

        storeController.set(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: expect.any(String),
                data: expect.objectContaining({
                    key: payload.key,
                    value: payload.value,
                    ttl: expect.any(Date)
                }),
            })
        );
    });

    test("Should add a store item without TTL", () => {
        const payload = { key: "item2", value: "4589734985" };
        mockRequest.body = payload;

        storeController.set(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: expect.any(String),
                data: expect.objectContaining(payload),
            })
        );
    });

    test("Should fetch an added stored item added", () => {
        const payload = { key: "item3", value: "4589734985", ttl: 5 };
        storeService.set(payload.key, payload.value, payload.ttl);

        mockRequest.params = { key: payload.key };

        storeController.get(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: expect.any(String),
                data: payload.value,
            })
        );
    });

    test("Should return null for a store item with expired TTL", async () => {
        const payload = { key: "item5", value: "34ui34iu", ttl: 1 };
        storeService.set(payload.key, payload.value, payload.ttl);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        mockRequest.params = { key: payload.key };

        storeController.get(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
            success: true,
            message: expect.any(String),
            data: null,
        }));
    });

    test("Should return null for a store item that does not exists", () => {
        mockRequest.params = { key: "this_does_not_exists" };

        storeController.get(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: expect.any(String),
                data: null,
            }));
    });

    test("Should delete a store item", () => {
        const payload = {key: "item9", value: "4389988893"}
        storeService.set(payload.key, payload.value);

        mockRequest.params = { key: payload.key };

        storeController.delete(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: expect.any(String),
                data: null
            })
        );
    });

    test("should return RESOURCE_NOT_FOUND error when deleting a store item that does not exists", () => {
        mockRequest.params = { key: "nonExistingKey" };

        storeController.delete(mockRequest as Request, mockResponse, nextFunction);

        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
                errorCode: AppErrorCode.RESOURCE_NOT_FOUND,
            })
        );
    });

    test("Should overwrite the value and ttl fields for a store item when creating with the same key", () => {
        const payload = { key: "item10", value: "4389988893" };
        storeService.set(payload.key, payload.value);
        mockRequest.body = { key: payload.key, value: "new_value", ttl: 30 };

        storeController.set(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: expect.any(String),
                data: expect.objectContaining({ key: payload.key, value: "new_value" , ttl: expect.any(Date) }),
            })
        );
    });

    test("Should return error for missing params in set request", () => {
        mockRequest.body = { value: "87897976167" }; // Missing key

        storeController.set(mockRequest as Request, mockResponse, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: expect.any(String),
                data: null
            })
        );
    });
});
