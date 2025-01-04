import StackService from "../../services/stackService";
import { AppError, AppErrorCode } from "../../utils/AppError";

describe("StackService", () => {
    let stackService: StackService;

    beforeEach(() => {
        stackService = new StackService();
    });

    test("Should add an item to the stack", () => {
        const item = "item";

        stackService.add(item);

        expect(stackService.pop()).toBe(item);
    });

    test("Should remove and return the last added item in without change the order with multiple items", () => {
        const items = ["item1", "item2", "item3"];
        items.forEach((item) => stackService.add(item));

        expect(stackService.pop()).toBe("item3");
        expect(stackService.pop()).toBe("item2");
        expect(stackService.pop()).toBe("item1");
    });

    test("Should throw an error when popping from an empty stack", () => {
        expect(() => stackService.pop()).toThrow(
            expect.objectContaining({
                message: expect.any(String),
                errorCode: AppErrorCode.EMPTY_STACK,
            })
        );
    });
});
