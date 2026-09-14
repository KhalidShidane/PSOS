export const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export const PRAYER_LABELS = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

// Suggested starting values for a *new* prayer schedule only - never used
// directly in the current/next-prayer calculation below. The user's real,
// saved times always come from the PrayerSchedule record.
export const DEFAULT_PRAYER_TIMES = {
  fajr: "05:00",
  dhuhr: "12:30",
  asr: "15:30",
  maghrib: "18:10",
  isha: "19:30",
};

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const formatPrayerTime = (time) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

/**
 * Determines the current and next prayer, plus minutes remaining until
 * the next one - correctly wrapping past midnight (e.g. at 11pm, current
 * is Isha and next is tomorrow's Fajr).
 */
export const getCurrentAndNextPrayer = (schedule, now = new Date()) => {
  if (!schedule) return { current: null, next: null, minutesRemaining: null };

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const prayers = PRAYER_ORDER.map((key) => ({ key, minutes: timeToMinutes(schedule[key]) })).sort(
    (a, b) => a.minutes - b.minutes
  );

  // Default: before the first prayer of the day - "current" is still
  // yesterday's last prayer (Isha), "next" is today's first (Fajr).
  let current = prayers[prayers.length - 1];
  let next = prayers[0];
  let minutesRemaining = 1440 - nowMinutes + next.minutes;

  for (let i = 0; i < prayers.length; i++) {
    if (nowMinutes < prayers[i].minutes) {
      next = prayers[i];
      current = i === 0 ? prayers[prayers.length - 1] : prayers[i - 1];
      minutesRemaining = next.minutes - nowMinutes;
      break;
    }
  }

  return { current: current.key, next: next.key, minutesRemaining };
};

export const formatMinutesRemaining = (minutes) => {
  if (minutes == null) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
