import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { haslocker } from "../services/authService";
import Loader from "../components/Loader";

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
        if (!result) {
          navigate("/welcome", { replace: true });
        }
      } catch (err) {
        console.error("Locker check failed:", err);
        navigate("/welcome", { replace: true });
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
