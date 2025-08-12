import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { haslocker } from "../services/authService";
import Loader from "../components/Loader";
import { setEncryptedCookie,getEncryptedCookie } from "../lib/secureCookies";

interface LockerGuardProps {
  children: React.ReactNode;
}

export default function Haslocker({ children }: LockerGuardProps) {

  const [checking, setChecking] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkLockers = async () => {
      try {
        const result = await haslocker();
        console.log("Locker check result:", result);
        setEncryptedCookie("has_lockers", result ? "true" : "false");
        if (!result) {
          navigate("/welcome", { replace: true });
          return;
        }

     if (typeof window !== "undefined" && !window.navigator.userAgent.includes("Electron")) {

          const userRaw = getEncryptedCookie("u_7f2a1e3c");
          console.log("User cookie:", userRaw);
          if (userRaw) {
            try {
              const user = JSON.parse(userRaw);

              const isSuperAdmin = Array.isArray(user.roles) &&
                user.roles.some((r: any) => r.role === "super_admin");

              if (!isSuperAdmin) {
                navigate("/welcome", { replace: true });
                return;
              }

    } catch (error) {
      console.error("Invalid user cookie format", error);
      navigate("/welcome", { replace: true });
      return;
    }

    
  } else {
    navigate("/welcome", { replace: true });
    return;
  }
}

      } catch (err) {
        console.error("Locker check failed:", err);
        
      } finally {
        setChecking(false);
      }
    };

    checkLockers();
  }, [navigate]);

  if (checking) {
    return <Loader />;
  }

  return <>{children}</>;
}
