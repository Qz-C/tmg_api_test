import express from "express";
import StoreController from "../controllers/storeController";
import StoreService from "../services/storeService";

const router = express.Router();

const storeService = new StoreService();
const storeController = new StoreController(storeService);

/**
 * POST /
 * Route to add or update an item in the store.
 */
router.post("/", storeController.set.bind(storeController));

/**
 * GET /
 * Route to retrieve an item from the store.
 */
router.get("/:key", storeController.get.bind(storeController));

/**
 * DELETE /
 * Route to delete an item from the store.
 */
router.delete("/:key", storeController.delete.bind(storeController));

export default router;
