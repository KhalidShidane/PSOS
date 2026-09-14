import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown, BookOpen } from "lucide-react";
import { inputClasses, labelClasses, errorClasses } from "../../utils/formStyles.js";
import { fileToCompressedDataUrl } from "../../utils/imageHelpers.js";
import SubmitButton from "../common/SubmitButton.jsx";

const STATUS_OPTIONS = ["active", "completed", "dropped"];

/**
 * Photo + name + lecturer + status are the primary, always-visible
 * fields. Course code/credit hours/location/description still exist
 * (nothing was removed from the data model) but live behind a "more
 * details" disclosure - expanded automatically when editing a course
 * that already has any of them set.
 */
const CourseForm = ({ defaultValues, onSubmit, isSubmitting, submitLabel = "Save course" }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState("");
  const [showMore, setShowMore] = useState(() =>
    Boolean(
      defaultValues?.code || defaultValues?.creditHours || defaultValues?.location || defaultValues?.description
    )
  );
  const photo = watch("photo");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");
    try {
      const dataUrl = await fileToCompressedDataUrl(file, { maxDimension: 400 });
      setValue("photo", dataUrl, { shouldDirty: true });
    } catch (err) {
      setImageError(err.message || "Could not process that image.");
    } finally {
      e.target.value = "";
    }
  };

  const submit = (data) => {
    onSubmit({
      ...data,
      creditHours: Number.isNaN(data.creditHours) ? undefined : data.creditHours,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div className="flex items-center gap-4">
        {photo ? (
          <img src={photo} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <BookOpen className="h-7 w-7" strokeWidth={1.75} />
          </span>
        )}
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {photo ? "Change photo" : "Add photo"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {imageError && <p className={errorClasses}>{imageError}</p>}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Course name</label>
        <input className={inputClasses} {...register("name", { required: "Course name is required" })} />
        {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Lecturer</label>
          <input className={inputClasses} {...register("lecturer")} />
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

      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
        {showMore ? "Hide more details" : "More details (optional)"}
      </button>

      {showMore && (
        <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Course code</label>
              <input className={inputClasses} {...register("code")} />
            </div>
            <div>
              <label className={labelClasses}>Credit hours</label>
              <input
                type="number"
                min="0"
                className={inputClasses}
                {...register("creditHours", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              {errors.creditHours && <p className={errorClasses}>{errors.creditHours.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelClasses}>Location</label>
            <input className={inputClasses} {...register("location")} />
          </div>
          <div>
            <label className={labelClasses}>Description</label>
            <textarea rows={3} className={inputClasses} {...register("description")} />
          </div>
        </div>
      )}

      <SubmitButton isSubmitting={isSubmitting}>{submitLabel}</SubmitButton>
    </form>
  );
};

export default CourseForm;
