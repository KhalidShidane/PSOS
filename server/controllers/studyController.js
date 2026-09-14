import { createCrudController } from "./crudControllerFactory.js";
import studyService from "../services/studyService.js";

const {
  create: createStudySession,
  getAll: getStudySessions,
  getById: getStudySessionById,
  update: updateStudySession,
  remove: deleteStudySession,
} = createCrudController(studyService, "StudySession");

export {
  createStudySession,
  getStudySessions,
  getStudySessionById,
  updateStudySession,
  deleteStudySession,
};
