import PrayerSchedule from "../models/PrayerSchedule.js";
import { createCrudService } from "./crudService.js";

export default createCrudService(PrayerSchedule, "PrayerSchedule");
