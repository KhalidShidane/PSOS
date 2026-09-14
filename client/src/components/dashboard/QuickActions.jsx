import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, ClipboardList, CalendarPlus, BookOpen, Timer, ArrowRight } from "lucide-react";
import { useCourses } from "../../hooks/useCourses.js";
import { createTask } from "../../services/taskService.js";
import { createAssignment } from "../../services/assignmentService.js";
import { createSchedule } from "../../services/scheduleService.js";
import { createCourse } from "../../services/courseService.js";
import { dayNameOf } from "../../utils/scheduleHelpers.js";
import { toLocalInputValue } from "../../utils/studyHelpers.js";
import { ROUTES } from "../../utils/routes.js";
import Modal from "../common/Modal.jsx";
import TaskForm from "../tasks/TaskForm.jsx";
import AssignmentForm from "../assignments/AssignmentForm.jsx";
import ScheduleForm from "../timetable/ScheduleForm.jsx";
import CourseForm from "../courses/CourseForm.jsx";

const ACTIONS = [
  { key: "task", label: "Add task", icon: CheckSquare },
  { key: "assignment", label: "Add assignment", icon: ClipboardList },
  { key: "schedule", label: "Add class", icon: CalendarPlus },
  { key: "course", label: "Add course", icon: BookOpen },
  { key: "study", label: "Start study session", icon: Timer },
];

/**
 * One-click creation for the resources students add most often, reusing
 * the same form components each resource's own page uses - so "quick" add
 * here and the full page's "add" flow never drift apart.
 */
const QuickActions = ({ onCreated }) => {
  const { courses } = useCourses();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null); // 'task' | 'assignment' | 'schedule' | 'course' | null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setOpen(null);
    setError("");
  };

  const handle = async (createFn, data) => {
    setIsSubmitting(true);
    setError("");
    try {
      await createFn(data);
      close();
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActionClick = (key) => {
    if (key === "study") {
      navigate(ROUTES.STUDY);
      return;
    }
    setOpen(key);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
      <h2 className="px-3 pb-1 pt-2 text-sm font-semibold text-gray-700">Quick actions</h2>
      <div>
        {ACTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleActionClick(key)}
            className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              {label}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
          </button>
        ))}
      </div>

      <Modal isOpen={open === "task"} onClose={close} title="Add task">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <TaskForm
          defaultValues={{ category: "General", priority: "Medium", status: "Pending" }}
          onSubmit={(data) => handle(createTask, data)}
          isSubmitting={isSubmitting}
          submitLabel="Add task"
        />
      </Modal>

      <Modal isOpen={open === "assignment"} onClose={close} title="Add assignment">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <AssignmentForm
          defaultValues={{ priority: "Medium", status: "Pending", deadline: toLocalInputValue(new Date()) }}
          courses={courses}
          onSubmit={(data) => handle(createAssignment, data)}
          isSubmitting={isSubmitting}
          submitLabel="Add assignment"
        />
      </Modal>

      <Modal isOpen={open === "schedule"} onClose={close} title="Add class">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <ScheduleForm
          defaultValues={{ type: "University", dayOfWeek: dayNameOf(), startTime: "09:00", endTime: "10:00", isRecurring: true }}
          courses={courses}
          onSubmit={(data) => handle(createSchedule, data)}
          isSubmitting={isSubmitting}
          submitLabel="Add"
        />
      </Modal>

      <Modal isOpen={open === "course"} onClose={close} title="Add course">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <CourseForm
          defaultValues={{ status: "active" }}
          onSubmit={(data) => handle(createCourse, data)}
          isSubmitting={isSubmitting}
          submitLabel="Add course"
        />
      </Modal>
    </div>
  );
};

export default QuickActions;
