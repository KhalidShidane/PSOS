import { ArrowRight } from "lucide-react";
import Badge from "../common/Badge.jsx";
import { timeToMinutes } from "../../utils/scheduleHelpers.js";

/** Answers "What's next?" */
const NextActivityCard = ({ activity, now }) => {
  const minutesUntil = activity
    ? timeToMinutes(activity.startTime) - (now.getHours() * 60 + now.getMinutes())
    : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
        <ArrowRight className="h-3.5 w-3.5 text-gray-400" strokeWidth={2.5} />
        Next activity
      </p>
      {activity ? (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-800">{activity.title}</p>
            <Badge>{activity.type}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {activity.startTime}
            {activity.location ? ` · ${activity.location}` : ""}
            {minutesUntil != null && minutesUntil > 0 ? ` · in ${minutesUntil}m` : ""}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-500">Nothing else scheduled for today.</p>
      )}
    </div>
  );
};

export default NextActivityCard;
