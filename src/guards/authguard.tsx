// src/guards/authguard.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { getEncryptedCookie } from '../lib/secureCookies';
type PrivateRouteProps = {
  children: ReactNode;
};
interface TokenPayload {
  exp: number; 
  [key: string]: unknown;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = getEncryptedCookie("access_token");
  console.log("Token in PrivateRoute:", token);
  if (!token) {
    return <Navigate to="/" replace />;
  }


  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const now = Math.floor(Date.now() / 1000); 

    if (decoded.exp && decoded.exp < now) {
      
      Cookies.remove("access_token");
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    console.error("Error decoding token:", e);
  
     Cookies.remove("access_token");
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
