import {AppErrorCode, AppError} from "../utils/AppError";

/**
 * @class StackService
 * @description Provides an in-memory implementation of a stack (LIFO).
 */
class StackService {
    private stack:string[];

    constructor() {
        this.stack = [];
    }

    /**
     * @method add
     * @description Adds an item to in-memory stack
     * @param {string} item
     */
    public add(item: string): void {
        this.stack.push(item);
    }

    /**
     * @method pop
     * @description Removes and returns the last item from the stack (LIFO).
     * @throws {AppError} If the stack is empty.
     * @returns {string} The last item in the stack.
     */
    public pop(): string {
        if(this.stack.length < 1) {
            throw new AppError('The stack is empty', AppErrorCode.EMPTY_STACK);
        }
        return this.stack.pop() as string;
    }
}

export default StackService;