import { createCrudController } from "./crudControllerFactory.js";
import codingService from "../services/codingService.js";

const {
  create: createCodingSession,
  getAll: getCodingSessions,
  getById: getCodingSessionById,
  update: updateCodingSession,
  remove: deleteCodingSession,
} = createCrudController(codingService, "CodingSession");

export {
  createCodingSession,
  getCodingSessions,
  getCodingSessionById,
  updateCodingSession,
  deleteCodingSession,
};
