// src/guards/authguard.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type PrivateRouteProps = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
