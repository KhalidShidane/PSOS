import { useState } from "react";
import { Plus, CheckSquare } from "lucide-react";
import { useTasks } from "../hooks/useTasks.js";
import { groupTasks, isTaskOverdue, toDateInputValue } from "../utils/taskHelpers.js";
import Modal from "../components/common/Modal.jsx";
import StatusBar from "../components/common/StatusBar.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import SkeletonRow from "../components/common/SkeletonRow.jsx";
import TaskForm from "../components/tasks/TaskForm.jsx";
import TaskItem from "../components/tasks/TaskItem.jsx";

const buildDefaultValues = (task) =>
  task
    ? {
        title: task.title,
        description: task.description || "",
        category: task.category || "",
        priority: task.priority,
        dueDate: task.dueDate ? toDateInputValue(task.dueDate) : "",
        status: task.status,
      }
    : { category: "General", priority: "Medium", status: "Pending" };

const TaskGroup = ({ title, tasks, onToggleComplete, onEdit, onDelete }) => {
  if (tasks.length === 0) return null;
  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-gray-700">
        {title} <span className="font-normal text-gray-400">({tasks.length})</span>
      </h2>
      <div className="space-y-2">
        {tasks.map((t) => (
          <TaskItem
            key={t._id}
            task={t}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

const Tasks = () => {
  const { tasks, isLoading, error, addTask, editTask, removeTask } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openAddModal = () => {
    setEditingTask(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setFormError("");
    try {
      if (editingTask) {
        await editTask(editingTask._id, data);
      } else {
        await addTask(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (task) => {
    await editTask(task._id, { status: task.status === "Completed" ? "Pending" : "Completed" });
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    await removeTask(task._id);
  };

  const groups = groupTasks(tasks);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500">Personal to-dos, outside of coursework.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add task
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && tasks.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <StatusBar
            segments={[
              { key: "good", label: "Completed", value: groups.completed.length },
              {
                key: "warning",
                label: "Pending",
                value: tasks.length - groups.completed.length - tasks.filter((t) => isTaskOverdue(t)).length,
              },
              { key: "critical", label: "Overdue", value: tasks.filter((t) => isTaskOverdue(t)).length },
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
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          message="No tasks yet. Add a personal to-do to keep it visible alongside your coursework."
          actionLabel="Add task"
          onAction={openAddModal}
        />
      ) : (
        <div className="space-y-6">
          <TaskGroup
            title="Today"
            tasks={groups.today}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
          <TaskGroup
            title="Upcoming"
            tasks={groups.upcoming}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
          <TaskGroup
            title="Completed"
            tasks={groups.completed}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? "Edit task" : "Add task"}
      >
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <TaskForm
          defaultValues={buildDefaultValues(editingTask)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={editingTask ? "Save changes" : "Add task"}
        />
      </Modal>
    </div>
  );
};

export default Tasks;
