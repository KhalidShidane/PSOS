import { Link } from "react-router-dom";
import Badge from "../common/Badge.jsx";
import { groupTasks } from "../../utils/taskHelpers.js";
import { groupAssignments } from "../../utils/assignmentHelpers.js";
import { ROUTES } from "../../utils/routes.js";

/** Answers "What do I still need to complete?" - overdue/due-today tasks
 * and assignments combined into one short, actionable list. */
const NeedsAttentionCard = ({ tasks, assignments }) => {
  const taskGroups = groupTasks(tasks);
  const assignmentGroups = groupAssignments(assignments);

  const items = [
    ...taskGroups.today.map((t) => ({ id: t._id, title: t.title, date: t.dueDate, kind: "Task" })),
    ...assignmentGroups.overdue.concat(assignmentGroups.dueToday).map((a) => ({
      id: a._id,
      title: a.title,
      date: a.deadline,
      kind: "Assignment",
    })),
  ]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="mb-2 text-sm font-semibold text-gray-700">Needs attention</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing overdue or due today. Nice work.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              <Link
                to={item.kind === "Task" ? ROUTES.TASKS : ROUTES.ASSIGNMENTS}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-50"
              >
                <span className="truncate text-gray-800">{item.title}</span>
                <Badge variant={item.kind === "Task" ? "neutral" : "warning"}>{item.kind}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NeedsAttentionCard;
