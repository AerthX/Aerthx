import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout'; 
import AdminDashboard from '../pages/AdminDashboard';
import AdminRoute from '../components/Admin/AdminRoute';
import NotFound from '../pages/NotFound';
import AdminLogin from '../pages/AdminLogin';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AdminLayout />}>
      <Route path="admin/login" element={<AdminLogin />} /> 
      <Route
        path="dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
          
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
