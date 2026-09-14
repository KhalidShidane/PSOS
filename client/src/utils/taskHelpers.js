export const PRIORITY_STYLES = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-gray-100 text-gray-600",
};

const PRIORITY_WEIGHT = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isTaskOverdue = (task, now = new Date()) =>
  task.status !== "Completed" && Boolean(task.dueDate) && new Date(task.dueDate) < now;

export const isTaskDueToday = (task, now = new Date()) =>
  task.status !== "Completed" && Boolean(task.dueDate) && isSameDay(new Date(task.dueDate), now);

export const sortTasks = (tasks) =>
  [...tasks].sort((a, b) => {
    const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    if (aTime !== bTime) return aTime - bTime;
    return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
  });

/** Formats a Date/ISO string for a <input type="date"> value, using local
 * date parts (avoids the off-by-one-day shift toISOString() can cause). */
export const toDateInputValue = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Buckets tasks the way the Tasks page displays them: Today (including
 * overdue), Upcoming, Completed. */
export const groupTasks = (tasks, now = new Date()) => {
  const sorted = sortTasks(tasks);
  return {
    today: sorted.filter(
      (t) => t.status !== "Completed" && (isTaskDueToday(t, now) || isTaskOverdue(t, now))
    ),
    upcoming: sorted.filter(
      (t) => t.status !== "Completed" && !isTaskDueToday(t, now) && !isTaskOverdue(t, now)
    ),
    completed: sorted.filter((t) => t.status === "Completed"),
  };
};
