// components/Sidebar.tsx
import {useState ,useEffect } from "react";
import Loader from "../components/Loader";
import { Toast } from 'primereact/toast';
import { useRef } from "react";
import { Logout } from "../services/authService";
import type { User } from "../models/User";
import { useNavigate } from "react-router-dom";


const isElectron = () => window.navigator.userAgent.includes("Electron");

const navItems = [
  
  { label: "Lockers", icon: "/images/Locker Icon.svg", route: "/lockers" },
  { label: "Users", icon: "/images/users Icon.svg", route: "/users", webOnly: true },
  { label: "Organization", icon: "/images/Organization Icon.svg", route: "/organization" },
  {label: "Dashboard", icon: "/images/Dashboard.svg", route: "/dashboard", electronOnly: true},
  { label: "Logs", icon: "/images/Tuerca.svg", route: "/Logs" },
];

const Sidebar = () => {
  const [loading, setLoading] = useState<boolean>(false);
   const [user, setUser] = useState<User | null>(null);
  const toast = useRef<Toast>(null);
const navigate = useNavigate();
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
            const fetchedUser = sessionStorage.getItem("user");
            setUser(fetchedUser ? JSON.parse(fetchedUser) as User : null);
  
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

    <div className="mb-6 w-full px-2">
        <button
            className="flex items-center gap-2 hover:bg-[#1f1f1f] px-3 py-2 w-full rounded-lg text-sm transition"
            onClick={() => window.location.href = "/me"}
        >
          <div  >
          <div className="flex items-center gap-2" >
             <img src="/images/logosin.svg" alt="Logo" className="w-10 h-10" />
           <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">
            <div className="font-semibold text-sm">
            {(user?.name ?? "") + " " + (user?.last_name ?? "")}
            </div>
            </div>
          
  </div>
            {/* {(user?.roles?.length ?? 0) > 0 && (
            <div className="mt-1 text-xs text-gray-300 space-y-1 max-h-24 overflow-y-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-7">
            {user?.roles?.map((role, index) => (
            <div key={index} className="leading-tight">
            <strong>{role.role}</strong> – {role.organization_name}
            <br />
            <span className="text-[10px]">
            {role.area_name} / {role.locker_serial_number}
            </span>
            </div>
            ))}
            </div>
            )} */}

 
</div>

        </button>
    </div>
      
      <nav className="flex flex-col gap-4 w-full mt-4">
        {navItems
        .filter(item => {
          if (item.webOnly && isElectron()) return false;
          if (item.electronOnly && !isElectron()) return false;
          return true;
        })


        .map((item, i) => (
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
            
            toast.current?.show({
              severity: 'success',
              summary: 'Logout Successful',
              detail: 'You have been logged out successfully.',
              life: 3000
            });
            
            navigate("/");

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
