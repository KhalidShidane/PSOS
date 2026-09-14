import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  ClipboardList,
  CheckSquare,
  Wallet,
  BarChart3,
  NotebookPen,
  Settings as SettingsIcon,
} from "lucide-react";
import { NAV_ITEMS, ROUTES } from "../../utils/routes.js";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../common/Avatar.jsx";

const ICONS = {
  [ROUTES.DASHBOARD]: LayoutDashboard,
  [ROUTES.COURSES]: BookOpen,
  [ROUTES.STUDY]: BookMarked,
  [ROUTES.ASSIGNMENTS]: ClipboardList,
  [ROUTES.TASKS]: CheckSquare,
  [ROUTES.FINANCE]: Wallet,
  [ROUTES.ANALYTICS]: BarChart3,
  [ROUTES.WEEKLY_REVIEW]: NotebookPen,
  [ROUTES.SETTINGS]: SettingsIcon,
};

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-emerald-600 text-white"
      : "text-gray-300 hover:bg-white/5 hover:text-white"
  }`;

// Charcoal (#1F2937 == Tailwind gray-800) sidebar - the one place the
// brand's secondary color anchors a whole surface, per the design system.
const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-gray-800 md:flex">
      <div className="p-4">
        <div className="mb-6 flex items-center gap-2 px-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-sm font-bold text-white">
            P
          </span>
          <span className="text-lg font-bold text-white">PSOS</span>
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.path];
            return (
              <NavLink key={item.path} to={item.path} className={linkClasses}>
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {user && (
        <NavLink
          to={ROUTES.SETTINGS}
          className="mt-auto flex items-center gap-2.5 border-t border-white/10 p-4 transition-colors hover:bg-white/5"
        >
          <Avatar name={user.name} src={user.profileImage} size={32} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
        </NavLink>
      )}
    </aside>
  );
};

export default Sidebar;
