import { createCrudController } from "./crudControllerFactory.js";
import assignmentService from "../services/assignmentService.js";

const {
  create: createAssignment,
  getAll: getAssignments,
  getById: getAssignmentById,
  update: updateAssignment,
  remove: deleteAssignment,
} = createCrudController(assignmentService, "Assignment");

export { createAssignment, getAssignments, getAssignmentById, updateAssignment, deleteAssignment };
