import { CheckSquare, ClipboardList, BookMarked } from "lucide-react";
import StatCard from "../common/StatCard.jsx";
import RingProgress from "../common/RingProgress.jsx";
import { formatMinutes } from "../../utils/studyHelpers.js";

/** Answers "what have I finished today, and how am I doing?" */
const TodayProgressCard = ({ progress }) => (
  <div>
    <h2 className="mb-2 text-sm font-semibold text-gray-700">Today's progress</h2>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <StatCard icon={CheckSquare} label="Tasks done" value={progress.tasksCompleted} />
      <StatCard icon={ClipboardList} label="Assignments done" value={progress.assignmentsCompleted} />
      <StatCard icon={BookMarked} label="Study time" value={formatMinutes(progress.studyMinutes)} />
      {progress.scheduleCompletion.total > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <RingProgress
            value={progress.scheduleCompletion.completed}
            max={progress.scheduleCompletion.total}
            size={56}
            strokeWidth={6}
            label={`${progress.scheduleCompletion.completed}/${progress.scheduleCompletion.total}`}
          />
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Schedule
            <br />
            complete
          </span>
        </div>
      )}
    </div>
  </div>
);

export default TodayProgressCard;
