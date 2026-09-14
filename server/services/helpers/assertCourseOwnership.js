import Course from "../../models/Course.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * Guards cross-model references: Schedule/StudySession/Assignment can
 * optionally point at a Course, but that course must belong to the same
 * user - otherwise one user could read/imply data about another user's
 * course by id-guessing.
 */
export const assertCourseOwnership = async (userId, courseId) => {
  if (!courseId) return;

  const course = await Course.findOne({ _id: courseId, user: userId });
  if (!course) {
    throw new ApiError(400, "course must reference an existing course you own");
  }
};

export default assertCourseOwnership;
