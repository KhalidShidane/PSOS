import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from "../common/Avatar.jsx";
import SubmitButton from "../common/SubmitButton.jsx";
import { inputClasses, labelClasses, errorClasses } from "../../utils/formStyles.js";
import { fileToCompressedDataUrl } from "../../utils/imageHelpers.js";

const ProfileForm = ({ user, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: user.name, email: user.email, profileImage: user.profileImage || "" },
  });

  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState("");
  const profileImage = watch("profileImage");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setValue("profileImage", dataUrl, { shouldDirty: true });
    } catch (err) {
      setImageError(err.message || "Could not process that image.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="flex items-center gap-4">
        <Avatar name={user.name} src={profileImage} size={64} />
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Change photo
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
        <label className={labelClasses}>Name</label>
        <input className={inputClasses} {...register("name", { required: "Name is required" })} />
        {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClasses}>Email</label>
        <input
          type="email"
          className={inputClasses}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
          })}
        />
        {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
      </div>

      <SubmitButton isSubmitting={isSubmitting}>Save profile</SubmitButton>
    </form>
  );
};

export default ProfileForm;
