import { getMinutesByCourse, formatMinutes } from "../../utils/studyHelpers.js";

const StudyByCourse = ({ sessions, courses }) => {
  const breakdown = getMinutesByCourse(sessions, courses);

  if (breakdown.length === 0) {
    return <p className="text-sm text-gray-500">No study time recorded yet.</p>;
  }

  const max = Math.max(...breakdown.map((b) => b.minutes));

  return (
    <ul className="space-y-2">
      {breakdown.map((b) => (
        <li key={b.courseId} className="text-sm">
          <div className="mb-1 flex items-center justify-between">
            <span className="truncate font-medium text-gray-700">{b.courseName}</span>
            <span className="shrink-0 text-gray-500">{formatMinutes(b.minutes)}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full bg-emerald-500"
              style={{ width: `${Math.max(4, (b.minutes / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default StudyByCourse;
