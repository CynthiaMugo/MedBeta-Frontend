import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token → send to login
    return <Navigate to="/auth" replace />;
  }

  try {
    // Decode token payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.role;

    // If allowedRoles is defined, check access
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/auth" replace />;
  }
}
