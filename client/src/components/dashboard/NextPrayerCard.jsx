import { Moon } from "lucide-react";
import { PRAYER_LABELS, formatPrayerTime, formatMinutesRemaining } from "../../utils/prayerHelpers.js";

/** Answers "when's the next prayer?" - kept minimal per the prayer UI spec. */
const NextPrayerCard = ({ nextPrayer }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
      <Moon className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
      Next prayer
    </p>
    {nextPrayer ? (
      <div className="mt-2">
        <p className="text-lg font-semibold text-gray-800">{PRAYER_LABELS[nextPrayer.name]}</p>
        <p className="mt-1 text-sm text-gray-500">
          {formatPrayerTime(nextPrayer.time)} · in {formatMinutesRemaining(nextPrayer.minutesRemaining)}
        </p>
      </div>
    ) : (
      <p className="mt-2 text-sm text-gray-500">Set up your prayer times to see this here.</p>
    )}
  </div>
);

export default NextPrayerCard;
