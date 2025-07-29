// src/pages/Lockers.tsx
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { organization, Area } from "../models/organization";
import { getEncryptedCookie } from '../lib/secureCookies';
import { getOrganization, postOrganization,putOrganization, putArea,postArea } from "../services/organizationsService";
import { getAreas } from "../services/organizationsService";
import { setEncryptedCookie } from '../lib/secureCookies';
export default function Lockers() {

  const toast = useRef<Toast>(null);
    const [organizationId, setOrganizationId] = useState<string>("");
    const [orgLoaded, setOrgLoaded] = useState(false);
    const [organizations, setOrganizations] = useState<organization[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [page, setPage] = useState(0); 
    const [editingArea, setEditingArea] = useState<Area | null>(null);
const [showAreaModal, setShowAreaModal] = useState(false);

    const [showOrgModal, setShowOrgModal] = useState(false);
const [editingOrg, setEditingOrg] = useState<organization | null>(null);
const [orgName, setOrgName] = useState("");
const [orgDescription, setOrgDescription] = useState("");
const [areaName, setAreaName] = useState("");
const [areaDescription, setAreaDescription] = useState("");
const [lockerSerial, setLockerSerial] = useState("");


    const [loading, setLoading] = useState<boolean>(false);



     const fetchOrgs = async () => {
  const orgsRaw = getEncryptedCookie("o_ae3d8f2b");
  const selectedOrg = getEncryptedCookie("s_12be90dd");

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
        setEncryptedCookie("o_ae3d8f2b", JSON.stringify(orgResponse.data.items));
        if (orgResponse.data.items.length > 0) {
          const firstOrgId = orgResponse.data.items[0].id.toString();
          setOrganizationId(firstOrgId);

          setEncryptedCookie("s_12be90dd", firstOrgId);
        }
        setOrgLoaded(true);
      } catch (err) {
        console.error("Failed to fetch organizations", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
  fetchOrgs();
}, []);

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
  useEffect(() => {
  if (!orgLoaded || !organizationId) return;
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
  alt="Add Org"
  className="w-7 h-7 cursor-pointer"
  onClick={() => {
    setEditingOrg(null);
    setOrgName("");
    setOrgDescription("");
    setAreaName("");
    setAreaDescription("");
    setLockerSerial("");
    setShowOrgModal(true);
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
        setEncryptedCookie("s_12be90dd", org.id.toString());
      }}
    >
      <h3 className="text-lg font-semibold">{org.name}</h3>
      <p className="text-sm text-gray-400">{org.description}</p>
     
      <ul className="mt-2 space-y-1">
  {org.areas.map((area) => (
    <li key={area.id} className="flex items-start gap-2 text-sm text-gray-300">
      <i className="pi pi-folder text-[#FFD166] mt-[2px]" /> 
      <div>
        <span className="font-medium">{area.name}</span>
        <div className="text-xs text-gray-500">{area.description}</div>
      </div>

       <div className="flex gap-1 mt-1">
      
    </div>
    </li>
  ))}
</ul>
<div className="flex justify-end">
   <button className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition"
    onClick={(e) => {
  e.stopPropagation();
  setEditingOrg(org);
  setOrgName(org.name);
  setOrgDescription(org.description);

  const firstArea = org.areas?.[0];
  const firstLocker = firstArea?.lockers?.[0];

  setAreaName(firstArea?.name || "");
  setAreaDescription(firstArea?.description || "");
  setLockerSerial(firstLocker?.serial_number || "");

  setShowOrgModal(true);
}}

   >
    Update
   </button>
</div>
    </div>
  ))}
            </div>

            {/* Areas */}
           
<div className="flex-1 rounded-xl ">
  <div className="flex justify-between">
    <h3 className="text-xl font-bold mb-2">Areas</h3>
     <button
        className="p-1 rounded-full text-white hover:brightness-90 hover:bg-[#FFD166] transition"
        onClick={() => {
        setEditingArea(null);
        setAreaName("");
        setAreaDescription("");
        setShowAreaModal(true);
        }}
      >Add Area 
        <FontAwesomeIcon className="ml-2" icon="plus" />
      </button>
  </div>
  
  <div className="border border-[#959595] rounded-md p-4 space-y-2">
    {areas.length > 0 ? (
      areas.map((area) => (
        <div key={area.id} className="border-b pb-1">
          <div className="flex gap-2">
          <h4 className="text-md font-medium">{area.name}</h4>
      <button
        className="p-1 rounded-full text-white hover:brightness-110 hover:bg-[#555555] transition"
        onClick={() => {
          setEditingArea(area);
          setAreaName(area.name);
          setAreaDescription(area.description);
          setShowAreaModal(true);
        }}
      >
        ✎
      </button>

     
      </div>
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


      {showOrgModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#252525] rounded-xl p-6 text-white w-[400px] max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">
        {editingOrg ? "Update Organization" : "Add Organization"}
      </h2>

      <div className="mb-3">
        <label className="block text-sm mb-1">Organization Name</label>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="w-full bg-[#444] p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Organization Description</label>
        <input
          value={orgDescription}
          onChange={(e) => setOrgDescription(e.target.value)}
          className="w-full bg-[#444] p-2 border rounded"
        />
      </div>

      {!editingOrg && (
        <>
          <hr className="my-3 border-[#444]" />
          <h3 className="text-md font-semibold mb-2">Initial Area</h3>

          <div className="mb-3">
            <label className="block text-sm mb-1">Area Name</label>
            <input
              type="text"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className="w-full bg-[#444] p-2 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1">Area Description</label>
            <input
              type="text"
              value={areaDescription}
              onChange={(e) => setAreaDescription(e.target.value)}
              className="w-full bg-[#444] p-2 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1">Locker Serial Number</label>
            <input
              type="text"
              value={lockerSerial}
              onChange={(e) => setLockerSerial(e.target.value)}
              className="w-full bg-[#444] p-2 border rounded"
            />
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setShowOrgModal(false)}
          className="px-4 py-2 text-black bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              if (!orgName || !orgDescription) return;

              if (editingOrg) {
                await putOrganization(
                  { name: orgName, description: orgDescription },
                  editingOrg.id
                );
              } else {
                await postOrganization({
                  name: orgName,
                  description: orgDescription,
                  area: { name: areaName, description: areaDescription },
                  locker_serial_number: lockerSerial,
                });
              }

              toast.current?.show({
                severity: "success",
                summary: editingOrg ? "Organization Updated" : "Organization Added",
                detail: "Organization saved successfully",
                life: 3000,
              });

              setShowOrgModal(false);
              sessionStorage.clear();
              fetchOrgs?.(); 
            } catch (e) {
              console.error("Failed to save organization", e);
              if (
                typeof e === "object" &&
                e !== null &&
                "response" in e &&
                typeof (e as any).response === "object" &&
                (e as any).response !== null &&
                "data" in (e as any).response &&
                typeof (e as any).response.data === "object" &&
                (e as any).response.data !== null &&
                "errors" in (e as any).response.data &&
                (e as any).response.data.errors &&
                "name" in (e as any).response.data.errors
              ) {
                toast.current?.show({
                  severity: "error",
                  summary: "Error",
                  detail: (e as any).response.data.errors.name[0],
                  life: 3000,
                });
              } else {
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to save organization",
                life: 3000,
              });
            }}
          }}
          className="px-4 py-2 text-black bg-[#FFD166] rounded"
        >
          {editingOrg ? "Update" : "Add"}
        </button>
      </div>
    </div>
  </div>
)}


{showAreaModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#252525] p-6 rounded-xl w-[400px] text-white">
      <h2 className="text-xl font-semibold mb-4">
        {editingArea ? "Update Area" : "Add Area"}
      </h2>

      <div className="mb-3">
        <label className="block text-sm mb-1">Area Name</label>
        <input
          type="text"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          className="w-full bg-[#444] p-2 rounded border"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Description</label>
        <input
          type="text"
          value={areaDescription}
          onChange={(e) => setAreaDescription(e.target.value)}
          className="w-full bg-[#444] p-2 rounded border"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded"
          onClick={() => {
            setShowAreaModal(false);
            setEditingArea(null);
          }}
        >
          Cancel
        </button>

        <button
          className="bg-[#FFD166] text-black px-4 py-2 rounded"
          onClick={async () => {
            try {
              if (editingArea) {
                await putArea(
                  { name: areaName, description: areaDescription },
                  editingArea.id
                );
              } else {
                await postArea(
                  Number(organizationId), 
                  {
                    name: areaName,
                    description: areaDescription,
                  } 
                );
              }
              toast.current?.show({
                severity: "success",
                summary: editingArea ? "Area Updated" : "Area Added",
                detail: "Area saved successfully",
                life: 3000,
              });
              setShowAreaModal(false);
              setEditingArea(null);
              setAreaName("");
              setAreaDescription("");
              sessionStorage.clear();
              fetchAreas();
            } catch (err) {
              console.error("Error saving area", err);
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to save area.",
                life: 3000,
              });
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


    </div>



  );
}