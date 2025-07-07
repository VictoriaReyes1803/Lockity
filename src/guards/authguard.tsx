// src/guards/authguard.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
type PrivateRouteProps = {
  children: ReactNode;
};
interface TokenPayload {
  exp: number; 
  [key: string]: unknown;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem("access_token");
  console.log("Token in PrivateRoute:", token);
  if (!token) {
    return <Navigate to="/" replace />;
  }


  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const now = Math.floor(Date.now() / 1000); 

    if (decoded.exp && decoded.exp < now) {
      
      localStorage.removeItem("access_token");
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    console.error("Error decoding token:", e);
  
    localStorage.removeItem("access_token");
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
