import Transaction from "../models/Transaction.js";
import { createCrudService } from "./crudService.js";

export default createCrudService(Transaction, "Transaction");
