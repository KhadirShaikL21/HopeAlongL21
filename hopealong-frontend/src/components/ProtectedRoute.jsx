import { useAuth } from "../context/AuthContext.jsx";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;