import { Outlet } from "react-router-dom";

/**
 * Minimal, centered auth layout - logo, then the form floats directly on
 * the page with no bordered card around it (matches the reference
 * pattern the user asked for), just generous whitespace.
 */
const AuthLayout = () => {
  return (
    <div className="flex min-h-screen justify-center bg-white px-4 pb-16 pt-20 sm:pt-28">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-white">
            P
          </span>
          <span className="text-lg font-semibold text-gray-900">Personal Student OS</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
