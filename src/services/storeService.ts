import { AppErrorCode, AppError } from "../utils/AppError";
import { IStoreItem } from "../types/IStoreItem";

/**
 * @class StoreService
 * @description Provides an in-memory key-value store with optional TTL support.
 */
class StoreService {
    private store: IStoreItem[];

    constructor() {
        this.store = [];
    }

    /**
     * @method private find
     * @description Finds a store item by its key.
     * @param {string} key The key of the item to find.
     * @returns {IStoreItem | undefined} The matching store item or undefined if not found.
     */
    private find(key: string): IStoreItem | undefined {
        return this.store.find((storeItem) => storeItem.key === key);
    }

    /**
     * @method set
     * @description Sets or updates a key-value pair in the store.
     * If the key already exists, updates its value and TTL.
     * @param {string} key The key to set or update.
     * @param {string} value The value to associate with the key.
     * @param {number} [ttl] Optional TTL (in seconds) for the key.
     * @returns {IStoreItem} The created or updated store item.
     */
    public set(key: string, value: string, ttl?: number): IStoreItem {

        const expirationDate: Date | undefined = ttl && !isNaN(ttl) ?
                new Date(Date.now() + ttl * 1000) :
                undefined;

        let item = this.find(key);
        if (!item) {
            item = { key, value, ttl: expirationDate };
            this.store.push(item);
        } else {
            item.value = value;
            item.ttl = expirationDate;
        }

        return item;
    }

    /**
     * @method get
     * @description Retrieves a value from the store by its key.
     * Automatically filters out expired items.
     * @param {string} key The key to retrieve.
     * @returns {IStoreItem | null} The store item if found and not expired, otherwise null.
     */
    public get(key: string): IStoreItem | null {
        const item = this.find(key);

        if (!item) {
            return null;
        }

        if (item.ttl && item.ttl < new Date()) {
            return null;
        }

        return item;
    }

    /**
     * @method delete
     * @description Deletes a key-value pair from the store.
     * @param {string} key The key to delete.
     * @throws {AppError} If the key does not exist in the store.
     */
    public delete(key: string): void {
        const index = this.store.findIndex((storeItem) => storeItem.key === key);

        if (index === -1) {
            throw new AppError("Key not found", AppErrorCode.RESOURCE_NOT_FOUND);
        }

        // Remove the item from the store
        this.store.splice(index, 1);
    }
}

export default StoreService;
