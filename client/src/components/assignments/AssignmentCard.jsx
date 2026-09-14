import { PRIORITY_STYLES, isOverdue } from "../../utils/assignmentHelpers.js";

const AssignmentCard = ({ assignment, courseName, onToggleComplete, onEdit, onDelete }) => {
  const overdue = isOverdue(assignment);
  const isCompleted = assignment.status === "Completed";

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-lg border bg-white p-4 shadow-sm ${
        assignment.priority === "Urgent" && !isCompleted
          ? "border-red-200 border-l-4 border-l-red-500"
          : "border-gray-200"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggleComplete(assignment)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300"
          aria-label="Mark completed"
        />
        <div className="min-w-0">
          <p className={`truncate font-medium ${isCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}>
            {assignment.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {courseName ? `${courseName} · ` : ""}
            Due {new Date(assignment.deadline).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
            {overdue && <span className="ml-1 font-medium text-red-600">· Overdue</span>}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[assignment.priority]}`}>
          {assignment.priority}
        </span>
        <div className="flex gap-2 text-xs">
          <button type="button" onClick={() => onEdit(assignment)} className="font-medium text-emerald-600 hover:underline">
            Edit
          </button>
          <button type="button" onClick={() => onDelete(assignment)} className="font-medium text-red-600 hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
