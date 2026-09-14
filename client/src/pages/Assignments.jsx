import { useState } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { useAssignments } from "../hooks/useAssignments.js";
import { useCourses } from "../hooks/useCourses.js";
import { groupAssignments } from "../utils/assignmentHelpers.js";
import { toLocalInputValue } from "../utils/studyHelpers.js";
import Modal from "../components/common/Modal.jsx";
import StatusBar from "../components/common/StatusBar.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import SkeletonRow from "../components/common/SkeletonRow.jsx";
import AssignmentForm from "../components/assignments/AssignmentForm.jsx";
import AssignmentSection from "../components/assignments/AssignmentSection.jsx";

const buildDefaultValues = (assignment) =>
  assignment
    ? {
        title: assignment.title,
        course: assignment.course?._id || assignment.course || "",
        description: assignment.description || "",
        deadline: toLocalInputValue(assignment.deadline),
        priority: assignment.priority,
        status: assignment.status,
        attachment: assignment.attachment || "",
      }
    : { priority: "Medium", status: "Pending", deadline: toLocalInputValue(new Date()) };

const Assignments = () => {
  const { assignments, isLoading, error, addAssignment, editAssignment, removeAssignment } =
    useAssignments();
  const { courses } = useCourses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openAddModal = () => {
    setEditingAssignment(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setFormError("");
    try {
      if (editingAssignment) {
        await editAssignment(editingAssignment._id, data);
      } else {
        await addAssignment(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (assignment) => {
    await editAssignment(assignment._id, {
      status: assignment.status === "Completed" ? "Pending" : "Completed",
    });
  };

  const handleDelete = async (assignment) => {
    if (!window.confirm(`Delete "${assignment.title}"?`)) return;
    await removeAssignment(assignment._id);
  };

  const groups = groupAssignments(assignments);
  const hasAny = assignments.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Assignments</h1>
          <p className="text-sm text-gray-500">Keep track of deadlines across your courses.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add assignment
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && hasAny && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <StatusBar
            segments={[
              { key: "good", label: "Completed", value: groups.completed.length },
              {
                key: "warning",
                label: "Pending",
                value: groups.dueToday.length + groups.upcoming.length,
              },
              { key: "critical", label: "Overdue", value: groups.overdue.length },
            ]}
          />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : !hasAny ? (
        <EmptyState
          icon={ClipboardList}
          message="No assignments yet. Add one to track its deadline and priority alongside your courses."
          actionLabel="Add assignment"
          onAction={openAddModal}
        />
      ) : (
        <div className="space-y-6">
          <AssignmentSection
            title="Overdue"
            assignments={groups.overdue}
            courses={courses}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
          <AssignmentSection
            title="Due today"
            assignments={groups.dueToday}
            courses={courses}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
          <AssignmentSection
            title="Upcoming"
            assignments={groups.upcoming}
            courses={courses}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
          <AssignmentSection
            title="Completed"
            assignments={groups.completed}
            courses={courses}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? "Edit assignment" : "Add assignment"}
      >
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <AssignmentForm
          defaultValues={buildDefaultValues(editingAssignment)}
          courses={courses}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={editingAssignment ? "Save changes" : "Add assignment"}
        />
      </Modal>
    </div>
  );
};

export default Assignments;
