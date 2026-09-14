import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./utils/routes.js";

import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import GuestRoute from "./components/common/GuestRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import Study from "./pages/Study.jsx";
import Assignments from "./pages/Assignments.jsx";
import Tasks from "./pages/Tasks.jsx";
import Finance from "./pages/Finance.jsx";
import Analytics from "./pages/Analytics.jsx";
import WeeklyReview from "./pages/WeeklyReview.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.COURSES} element={<Courses />} />
          <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetail />} />
          <Route path={ROUTES.STUDY} element={<Study />} />
          <Route path={ROUTES.ASSIGNMENTS} element={<Assignments />} />
          <Route path={ROUTES.TASKS} element={<Tasks />} />
          <Route path={ROUTES.FINANCE} element={<Finance />} />
          <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
          <Route path={ROUTES.WEEKLY_REVIEW} element={<WeeklyReview />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
