import StoreService from "../../services/storeService";
import { AppErrorCode } from "../../utils/AppError";

describe("StoreService", () => {
    let storeService: StoreService;

    beforeEach(() => {
        storeService = new StoreService();
    });

    test("Should add and retrieve a store item with TTL before expiration", () => {
        const key = "item1";
        const value = "12345";
        const ttl = 5; // TTL in seconds

        storeService.set(key, value, ttl);
        const item = storeService.get(key);

        expect(item).toEqual(
            expect.objectContaining({
                key,
                value,
                ttl: expect.any(Date),
            })
        );
    });

    test("Should add and retrieve a store item without TTL", () => {
        const key = "item2";
        const value = "54321";

        storeService.set(key, value);
        const item = storeService.get(key);

        expect(item).toEqual(
            expect.objectContaining({
                key,
                value,
                ttl: undefined, // No TTL
            })
        );
    });

    test("Should return null for a key that does not exists", () => {
        const item = storeService.get("this_key_does_not_exist");
        expect(item).toBeNull();
    });

    test("Should return null for a store item with the TTL expired", async () => {
        const key = "item3";
        const value = "67890";
        const ttl = 1; // TTL of 1 second

        storeService.set(key, value, ttl);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for TTL to expire

        const item = storeService.get(key);
        expect(item).toBeNull();
    });

    test("Should delete a store item", () => {
        const key = "item4";
        const value = "11111";

        storeService.set(key, value);
        storeService.delete(key);

        const item = storeService.get(key);
        expect(item).toBeNull();
    });

    test("Should throw RESOURCE_NOT_FOUND error when deleting a store item that does not exists", () => {
        const key = "nonExistingKey";

        expect(() => storeService.delete(key)).toThrow(
            expect.objectContaining({
                message: expect.any(String),
                errorCode: AppErrorCode.RESOURCE_NOT_FOUND,
            })
        );
    });

    test("Should overwrite value and TTL for an existing key", () => {
        const key = "item5";
        const value = "33333";
        const ttl = 10;

        storeService.set(key, value);

        const newValue = "new_value";
        const newTTL = 30;

        const updatedItem = storeService.set(key, newValue, newTTL);

        expect(updatedItem).toEqual(
            expect.objectContaining({
                key,
                value: newValue,
                ttl: expect.any(Date),
            })
        );
    });
});
