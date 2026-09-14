import { sortSessionsRecent, formatMinutes } from "../../utils/studyHelpers.js";

const STATUS_STYLES = {
  Planned: "bg-gray-100 text-gray-600",
  "In Progress": "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

/** Reusable session list - pass `limit` for a "recent sessions" preview. */
const StudySessionList = ({ sessions, courses, onEdit, onDelete, limit }) => {
  const sorted = sortSessionsRecent(sessions);
  const items = limit ? sorted.slice(0, limit) : sorted;

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No study sessions yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((s) => {
        const courseName = courses.find((c) => c._id === (s.course?._id || s.course))?.name;
        return (
          <li
            key={s._id}
            className="flex items-center justify-between gap-3 rounded-md border border-gray-100 px-3 py-2 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-800">{s.topic}</p>
              <p className="truncate text-xs text-gray-500">
                {new Date(s.startTime).toLocaleDateString()} · {formatMinutes(s.duration)}
                {courseName ? ` · ${courseName}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[s.status]}`}>
                {s.status}
              </span>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(s)}
                  className="text-xs font-medium text-emerald-600 hover:underline"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(s)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default StudySessionList;
