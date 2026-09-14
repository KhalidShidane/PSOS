import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { ROUTES, NAV_ITEMS } from "../../utils/routes.js";
import Avatar from "../common/Avatar.jsx";

const PAGE_TITLES = Object.fromEntries(NAV_ITEMS.map((item) => [item.path, item.label]));

const pageTitleFor = (pathname) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/courses/")) return "Course details";
  return "";
};

/**
 * Top bar shown on all screen sizes. On mobile it also carries the app
 * name since the sidebar is hidden below the md breakpoint; a proper
 * collapsible mobile nav will be built out with the rest of the UI.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = pageTitleFor(location.pathname);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <span className="flex items-center gap-2 md:hidden">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-xs font-bold text-white">
          P
        </span>
        <span className="text-base font-semibold text-gray-900">PSOS</span>
      </span>

      {pageTitle && (
        <h1 className="hidden text-sm font-semibold text-gray-700 md:block">{pageTitle}</h1>
      )}

      <div className="ml-auto flex items-center gap-3">
        {user && (
          <Link
            to={ROUTES.SETTINGS}
            className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-gray-50"
          >
            <Avatar name={user.name} src={user.profileImage} size={28} />
            <span className="hidden text-sm text-gray-600 sm:inline">{user.name}</span>
          </Link>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
