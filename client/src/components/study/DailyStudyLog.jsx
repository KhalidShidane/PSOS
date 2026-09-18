import { useState } from "react";
import { BookOpen, Check } from "lucide-react";
import { inputClasses, labelClasses } from "../../utils/formStyles.js";
import { toLocalInputValue } from "../../utils/studyHelpers.js";

const DailyStudyLog = ({ courses, onSave }) => {
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [time, setTime] = useState(toLocalInputValue(new Date()));
  const [minutes, setMinutes] = useState("60");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!topic.trim() || !time || Number(minutes) <= 0) {
      setError("Add the subject, time, and duration.");
      return;
    }
    setIsSaving(true); setError(""); setSaved(false);
    try {
      const startTime = new Date(time);
      const endTime = new Date(startTime.getTime() + Number(minutes) * 60000);
      await onSave({ topic: topic.trim(), course: course || undefined, startTime, endTime, status: "Completed" });
      setTopic(""); setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your study log.");
    } finally { setIsSaving(false); }
  };

  return <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm">
    <div className="mb-4 flex items-start gap-3"><span className="rounded-xl bg-indigo-100 p-2 text-indigo-600"><BookOpen className="h-4 w-4" /></span><div><h2 className="text-sm font-semibold text-slate-800">Daily study log</h2><p className="mt-0.5 text-xs text-slate-500">Save today&apos;s subject and study time.</p></div></div>
    {error && <p className="mb-3 text-xs text-red-600">{error}</p>}{saved && <p className="mb-3 flex items-center gap-1 text-xs font-medium text-emerald-700"><Check className="h-3.5 w-3.5" /> Added to your study history.</p>}
    <form onSubmit={submit} className="space-y-3">
      <div><label className={labelClasses}>Subject / topic</label><input className={inputClasses} value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. Mathematics — Algebra" /></div>
      <div><label className={labelClasses}>Course (optional)</label><select className={inputClasses} value={course} onChange={(event) => setCourse(event.target.value)}><option value="">Choose a course</option>{courses.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></div>
      <div className="grid grid-cols-2 gap-3"><div><label className={labelClasses}>Date & time</label><input type="datetime-local" className={inputClasses} value={time} onChange={(event) => setTime(event.target.value)} /></div><div><label className={labelClasses}>Minutes</label><input type="number" min="1" className={inputClasses} value={minutes} onChange={(event) => setMinutes(event.target.value)} /></div></div>
      <button type="submit" disabled={isSaving} className="w-full rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Saving..." : "Save daily log"}</button>
    </form>
  </div>;
};

export default DailyStudyLog;
