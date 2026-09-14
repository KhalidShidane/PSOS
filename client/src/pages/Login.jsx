import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../utils/routes.js";
import { pillInputClasses, errorClasses } from "../utils/formStyles.js";
import PasswordField from "../components/common/PasswordField.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      await login(data);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-center text-xl font-semibold text-gray-900">Log in</h1>

      {serverError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            {...register("email", { required: "Email is required" })}
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
            autoComplete="current-password"
            registration={register("password", { required: "Password is required" })}
            error={errors.password?.message}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-emerald-600 px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to={ROUTES.REGISTER} className="font-medium text-emerald-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
