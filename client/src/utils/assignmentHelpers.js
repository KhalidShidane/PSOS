export const PRIORITY_STYLES = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-gray-100 text-gray-600",
};

const PRIORITY_WEIGHT = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

export const isOverdue = (assignment, now = new Date()) =>
  assignment.status !== "Completed" && new Date(assignment.deadline) < now;

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isDueToday = (assignment, now = new Date()) =>
  assignment.status !== "Completed" &&
  !isOverdue(assignment, now) &&
  isSameDay(new Date(assignment.deadline), now);

export const sortAssignments = (assignments) =>
  [...assignments].sort((a, b) => {
    const dateDiff = new Date(a.deadline) - new Date(b.deadline);
    if (dateDiff !== 0) return dateDiff;
    return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
  });

/** Buckets assignments the way the Assignments page displays them. */
export const groupAssignments = (assignments, now = new Date()) => {
  const sorted = sortAssignments(assignments);
  return {
    overdue: sorted.filter((a) => isOverdue(a, now)),
    dueToday: sorted.filter((a) => isDueToday(a, now)),
    upcoming: sorted.filter(
      (a) => a.status !== "Completed" && !isOverdue(a, now) && !isDueToday(a, now)
    ),
    completed: sorted.filter((a) => a.status === "Completed"),
  };
};
