import Task from "../models/Task.js";
import { createCrudService } from "./crudService.js";

export default createCrudService(Task, "Task");
