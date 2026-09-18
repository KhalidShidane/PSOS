import { useState } from "react";
import { useStudyAnalytics } from "../hooks/useStudyAnalytics.js";
import { useTaskAnalytics } from "../hooks/useTaskAnalytics.js";
import { useAssignmentAnalytics } from "../hooks/useAssignmentAnalytics.js";
import { useCodingAnalytics } from "../hooks/useCodingAnalytics.js";
import { useCourseAnalytics } from "../hooks/useCourseAnalytics.js";
import Tabs from "../components/common/Tabs.jsx";
import StudyAnalyticsSection from "../components/analytics/StudyAnalyticsSection.jsx";
import CompletionStatsGrid from "../components/analytics/CompletionStatsGrid.jsx";
import CodingAnalyticsSection from "../components/analytics/CodingAnalyticsSection.jsx";
import CourseProgressTable from "../components/analytics/CourseProgressTable.jsx";
import ChartCard from "../components/analytics/ChartCard.jsx";

const PERIOD_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const Analytics = () => {
  const [period, setPeriod] = useState("weekly");

  const study = useStudyAnalytics(period);
  const tasks = useTaskAnalytics(period);
  const assignments = useAssignmentAnalytics(period);
  const coding = useCodingAnalytics(period);
  const courses = useCourseAnalytics();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">How your time and progress break down.</p>
        </div>
        <Tabs options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
      </div>

      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-5">
        <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Focus report</p><h2 className="mt-1 text-lg font-semibold text-slate-800">Study</h2></div>
        <StudyAnalyticsSection data={study.data} isLoading={study.isLoading} />
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white p-5">
        <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Productivity report</p><h2 className="mt-1 text-lg font-semibold text-slate-800">Tasks</h2></div>
        <CompletionStatsGrid data={tasks.data} isLoading={tasks.isLoading} />
      </section>

      <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5">
        <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Deadline report</p><h2 className="mt-1 text-lg font-semibold text-slate-800">Assignments</h2></div>
        <CompletionStatsGrid data={assignments.data} isLoading={assignments.isLoading} />
      </section>

      <section>
        <ChartCard title="Course progress" subtitle="Assignment completion, study time, and weekly classes">
          <CourseProgressTable courses={courses.courses} isLoading={courses.isLoading} />
        </ChartCard>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-1">
        <CodingAnalyticsSection data={coding.data} isLoading={coding.isLoading} />
      </section>
    </div>
  );
};

export default Analytics;
