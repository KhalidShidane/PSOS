import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { useCourses } from "../hooks/useCourses.js";
import Modal from "../components/common/Modal.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import SkeletonCard from "../components/common/SkeletonCard.jsx";
import CourseForm from "../components/courses/CourseForm.jsx";
import CourseCard from "../components/courses/CourseCard.jsx";

const buildDefaultValues = (course) =>
  course
    ? {
        name: course.name,
        code: course.code || "",
        lecturer: course.lecturer || "",
        creditHours: course.creditHours,
        location: course.location || "",
        description: course.description || "",
        photo: course.photo || "",
        status: course.status,
      }
    : { status: "active" };

const Courses = () => {
  const { courses, isLoading, error, addCourse, editCourse, removeCourse } = useCourses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setFormError("");
    try {
      if (editingCourse) {
        await editCourse(editingCourse._id, data);
      } else {
        await addCourse(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to save. Please check the details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.name}"? This cannot be undone.`)) return;
    await removeCourse(course._id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500">Manage the courses you're taking this term.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add course
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          message="No courses yet. Add your first course to start tracking classes, assignments, and study time against it."
          actionLabel="Add course"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? "Edit course" : "Add course"}
      >
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <CourseForm
          defaultValues={buildDefaultValues(editingCourse)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={editingCourse ? "Save changes" : "Add course"}
        />
      </Modal>
    </div>
  );
};

export default Courses;
