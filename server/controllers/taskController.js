import { createCrudController } from "./crudControllerFactory.js";
import taskService from "../services/taskService.js";

const {
  create: createTask,
  getAll: getTasks,
  getById: getTaskById,
  update: updateTask,
  remove: deleteTask,
} = createCrudController(taskService, "Task");

export { createTask, getTasks, getTaskById, updateTask, deleteTask };
