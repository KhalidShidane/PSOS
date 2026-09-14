import { getTodayMinutes, getWeekMinutes, formatMinutes } from "../../utils/studyHelpers.js";

const StudyStats = ({ sessions }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Today</p>
      <p className="mt-1 text-2xl font-semibold text-gray-800">
        {formatMinutes(getTodayMinutes(sessions))}
      </p>
    </div>
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">This week</p>
      <p className="mt-1 text-2xl font-semibold text-gray-800">
        {formatMinutes(getWeekMinutes(sessions))}
      </p>
    </div>
  </div>
);

export default StudyStats;
