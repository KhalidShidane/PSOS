import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Pencil, Trash2 } from "lucide-react";
import Badge from "../common/Badge.jsx";

const STATUS_VARIANT = {
  active: "success",
  completed: "neutral",
  dropped: "danger",
};

const CourseCard = ({ course, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-28 bg-emerald-50">
        {course.photo ? (
          <img src={course.photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-emerald-300">
            <BookOpen className="h-10 w-10" strokeWidth={1.5} />
          </div>
        )}

        {course.code && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm">
            {course.code}
          </span>
        )}

        <div className="absolute right-2 top-2 flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(course)}
            aria-label="Edit course"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:bg-white hover:text-emerald-600"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(course)}
            aria-label="Delete course"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:bg-white hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-800">{course.name}</h3>
          <Badge variant={STATUS_VARIANT[course.status] || "neutral"}>{course.status}</Badge>
        </div>
        {course.lecturer && <p className="truncate text-sm text-gray-500">{course.lecturer}</p>}

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-400">
            {course.creditHours != null ? `${course.creditHours} credit hours` : course.location || ""}
          </span>
          <Link
            to={`/courses/${course._id}`}
            className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            View course
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
