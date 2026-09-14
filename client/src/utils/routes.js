export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  COURSE_DETAIL: "/courses/:id",
  STUDY: "/study",
  ASSIGNMENTS: "/assignments",
  TASKS: "/tasks",
  FINANCE: "/finance",
  ANALYTICS: "/analytics",
  WEEKLY_REVIEW: "/weekly-review",
  SETTINGS: "/settings",
};

// Primary navigation entries shown in the sidebar, in the order the
// application prioritizes them: courses > study > assignments/tasks
// > progress.
export const NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD },
  { label: "Courses", path: ROUTES.COURSES },
  { label: "Study", path: ROUTES.STUDY },
  { label: "Assignments", path: ROUTES.ASSIGNMENTS },
  { label: "Tasks", path: ROUTES.TASKS },
  { label: "Finance", path: ROUTES.FINANCE },
  { label: "Analytics", path: ROUTES.ANALYTICS },
  { label: "Weekly Review", path: ROUTES.WEEKLY_REVIEW },
  { label: "Settings", path: ROUTES.SETTINGS },
];
