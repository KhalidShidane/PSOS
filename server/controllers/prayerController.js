import { createCrudController } from "./crudControllerFactory.js";
import prayerService from "../services/prayerService.js";

const {
  create: createPrayerSchedule,
  getAll: getPrayerSchedules,
  getById: getPrayerScheduleById,
  update: updatePrayerSchedule,
  remove: deletePrayerSchedule,
} = createCrudController(prayerService, "PrayerSchedule");

export {
  createPrayerSchedule,
  getPrayerSchedules,
  getPrayerScheduleById,
  updatePrayerSchedule,
  deletePrayerSchedule,
};
