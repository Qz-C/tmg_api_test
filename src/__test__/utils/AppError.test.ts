import { AppError, AppErrorCode } from "../../utils/AppError";

describe("AppError", () => {
    test("Should create an error with a default error code", () => {
        const message = "An unknown error occurred";

        const error = new AppError(message);

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(message);
        expect(error.errorCode).toBe(AppErrorCode.UNKNOWN);
    });

    test("Should create an error with a specific error code", () => {
        const message = "Resource not found";

        const error = new AppError(message, AppErrorCode.RESOURCE_NOT_FOUND);

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(message);
        expect(error.errorCode).toBe(AppErrorCode.RESOURCE_NOT_FOUND);
    });

    test("Should correctly capture the stack trace", () => {
        const message = "Custom error message";

        const error = new AppError(message);

        expect(error.stack).toBeDefined();
        expect(error.stack).toContain("AppError");
    });
});
