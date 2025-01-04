/**
 * @interface IStoreItem
 * @description Represents a key-value pair in the store with an optional TTL (Time-to-Live).
 */
export interface IStoreItem {
    key: string;
    value: string;
    ttl?: Date;
}
