import { GraduationCap } from "lucide-react";
import ProgressBar from "../common/ProgressBar.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Skeleton from "../common/Skeleton.jsx";
import { formatMinutes } from "../../utils/studyHelpers.js";

/**
 * Genuinely tabular, comparative data, so a real <table> is used (wrapped
 * for horizontal scroll on narrow screens) rather than forcing it into
 * stacked cards. No grade is shown - there is no grade data to show.
 */
const CourseProgressTable = ({ courses, isLoading }) => {
  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;
  if (courses.length === 0) {
    return <EmptyState icon={GraduationCap} message="Add a course to see its progress here." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3 font-medium">Course</th>
            <th className="px-4 py-3 font-medium">Assignments</th>
            <th className="px-4 py-3 font-medium">Study time</th>
            <th className="px-4 py-3 font-medium">Classes/week</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr
              key={c.courseId}
              className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium text-gray-800">{c.courseName}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-14 shrink-0 tabular-nums text-gray-600">
                    {c.assignmentsCompleted}/{c.assignmentsTotal}
                  </span>
                  <div className="w-24">
                    <ProgressBar value={c.assignmentsCompleted} max={c.assignmentsTotal || 1} />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 tabular-nums text-gray-600">{formatMinutes(c.studyMinutes)}</td>
              <td className="px-4 py-3 tabular-nums text-gray-600">{c.weeklyClassCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseProgressTable;
