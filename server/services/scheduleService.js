import Schedule from "../models/Schedule.js";
import { createCrudService } from "./crudService.js";
import { assertCourseOwnership } from "./helpers/assertCourseOwnership.js";

const base = createCrudService(Schedule, "Schedule");

const create = async (userId, data) => {
  await assertCourseOwnership(userId, data.course);
  return base.create(userId, data);
};

const update = async (userId, id, data) => {
  if (data.course) await assertCourseOwnership(userId, data.course);
  return base.update(userId, id, data);
};

export default { ...base, create, update };
