import express from "express";
import StackController from "../controllers/stackController";
import StackService from "../services/stackService";

const router = express.Router();

const stackService = new StackService();
const stackController = new StackController(stackService);

/**
 * POST /add
 * Route to add an item to the stack.
 */
router.post("/add", stackController.add.bind(stackController));

/**
 * POST /pop
 * Route to remove and retrieve the last item from the stack (LIFO).
 */
router.post("/pop", stackController.getItem.bind(stackController));

export default router;