import { useForm } from "react-hook-form";
import { inputClasses, labelClasses, errorClasses } from "../../utils/formStyles.js";
import SubmitButton from "../common/SubmitButton.jsx";

const STATUS_OPTIONS = ["Planned", "In Progress", "Completed"];

const StudySessionForm = ({ defaultValues, courses, onSubmit, isSubmitting, submitLabel = "Save" }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const startTime = watch("startTime");

  const submit = (data) => {
    onSubmit({
      ...data,
      course: data.course || undefined,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div>
        <label className={labelClasses}>Topic</label>
        <input className={inputClasses} {...register("topic", { required: "Topic is required" })} />
        {errors.topic && <p className={errorClasses}>{errors.topic.message}</p>}
      </div>

      <div>
        <label className={labelClasses}>Course (optional)</label>
        <select className={inputClasses} {...register("course")}>
          <option value="">None</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Start</label>
          <input
            type="datetime-local"
            className={inputClasses}
            {...register("startTime", { required: "Start time is required" })}
          />
          {errors.startTime && <p className={errorClasses}>{errors.startTime.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>End</label>
          <input
            type="datetime-local"
            className={inputClasses}
            {...register("endTime", {
              validate: (value) => !value || !startTime || value > startTime || "End must be after start",
            })}
          />
          {errors.endTime && <p className={errorClasses}>{errors.endTime.message}</p>}
        </div>
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

      <div>
        <label className={labelClasses}>Notes</label>
        <textarea rows={2} className={inputClasses} {...register("notes")} />
      </div>

      <SubmitButton isSubmitting={isSubmitting}>{submitLabel}</SubmitButton>
    </form>
  );
};

export default StudySessionForm;
