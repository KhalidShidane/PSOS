import { getTodaysSchedules } from "../../utils/scheduleHelpers.js";

const STATUS_STYLES = {
  current: "border-emerald-400 bg-emerald-50",
  upcoming: "border-gray-200 bg-white",
  completed: "border-gray-200 bg-gray-50 opacity-60",
};

const STATUS_LABEL = {
  current: "Now",
  upcoming: "Upcoming",
  completed: "Done",
};

/**
 * Shows today's activities sorted by start time, with current/upcoming/
 * completed status. Built resource-agnostic (takes the full schedule list
 * and computes "today" itself) so it can be dropped onto the Dashboard
 * later without changes.
 */
const TodaySchedule = ({ schedules, now }) => {
  const todays = getTodaysSchedules(schedules, now);

  if (todays.length === 0) {
    return <p className="text-sm text-gray-500">No activities scheduled for today.</p>;
  }

  return (
    <ul className="space-y-2">
      {todays.map((item) => (
        <li
          key={item._id}
          className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm ${STATUS_STYLES[item.status]}`}
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-800">{item.title}</p>
            <p className="truncate text-xs text-gray-500">
              {item.startTime} - {item.endTime}
              {item.location ? ` · ${item.location}` : ""}
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium text-gray-500">
            {STATUS_LABEL[item.status]}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default TodaySchedule;
