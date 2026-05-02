import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import CreateProject from '../pages/CreateProject';
import ProjectDetails from '../pages/ProjectDetails';
import Dashboard from '../pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      
      {/* Protected Routes */}
      <Route path="/create-project" element={
        <ProtectedRoute>
          <CreateProject />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
