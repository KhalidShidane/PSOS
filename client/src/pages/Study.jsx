import { useState } from "react";
import { Plus } from "lucide-react";
import { useStudySessions } from "../hooks/useStudySessions.js";
import { useCourses } from "../hooks/useCourses.js";
import { useStudyAnalytics } from "../hooks/useStudyAnalytics.js";
import { toLocalInputValue } from "../utils/studyHelpers.js";
import Modal from "../components/common/Modal.jsx";
import StudyTimer from "../components/study/StudyTimer.jsx";
import DailyStudyLog from "../components/study/DailyStudyLog.jsx";
import StudyStats from "../components/study/StudyStats.jsx";
import StudyByCourse from "../components/study/StudyByCourse.jsx";
import StudySessionList from "../components/study/StudySessionList.jsx";
import StudySessionForm from "../components/study/StudySessionForm.jsx";
import TrendChart from "../components/analytics/TrendChart.jsx";
import ChartCard from "../components/analytics/ChartCard.jsx";
import SkeletonRow from "../components/common/SkeletonRow.jsx";

const buildDefaultValues = (session) =>
  session
    ? {
        topic: session.topic,
        course: session.course?._id || session.course || "",
        startTime: toLocalInputValue(session.startTime),
        endTime: session.endTime ? toLocalInputValue(session.endTime) : "",
        status: session.status,
        notes: session.notes || "",
      }
    : {
        topic: "",
        startTime: toLocalInputValue(new Date()),
        status: "Completed",
      };

const Study = () => {
  const { sessions, isLoading, error, addSession, editSession, removeSession } =
    useStudySessions();
  const { courses } = useCourses();
  const { data: trendData } = useStudyAnalytics("weekly");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openAddModal = () => {
    setEditingSession(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setFormError("");
    try {
      if (editingSession) {
        await editSession(editingSession._id, data);
      } else {
        await addSession(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (session) => {
    if (!window.confirm(`Delete study session "${session.topic}"?`)) return;
    await removeSession(session._id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Study & Revision</h1>
          <p className="text-sm text-gray-500">Track your study sessions and progress.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add manually
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <StudyTimer courses={courses} onComplete={addSession} />
          <DailyStudyLog courses={courses} onSave={addSession} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <StudyStats sessions={sessions} />

          {trendData && (
            <ChartCard title="Study rhythm" subtitle="Focused minutes over the last 7 days"><TrendChart data={trendData.trend} color="blue" valueFormatter={(value) => `${value} min`} /></ChartCard>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">By course</h2>
            <StudyByCourse sessions={sessions} courses={courses} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">Recent sessions</h2>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : (
              <StudySessionList
                sessions={sessions}
                courses={courses}
                onEdit={openEditModal}
                onDelete={handleDelete}
                limit={5}
              />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">All study history</h2>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : (
          <StudySessionList
            sessions={sessions}
            courses={courses}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSession ? "Edit study session" : "Add study session"}
      >
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <StudySessionForm
          defaultValues={buildDefaultValues(editingSession)}
          courses={courses}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitLabel={editingSession ? "Save changes" : "Add session"}
        />
      </Modal>
    </div>
  );
};

export default Study;
