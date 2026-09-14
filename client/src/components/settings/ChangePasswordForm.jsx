import { useForm } from "react-hook-form";
import { inputClasses, labelClasses, errorClasses } from "../../utils/formStyles.js";
import SubmitButton from "../common/SubmitButton.jsx";

/**
 * Does not reset itself - the parent remounts this form (via a changing
 * `key` prop) only after a confirmed successful save, so a failed attempt
 * (e.g. wrong current password) never silently clears what the user typed.
 */
const ChangePasswordForm = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const submit = (data) => {
    onSubmit({ currentPassword: data.currentPassword, newPassword: data.newPassword });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div>
        <label className={labelClasses}>Current password</label>
        <input
          type="password"
          className={inputClasses}
          {...register("currentPassword", { required: "Current password is required" })}
        />
        {errors.currentPassword && <p className={errorClasses}>{errors.currentPassword.message}</p>}
      </div>
      <div>
        <label className={labelClasses}>New password</label>
        <input
          type="password"
          className={inputClasses}
          {...register("newPassword", {
            required: "New password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />
        {errors.newPassword && <p className={errorClasses}>{errors.newPassword.message}</p>}
      </div>
      <div>
        <label className={labelClasses}>Confirm new password</label>
        <input
          type="password"
          className={inputClasses}
          {...register("confirmNewPassword", {
            required: "Please confirm your new password",
            validate: (value) => value === newPassword || "Passwords do not match",
          })}
        />
        {errors.confirmNewPassword && <p className={errorClasses}>{errors.confirmNewPassword.message}</p>}
      </div>
      <SubmitButton isSubmitting={isSubmitting}>Change password</SubmitButton>
    </form>
  );
};

export default ChangePasswordForm;
