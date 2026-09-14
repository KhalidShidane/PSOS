/**
 * Date-range helpers shared by the analytics service. The academic week
 * here runs Saturday -> Friday, matching the university week established
 * in the timetable feature (Schedule model / frontend WEEK_ORDER), so
 * "this week" means the same thing everywhere in the app.
 */

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/** Saturday 00:00:00 of the week containing `date`. */
export const startOfAcademicWeek = (date = new Date()) => {
  const d = startOfDay(date);
  const day = d.getDay(); // 0=Sun..6=Sat
  const diffToSaturday = (day + 1) % 7; // days since the most recent Saturday
  d.setDate(d.getDate() - diffToSaturday);
  return d;
};

export const endOfAcademicWeek = (date = new Date()) => {
  const start = startOfAcademicWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return endOfDay(end);
};

export const startOfMonth = (date = new Date()) => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfDay(d);
};

export const endOfMonth = (date = new Date()) => {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return endOfDay(d);
};

/** Resolves a { start, end } Date range for period = 'daily' | 'weekly' | 'monthly'. */
export const resolvePeriodRange = (period = "weekly", now = new Date()) => {
  switch (period) {
    case "daily":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "monthly":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "weekly":
    default:
      return { start: startOfAcademicWeek(now), end: endOfAcademicWeek(now) };
  }
};

/** Rolling last-7-days range, used for the study trend chart regardless
 * of the selected period (keeps the chart meaningful and simple). */
export const last7DaysRange = (now = new Date()) => {
  const end = endOfDay(now);
  const start = startOfDay(now);
  start.setDate(start.getDate() - 6);
  return { start, end };
};

export { startOfDay, endOfDay };
