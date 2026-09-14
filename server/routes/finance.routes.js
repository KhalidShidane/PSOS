import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/financeController.js";

const router = Router();

router.use(protect);

router.route("/").get(getTransactions).post(createTransaction);
router
  .route("/:id")
  .get(getTransactionById)
  .put(updateTransaction)
  .patch(updateTransaction)
  .delete(deleteTransaction);

export default router;
