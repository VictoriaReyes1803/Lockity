import { useState, useEffect, useRef } from "react";
import { Me } from "../services/authService";
import type { User } from "../models/User";
import type { organization } from "../models/organization";
import { getOrganization } from "../services/organizationsService";
import { Toast } from "primereact/toast";

interface ToolbarProps {
  title: string;
  onChangeOrganization?: (id: string) => void;
  showOrganizationSelect?: boolean;
}

const Toolbar = ({ title, onChangeOrganization, showOrganizationSelect = false }: ToolbarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | "">("");
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUser = await Me();
        sessionStorage.setItem("user", JSON.stringify(fetchedUser.data));
        setUser(fetchedUser.data);

        if (showOrganizationSelect) {

          const storedOrganizations = sessionStorage.getItem("organizations");
          const storedSelectedOrg = sessionStorage.getItem("selected_organization_id");

          if (storedOrganizations) {
            const parsedOrgs = JSON.parse(storedOrganizations) as organization[];
            setOrganizations(parsedOrgs);

            if (storedSelectedOrg && storedSelectedOrg !== selectedOrgId) {
              setSelectedOrgId(storedSelectedOrg);
              sessionStorage.setItem("selected_organization_id", storedSelectedOrg);
              onChangeOrganization?.(storedSelectedOrg);
            }
              if (!storedSelectedOrg && parsedOrgs.length > 0) {
              console.log("No selected organization found in sessionStorage, setting first organization as default.");
              const firstOrgId = parsedOrgs[0].id.toString();
              setSelectedOrgId(firstOrgId);
              sessionStorage.setItem("selected_organization_id", firstOrgId);
              onChangeOrganization?.(firstOrgId);
            }  


          }        
          else {
      
            const orgResponse = await getOrganization();

            if (orgResponse.success) {
              setOrganizations(orgResponse.data.items);
              
              const parsedOrgs = orgResponse.data.items as organization[];
              sessionStorage.setItem("organizations", JSON.stringify(orgResponse.data.items));

              if (!storedSelectedOrg && parsedOrgs.length > 0) {
   
              const firstOrgId = parsedOrgs[0].id.toString();
              setSelectedOrgId(firstOrgId);
              sessionStorage.setItem("selected_organization_id", firstOrgId);
              onChangeOrganization?.(firstOrgId);
            }  

            } else {
              toast.current?.show({
                severity: "warn",
                summary: "Warning",
                detail: orgResponse.message,
                life: 3000,
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    fetchData();
  }, []);


  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = e.target.value;
    setSelectedOrgId(orgId);
    sessionStorage.setItem("selected_organization_id", orgId);
    onChangeOrganization?.(orgId);
  };

  return (
    <header className="w-full h-[60px] bg-gradient-to-t from-[#737373] to-[#2e2e2e]  flex items-center justify-between px-6 text-white shadow-lg">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium">Hello {user?.name ?? ""}!!</span>
      </div>

      <h1 className="text-lg font-semibold">{title}</h1>

      {showOrganizationSelect && (
        <select
          value={selectedOrgId}
          onChange={handleOrgChange}
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
