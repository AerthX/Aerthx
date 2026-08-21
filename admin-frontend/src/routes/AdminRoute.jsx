import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "../components/Admin/AdminRoute";
import NotFound from "../pages/NotFound";
import AdminLogin from "../pages/AdminLogin";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AdminLayout />}>

      {/* Admin login */}
      <Route path="login" element={<AdminLogin />} />

      {/* Admin dashboard */}
      <Route
        path="dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* localhost:5175/ → /login */}
      <Route
        index
        element={<Navigate to="/login" replace />}
      />

      <Route path="*" element={<NotFound />} />

    </Route>
  )
);

export default router;