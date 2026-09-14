import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../utils/routes.js";
import { pillInputClasses, errorClasses } from "../utils/formStyles.js";
import PasswordField from "../components/common/PasswordField.jsx";

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async ({ name, email, password: pwd }) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      await registerUser({ name, email, password: pwd });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-center text-xl font-semibold text-gray-900">Create your account</h1>

      {serverError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Full name"
            className={pillInputClasses}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            className={pillInputClasses}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
          />
          {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <PasswordField
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            registration={register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
            error={errors.password?.message}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm password
          </label>
          <PasswordField
            id="confirmPassword"
            placeholder="Confirm password"
            autoComplete="new-password"
            registration={register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
            error={errors.confirmPassword?.message}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-emerald-600 px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="font-medium text-emerald-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
