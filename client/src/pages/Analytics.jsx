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

      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-800">Study</h2>
        <StudyAnalyticsSection data={study.data} isLoading={study.isLoading} />
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-800">Tasks</h2>
        <CompletionStatsGrid data={tasks.data} isLoading={tasks.isLoading} />
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-800">Assignments</h2>
        <CompletionStatsGrid data={assignments.data} isLoading={assignments.isLoading} />
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-800">Course progress</h2>
        <CourseProgressTable courses={courses.courses} isLoading={courses.isLoading} />
      </section>

      <section>
        <CodingAnalyticsSection data={coding.data} isLoading={coding.isLoading} />
      </section>
    </div>
  );
};

export default Analytics;
