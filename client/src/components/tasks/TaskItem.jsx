import { PRIORITY_STYLES, isTaskOverdue } from "../../utils/taskHelpers.js";

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const overdue = isTaskOverdue(task);
  const isCompleted = task.status === "Completed";

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex min-w-0 items-start gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggleComplete(task)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300"
          aria-label="Mark completed"
        />
        <div className="min-w-0">
          <p className={`truncate font-medium ${isCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}>
            {task.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {task.category}
            {task.dueDate && (
              <>
                {" · "}
                {new Date(task.dueDate).toLocaleDateString()}
                {overdue && <span className="ml-1 font-medium text-red-600">· Overdue</span>}
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex gap-2 text-xs">
          <button type="button" onClick={() => onEdit(task)} className="font-medium text-emerald-600 hover:underline">
            Edit
          </button>
          <button type="button" onClick={() => onDelete(task)} className="font-medium text-red-600 hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
