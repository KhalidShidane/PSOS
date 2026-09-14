import AssignmentCard from "./AssignmentCard.jsx";

const AssignmentSection = ({ title, assignments, courses, onToggleComplete, onEdit, onDelete }) => {
  if (assignments.length === 0) return null;

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-gray-700">
        {title} <span className="font-normal text-gray-400">({assignments.length})</span>
      </h2>
      <div className="space-y-2">
        {assignments.map((a) => (
          <AssignmentCard
            key={a._id}
            assignment={a}
            courseName={courses.find((c) => c._id === (a.course?._id || a.course))?.name}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AssignmentSection;
