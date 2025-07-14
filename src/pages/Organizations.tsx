// src/pages/Lockers.tsx
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
import Loader from "../components/Loader";
import type { organization, Area } from "../models/organization";
import { getOrganization } from "../services/organizationsService";
import { getAreas } from "../services/organizationsService";
export default function Lockers() {
  const toast = useRef<Toast>(null);
    const [organizationId, setOrganizationId] = useState<string>("");
    const [orgLoaded, setOrgLoaded] = useState(false);
    const [organizations, setOrganizations] = useState<organization[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [page, setPage] = useState(0); 


    const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const fetchOrgs = async () => {
  const orgsRaw = sessionStorage.getItem("organizations");
  const selectedOrg = sessionStorage.getItem("selected_organization_id");

  if (orgsRaw) {
      const parsedOrgs = JSON.parse(orgsRaw);
      setOrganizations(parsedOrgs);

      if (selectedOrg) {
        setOrganizationId(selectedOrg);
        setOrgLoaded(true);
      }
    } else {
      try {
        setLoading(true);
        const orgResponse = await getOrganization();
        setOrganizations(orgResponse.data.items);
        sessionStorage.setItem("organizations", JSON.stringify(orgResponse.data.items));
        if (orgResponse.data.items.length > 0) {
          const firstOrgId = orgResponse.data.items[0].id.toString();
          setOrganizationId(firstOrgId);
          sessionStorage.setItem("selected_organization_id", firstOrgId);
        }
        setOrgLoaded(true);
      } catch (err) {
        console.error("Failed to fetch organizations", err);
      } finally {
        setLoading(false);
      }
    }
  };

  fetchOrgs();
}, []);


  useEffect(() => {
  if (!orgLoaded || !organizationId) return;

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const areaResponse = await getAreas(organizationId);
      console.log("Areas response:", areaResponse);
      setAreas(areaResponse.data.items || []);
    } catch (err) {
      console.error("Failed to fetch areas", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAreas();
}, [organizationId]);



 


  return (
    <div className="flex h-screen bg-[#2e2d2d] text-white font-sans">
      
      <div className="flex-1 ml-[3.6rem]  w-full">
        <Toolbar
          title="Organizations"
          
        />
        <Toast ref={toast} />

        <div className="mt-6 bg-[#252525] rounded-xl p-6 overflow-x-auto ml-6 mr-2">
          <div className="flex justify-between items-center mb-4">
            <button className="bg-[#555555] text-white px-4 py-1 rounded-full font-semibold hover:brightness-90 transition">
              View Logs
            </button>
            <div className="flex items-center gap-2 text-lg font-semibold">
              Add Organization
              <img
                src="/images/Plus.svg"
                alt="Add Locker"
                className="w-7 h-7 cursor-pointer"
                onClick={() => {
      
                }}
              />
            </div>
          </div>

          {loading && <Loader />}


          <div className="flex flex-col md:flex-row gap-6">
            {/* Organizations list */}
            <div className="flex-1 space-y-4">
              {organizations.map((org) => (
    <div
      key={org.id}
      className={`border rounded-xl p-4 cursor-pointer transition ${
        org.id.toString() === organizationId ? "bg-[#333]" : "bg-[#222]"
      }`}
      onClick={() => {
        setOrganizationId(org.id.toString());
        sessionStorage.setItem("selected_organization_id", org.id.toString());
      }}
    >
      <h3 className="text-lg font-semibold">{org.name}</h3>
      <p className="text-sm text-gray-400">{org.description}</p>
     
      <ul className="mt-2 space-y-1">
  {org.areas.map((area) => (
    <li key={area.id} className="flex items-start gap-2 text-sm text-gray-300">
      <i className="pi pi-folder text-[#FFD166] mt-[2px]" /> {/* Ícono */}
      <div>
        <span className="font-medium">{area.name}</span>
        <div className="text-xs text-gray-500">{area.description}</div>
      </div>
    </li>
  ))}
</ul>


    </div>
  ))}
            </div>

            {/* Areas */}
           
<div className="flex-1 rounded-xl ">
  <h3 className="text-xl font-bold mb-2">Areas</h3>
  <div className="border border-[#959595] rounded-md p-4 space-y-2">
    {areas.length > 0 ? (
      areas.map((area) => (
        <div key={area.id} className="border-b pb-1">
          <h4 className="text-md font-medium">{area.name}</h4>
          <p className="text-sm text-gray-400">{area.description}</p>

          {Array.isArray(area.lockers) && area.lockers.length > 0 ? (

          <ul className="mt-1 ml-5 list-disc list-inside text-xs text-gray-400 space-y-1">
            {area.lockers.map((locker) => (
              <li key={locker.id} className="flex items-center gap-1">
                <i className="pi pi-lock text-gray-500" />
                <span>{locker.serial_number}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-gray-500 ml-5 italic">No lockers</div>
        )}
        
        </div>
      ))
    ) : (
      <p className="text-gray-400">No areas found for this organization.</p>
    )}
  </div>
</div>

          </div>
        </div>




     

      </div>
    </div>
  );
}