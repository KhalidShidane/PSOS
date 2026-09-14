import { useForm } from "react-hook-form";
import { inputClasses, labelClasses, errorClasses } from "../../utils/formStyles.js";
import SubmitButton from "../common/SubmitButton.jsx";

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];
const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

const TaskForm = ({ defaultValues, onSubmit, isSubmitting, submitLabel = "Save" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const submit = (data) => {
    onSubmit({ ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div>
        <label className={labelClasses}>Title</label>
        <input className={inputClasses} {...register("title", { required: "Title is required" })} />
        {errors.title && <p className={errorClasses}>{errors.title.message}</p>}
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea rows={2} className={inputClasses} {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Category</label>
          <input className={inputClasses} {...register("category")} />
        </div>
        <div>
          <label className={labelClasses}>Priority</label>
          <select className={inputClasses} {...register("priority")}>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Due date (optional)</label>
          <input type="date" className={inputClasses} {...register("dueDate")} />
        </div>
        <div>
          <label className={labelClasses}>Status</label>
          <select className={inputClasses} {...register("status")}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SubmitButton isSubmitting={isSubmitting}>{submitLabel}</SubmitButton>
    </form>
  );
};

export default TaskForm;
