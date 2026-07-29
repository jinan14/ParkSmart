import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/user";

export function ProtectedRoute({ children, role }: { children: ReactNode; role?: Role }) {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
