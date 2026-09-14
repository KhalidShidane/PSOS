import { CirclePlay } from "lucide-react";
import Badge from "../common/Badge.jsx";

/** Answers "What am I doing now?" */
const CurrentActivityCard = ({ activity }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
      <CirclePlay className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
      Current activity
    </p>
    {activity ? (
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-gray-800">{activity.title}</p>
          <Badge variant="brand">{activity.type}</Badge>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {activity.startTime} - {activity.endTime}
          {activity.location ? ` · ${activity.location}` : ""}
        </p>
      </div>
    ) : (
      <p className="mt-2 text-sm text-gray-500">Nothing scheduled right now - free time.</p>
    )}
  </div>
);

export default CurrentActivityCard;
