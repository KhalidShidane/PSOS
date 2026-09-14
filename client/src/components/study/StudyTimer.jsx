import { useState } from "react";
import { useStudyTimer } from "../../hooks/useStudyTimer.js";
import { formatElapsed } from "../../utils/studyHelpers.js";
import { inputClasses, labelClasses } from "../../utils/formStyles.js";

/**
 * Start/Pause/Resume/Stop/Complete study timer. Nothing is written to the
 * backend until "Save session" is pressed - see useStudyTimer for the
 * persistence details.
 */
const StudyTimer = ({ courses, onComplete }) => {
  const timer = useStudyTimer();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!timer.topic.trim()) {
      setError("Enter a topic before starting.");
      return;
    }
    setError("");
    timer.start();
  };

  const handleComplete = async () => {
    setIsSaving(true);
    setError("");
    try {
      const { startTime, endTime } = timer.getTimeRange();
      await onComplete({
        topic: timer.topic,
        course: timer.courseId || undefined,
        notes: timer.notes,
        startTime,
        endTime,
        status: "Completed",
      });
      timer.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save session.");
    } finally {
      setIsSaving(false);
    }
  };

  const activeCourseName = courses.find((c) => c._id === timer.courseId)?.name;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">Study Timer</h2>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="mb-4 text-center">
        <span className="font-mono text-4xl font-semibold tabular-nums text-gray-800">
          {formatElapsed(timer.elapsedMs)}
        </span>
      </div>

      {timer.status === "idle" && (
        <div className="space-y-3">
          <div>
            <label className={labelClasses}>Topic</label>
            <input
              className={inputClasses}
              value={timer.topic}
              onChange={(e) => timer.setTopic(e.target.value)}
              placeholder="What are you studying?"
            />
          </div>
          <div>
            <label className={labelClasses}>Course (optional)</label>
            <select
              className={inputClasses}
              value={timer.courseId}
              onChange={(e) => timer.setCourseId(e.target.value)}
            >
              <option value="">None</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Start
          </button>
        </div>
      )}

      {(timer.status === "running" || timer.status === "paused") && (
        <div className="space-y-3">
          <p className="truncate text-center text-sm text-gray-500">
            {timer.topic}
            {activeCourseName ? ` · ${activeCourseName}` : ""}
          </p>
          <div className="flex gap-2">
            {timer.status === "running" ? (
              <button
                type="button"
                onClick={timer.pause}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Pause
              </button>
            ) : (
              <button
                type="button"
                onClick={timer.resume}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Resume
              </button>
            )}
            <button
              type="button"
              onClick={timer.stop}
              className="flex-1 rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {timer.status === "stopped" && (
        <div className="space-y-3">
          <p className="truncate text-center text-sm font-medium text-gray-700">{timer.topic}</p>
          <div>
            <label className={labelClasses}>Notes (optional)</label>
            <textarea
              rows={2}
              className={inputClasses}
              value={timer.notes}
              onChange={(e) => timer.setNotes(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={timer.reset}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleComplete}
              disabled={isSaving}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save session"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;
