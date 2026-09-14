import { createCrudController } from "./crudControllerFactory.js";
import scheduleService from "../services/scheduleService.js";

const {
  create: createSchedule,
  getAll: getSchedules,
  getById: getScheduleById,
  update: updateSchedule,
  remove: deleteSchedule,
} = createCrudController(scheduleService, "Schedule");

export { createSchedule, getSchedules, getScheduleById, updateSchedule, deleteSchedule };
