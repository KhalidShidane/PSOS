import { Link } from "react-router-dom";
import { ROUTES } from "../utils/routes.js";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 text-center">
    <h1 className="text-4xl font-bold text-gray-800">404</h1>
    <p className="text-gray-500">This page doesn't exist.</p>
    <Link to={ROUTES.DASHBOARD} className="text-emerald-600 hover:underline">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
