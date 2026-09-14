import { useForm } from "react-hook-form";
import { SCHEDULE_TYPES, WEEK_ORDER } from "../../utils/scheduleHelpers.js";
import { inputClasses, labelClasses, errorClasses } from "../../utils/formStyles.js";
import SubmitButton from "../common/SubmitButton.jsx";

const ScheduleForm = ({ defaultValues, courses, onSubmit, isSubmitting, submitLabel = "Save" }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const startTime = watch("startTime");

  const submit = (data) => {
    onSubmit({ ...data, course: data.course || undefined });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div>
        <label className={labelClasses}>Activity name</label>
        <input
          className={inputClasses}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className={errorClasses}>{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Type</label>
          <select className={inputClasses} {...register("type", { required: true })}>
            {SCHEDULE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Day</label>
          <select className={inputClasses} {...register("dayOfWeek", { required: true })}>
            {WEEK_ORDER.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Start time</label>
          <input
            type="time"
            className={inputClasses}
            {...register("startTime", { required: "Start time is required" })}
          />
          {errors.startTime && <p className={errorClasses}>{errors.startTime.message}</p>}
        </div>

        <div>
          <label className={labelClasses}>End time</label>
          <input
            type="time"
            className={inputClasses}
            {...register("endTime", {
              required: "End time is required",
              validate: (value) =>
                !startTime || value > startTime || "End time must be after start time",
            })}
          />
          {errors.endTime && <p className={errorClasses}>{errors.endTime.message}</p>}
        </div>
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

      <div>
        <label className={labelClasses}>Location</label>
        <input className={inputClasses} {...register("location")} />
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea rows={2} className={inputClasses} {...register("description")} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          {...register("isRecurring")}
        />
        Repeats weekly
      </label>

      <SubmitButton isSubmitting={isSubmitting}>{submitLabel}</SubmitButton>
    </form>
  );
};

export default ScheduleForm;
