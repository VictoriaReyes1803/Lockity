// components/Sidebar.tsx
import {useState ,useEffect } from "react";
import Loader from "../components/Loader";
import {Me} from "../services/authService"
import { Toast } from 'primereact/toast';
import { useRef } from "react";

import { Logout } from "../services/authService";

import type { User } from "../models/User";
const navItems = [
  
  { label: "Lockers", icon: "/images/Locker Icon.svg", route: "/lockers" },
  { label: "Users", icon: "/images/users Icon.svg", route: "/users" },
  { label: "Organization", icon: "/images/Organization Icon.svg", route: "/organization" },
  { label: "Settings", icon: "/images/Tuerca.svg", route: "/settings" },
];

const Sidebar = () => {
  const [loading, setLoading] = useState<boolean>(false);
   const [user, setUser] = useState<User | null>(null);
  const toast = useRef<Toast>(null);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
            const fetchedUser = await Me();
            sessionStorage.setItem("user", JSON.stringify(fetchedUser));
            setUser(fetchedUser);
  
        } catch (err) {
          console.error("Failed to load user:", err);
        }
        finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
  return (

    <aside className="group fixed top-0 left-0 h-screen w-16 hover:w-52 bg-[#555555] text-white shadow-md flex flex-col items-center py-4 transition-all duration-300 z-50 rounded-tr-2xl rounded-br-2xl overflow-hidden">
      <Toast ref={toast} />

      <div className="mb-6">
        <img src="/images/logosin.svg" alt="Logo" className="w-10 h-10" />
      </div>

    <div className="mb-6 w-full px-2">
        <button
            className="flex items-center gap-2 hover:bg-[#1f1f1f] px-3 py-2 w-full rounded-lg text-sm transition"
            onClick={() => window.location.href = "/me"}
        >
            <img src="/images/User Icon.svg" alt="User" className="w-5 h-5" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {(user?.name ?? "") + " " + (user?.last_name ?? "")}
            </span>
        </button>
    </div>
      
      <nav className="flex flex-col gap-4 w-full mt-4">
        {navItems.map((item, i) => (
          <a
            key={i}
            href={item.route}
            className="flex items-center px-4 py-2 hover:bg-[#1f1f1f] transition rounded-lg"
          >
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      <div className="mt-auto mb-6 w-full px-2">
        <button
        className="flex items-center gap-2 bg-[#2e2d2d] hover:bg-[#1f1f1f] px-3 py-2 w-full rounded-lg text-sm transition"
        onClick={async () => {
          try {
            await Logout();
            sessionStorage.clear();
            toast.current?.show({
              severity: 'success',
              summary: 'Logout Successful',
              detail: 'You have been logged out successfully.',
              life: 3000
            });
            window.location.href = "/";  
          } catch (err) {
            console.error("Error during logout:", err);
          }
        }}
      >
        <img src="/images/Logout.svg" alt="Logout" className="w-5 h-5" />
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Logout
        </span>
      </button>
      {loading && <Loader />  }

      </div>
    </aside>
  
  );
};

export default Sidebar;
