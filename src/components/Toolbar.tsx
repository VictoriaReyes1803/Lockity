// components/Toolbar.tsx
import {useState ,useEffect } from "react";
import {Me} from "../services/authService"
import type { User } from "../models/User";
import type { organization } from "../models/locker"; 
import { getOrganization } from "../services/lockersService"; 
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface ToolbarProps {
  title: string;
  onChangeOrganization?: (id: string) => void; 
  showOrganizationSelect?: boolean; 
}

const Toolbar  = ({ title, onChangeOrganization
, showOrganizationSelect = false
 }: ToolbarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<organization[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const fetchedUser = await Me();
      sessionStorage.setItem("user", JSON.stringify(fetchedUser));
      setUser(fetchedUser.data);
      
      const orgResponse = await getOrganization();
      console.log("Organizations response:", orgResponse.data.items);
      if(orgResponse.success )
      {
      setOrganizations(orgResponse.data.items);
      }
      else {
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail: orgResponse.message,
          life: 3000,
        });
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  fetchData();
}, []);

  return (
    <header className="w-full h-[60px] bg-gradient-to-t from-[#737373] to-[#2e2e2e] rounded-xl flex items-center justify-between px-6 text-white shadow-lg">

      <div className="flex items-center space-x-3">
        <img
          src="/images/User Icon.svg"
          alt="user"
          className="w-8 h-8 rounded-full border border-gray-200"
        />
        <span className="text-sm font-medium">
          Hello {user?.name ?? ""}
        </span>
      </div>

   
      <h1 className="text-lg font-semibold">{title}</h1>
     {showOrganizationSelect && (
         <select
          onChange={(e) => onChangeOrganization?.(e.target.value)}
          className="bg-[#444] text-white rounded px-2 py-1 ml-4"
        >
          <option value="">Select organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
          {organizations.length === 0 && (
            <option disabled value="">
              No organizations available
            </option>
          )}
        </select>


        )}

    </header>
  );
};

export default Toolbar;
