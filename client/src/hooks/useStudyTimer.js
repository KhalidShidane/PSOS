import { useEffect, useState } from "react";

const STORAGE_KEY = "psos_study_timer";

const loadPersisted = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persist = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable - timer still works, just won't survive a refresh.
  }
};

const clearPersisted = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

/**
 * Entirely local (nothing is written to the backend) until complete() is
 * called by the caller - Start/Pause/Resume/Stop only ever touch local
 * state, so a re-render never resets progress. Everything (elapsed time
 * AND topic/course/notes) is mirrored to localStorage so a page refresh
 * mid-session doesn't lose it either.
 *
 * status: 'idle' | 'running' | 'paused' | 'stopped'
 * 'stopped' freezes the elapsed time for review (edit notes) before the
 * caller actually persists the session to the backend.
 */
export const useStudyTimer = () => {
  const [status, setStatus] = useState(() => loadPersisted()?.status || "idle");
  const [accumulatedMs, setAccumulatedMs] = useState(() => loadPersisted()?.accumulatedMs || 0);
  const [runStartedAt, setRunStartedAt] = useState(() => loadPersisted()?.runStartedAt || null);
  const [topic, setTopic] = useState(() => loadPersisted()?.topic || "");
  const [courseId, setCourseId] = useState(() => loadPersisted()?.courseId || "");
  const [notes, setNotes] = useState(() => loadPersisted()?.notes || "");

  // Date.now() is impure, so it must not be called directly in the render
  // body - it's read once here (a lazy initializer, evaluated only on
  // mount) and refreshed once a second by the interval's own callback
  // (also fine - only the render phase itself must stay pure), never
  // inline in the elapsedMs calculation below.
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (status !== "running") return undefined;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    persist({ status, accumulatedMs, runStartedAt, topic, courseId, notes });
  }, [status, accumulatedMs, runStartedAt, topic, courseId, notes]);

  const elapsedMs = accumulatedMs + (status === "running" && runStartedAt ? nowMs - runStartedAt : 0);

  const start = () => {
    setAccumulatedMs(0);
    setRunStartedAt(Date.now());
    setStatus("running");
  };

  const pause = () => {
    setAccumulatedMs((prev) => prev + (runStartedAt ? Date.now() - runStartedAt : 0));
    setRunStartedAt(null);
    setStatus("paused");
  };

  const resume = () => {
    setRunStartedAt(Date.now());
    setStatus("running");
  };

  const stop = () => {
    setAccumulatedMs((prev) => prev + (runStartedAt ? Date.now() - runStartedAt : 0));
    setRunStartedAt(null);
    setStatus("stopped");
  };

  const reset = () => {
    setStatus("idle");
    setAccumulatedMs(0);
    setRunStartedAt(null);
    setTopic("");
    setCourseId("");
    setNotes("");
    clearPersisted();
  };

  /** Reconstructs { startTime, endTime } from the accumulated active time,
   * so paused gaps never count toward the saved session's duration. */
  const getTimeRange = () => {
    const now = new Date();
    return { startTime: new Date(now.getTime() - elapsedMs), endTime: now };
  };

  return {
    status,
    elapsedMs,
    topic,
    setTopic,
    courseId,
    setCourseId,
    notes,
    setNotes,
    start,
    pause,
    resume,
    stop,
    reset,
    getTimeRange,
  };
};

export default useStudyTimer;
