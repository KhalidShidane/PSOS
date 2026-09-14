import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import * as courseApi from "../services/courseService.js";
import { useSchedules } from "../hooks/useSchedules.js";
import { sortByStartTime } from "../utils/scheduleHelpers.js";
import { ROUTES } from "../utils/routes.js";
import Modal from "../components/common/Modal.jsx";
import Badge from "../components/common/Badge.jsx";
import Skeleton from "../components/common/Skeleton.jsx";
import CourseForm from "../components/courses/CourseForm.jsx";

const STATUS_VARIANT = {
  active: "success",
  completed: "neutral",
  dropped: "danger",
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { schedules } = useSchedules();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Not calling setIsLoading(true)/setError("") synchronously here - doing
  // so directly inside an effect body is unsafe. isLoading already starts
  // true on mount; a stale error from a previous id is cleared on success.
  useEffect(() => {
    let cancelled = false;
    courseApi
      .fetchCourse(id)
      .then((data) => {
        if (!cancelled) {
          setCourse(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Course not found.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setFormError("");
    try {
      const updated = await courseApi.updateCourse(id, data);
      setCourse(updated);
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${course.name}"? This cannot be undone.`)) return;
    await courseApi.deleteCourse(id);
    navigate(ROUTES.COURSES, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-28" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">{error || "Course not found."}</p>
        <Link to={ROUTES.COURSES} className="text-sm text-emerald-600 hover:underline">
          Back to courses
        </Link>
      </div>
    );
  }

  const courseClasses = sortByStartTime(
    schedules.filter((s) => (s.course?._id || s.course) === course._id)
  );

  return (
    <div className="space-y-6">
      <Link to={ROUTES.COURSES} className="text-sm text-emerald-600 hover:underline">
        ← Back to courses
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            {course.photo ? (
              <img src={course.photo} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BookOpen className="h-7 w-7" strokeWidth={1.75} />
              </span>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{course.name}</h1>
              {course.code && <p className="text-sm text-gray-500">{course.code}</p>}
            </div>
          </div>
          <Badge variant={STATUS_VARIANT[course.status] || "neutral"}>{course.status}</Badge>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          {course.lecturer && (
            <div>
              <dt className="font-medium text-gray-500">Lecturer</dt>
              <dd className="text-gray-800">{course.lecturer}</dd>
            </div>
          )}
          {course.location && (
            <div>
              <dt className="font-medium text-gray-500">Location</dt>
              <dd className="text-gray-800">{course.location}</dd>
            </div>
          )}
          {course.creditHours != null && (
            <div>
              <dt className="font-medium text-gray-500">Credit hours</dt>
              <dd className="text-gray-800">{course.creditHours}</dd>
            </div>
          )}
        </dl>

        {course.description && (
          <p className="mt-4 text-sm text-gray-600">{course.description}</p>
        )}

        <div className="mt-6 flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => {
              setFormError("");
              setIsModalOpen(true);
            }}
            className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Class sessions</h2>
        {courseClasses.length === 0 ? (
          <p className="text-sm text-gray-500">
            No timetable sessions linked to this course yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {courseClasses.map((s) => (
              <li
                key={s._id}
                className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 text-sm"
              >
                <span className="font-medium text-gray-800">{s.dayOfWeek}</span>
                <span className="text-gray-500">
                  {s.startTime} - {s.endTime}
                  {s.location ? ` · ${s.location}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          Assignments for this course will appear here in a future update.
        </div>
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          Study sessions for this course will appear here in a future update.
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit course">
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <CourseForm
          defaultValues={{
            name: course.name,
            code: course.code || "",
            lecturer: course.lecturer || "",
            creditHours: course.creditHours,
            location: course.location || "",
            description: course.description || "",
            photo: course.photo || "",
            status: course.status,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save changes"
        />
      </Modal>
    </div>
  );
};

export default CourseDetail;
