// Pure helpers for study session displays - formatting, aggregation, and
// sorting live here so the timer widget, history stats, and per-course
// breakdown all agree on the same math.

export const formatElapsed = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

export const formatMinutes = (mins) => {
  if (!mins || mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const startOfWeek = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
};

export const getTodayMinutes = (sessions, now = new Date()) =>
  sessions
    .filter((s) => s.duration && isSameDay(new Date(s.startTime), now))
    .reduce((sum, s) => sum + s.duration, 0);

export const getWeekMinutes = (sessions, now = new Date()) => {
  const start = startOfWeek(now);
  return sessions
    .filter((s) => s.duration && new Date(s.startTime) >= start)
    .reduce((sum, s) => sum + s.duration, 0);
};

export const getMinutesByCourse = (sessions, courses) => {
  const totals = new Map();
  sessions.forEach((s) => {
    if (!s.duration) return;
    const key = s.course?._id || s.course || "none";
    totals.set(key, (totals.get(key) || 0) + s.duration);
  });
  return Array.from(totals.entries())
    .map(([courseId, minutes]) => ({
      courseId,
      minutes,
      courseName: courses.find((c) => c._id === courseId)?.name || "No course",
    }))
    .sort((a, b) => b.minutes - a.minutes);
};

export const sortSessionsRecent = (sessions) =>
  [...sessions].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

/** Formats a Date/ISO string for a <input type="datetime-local"> value. */
export const toLocalInputValue = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
};
