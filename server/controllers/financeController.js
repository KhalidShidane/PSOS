import { createCrudController } from "./crudControllerFactory.js";
import financeService from "../services/financeService.js";

const {
  create: createTransaction,
  getAll: getTransactions,
  getById: getTransactionById,
  update: updateTransaction,
  remove: deleteTransaction,
} = createCrudController(financeService, "Transaction");

export { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction };
