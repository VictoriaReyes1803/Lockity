// src/pages/Lockers.tsx
import Sidebar from "../components/sidebar";
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
import Loader from "../components/Loader";
import type { Locker } from "../models/locker";
import type { Compartment } from "../models/locker";
import { getCompartments } from "../services/lockersService";
import { getLockers } from "../services/lockersService"; 
export default function Lockers() {
  const toast = useRef<Toast>(null);
    const [organizationId, setOrganizationId] = useState<string>("10");
    const [page, setPage] = useState(0); 
    const [lockers, setLockers] = useState<Locker[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [compartments, setCompartments] = useState<Compartment[]>([]);
    const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);

  useEffect(() => {
  const orgsRaw = sessionStorage.getItem("organizations");
  console.log("Organizations from sessionStorage:", orgsRaw);
  if (orgsRaw) {
    try {
      const orgs = JSON.parse(orgsRaw);
      if (Array.isArray(orgs) && orgs.length > 0) {
        setOrganizationId(orgs[0].id.toString()); 
      }
    } catch (err) {
      console.error("Failed to parse organizations from sessionStorage", err);
    }
  }
}, []);


    useEffect(() => {
      if (!organizationId) return;
    const fetchLockers = async () => {
      try {
        setLoading(true);
        const data = await getLockers(page + 1, 10, organizationId);
        setLockers(data.data.items);
        console.log("Lockers loaded:", data.data.items);
      } catch (err) {
        console.error("Error loading lockers:", err);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Could not load lockers.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLockers();
  }, [organizationId, page]);


  const fetchCompartments = async (lockerId: number) => {
  try {
    setLoading(true);
    const data = await getCompartments(lockerId);
    setCompartments(data.data.items);
    console.log("Compartments loaded:", data.data.items);
  } catch (err) {
    console.error("Error loading compartments:", err);
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Could not load compartments.",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex h-screen bg-[#2e2d2d] text-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-[4.3rem] p-4">
        <Toolbar
          title="Lockers"
          showOrganizationSelect={true}
          onChangeOrganization={(id) => {
            setOrganizationId(id);
            setPage(0);
          }}
        />
        <Toast ref={toast} />

        <div className="mt-6 bg-[#252525] rounded-xl p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <button className="bg-[#555555] text-white px-4 py-1 rounded-full font-semibold hover:brightness-90 transition">
              View Logs
            </button>
            <div className="flex items-center gap-2 text-lg font-semibold">
              Add Locker
              <img
                src="/images/Plus.svg"
                alt="Add Locker"
                className="w-7 h-7 cursor-pointer"
              />
            </div>
          </div>

          {loading && <Loader />}


          <div className="flex flex-col md:flex-row gap-6">
            {/* Lockers list */}
            <div className="flex-1 space-y-4">
              {lockers.map((locker) => (
                <div
                    key={locker.id}
                    className="border border-[#959595] rounded-xl p-4 bg-[#222] shadow cursor-pointer hover:brightness-110 transition"
                    onClick={() => {
                        setSelectedLocker(locker);
                        fetchCompartments(locker.id);
                    }}
                    >
                    <h3 className="text-xl font-bold">{locker.locker_number}</h3>
                    <p className="text-sm text-gray-300">Organization: {locker.organization_name}</p>
                    <p className="text-sm text-gray-300">Area: {locker.area_name}</p>
                    <div className="flex justify-end">
                        <button className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition mt-2">
                        Update
                        </button>
                    </div>
                    </div>

              ))}
            </div>

            {/* Compartments */}
           <div className="flex-1 rounded-xl ">
            <h3 className="text-xl font-bold mb-2">Compartments</h3>
            <div className="border border-[#959595] rounded-md p-4">
                {selectedLocker ? (
                <>
                    <h4 className="font-bold mb-2">
                    Locker {selectedLocker.locker_number}
                    </h4>
                    {loading && <Loader />}
                    {compartments.length === 0 && !loading && (
                    <p className="text-gray-300">No compartments found.</p>
                    )}
                    {compartments.map((compartment) => (
                    <div
                        key={compartment.id}
                        className="flex justify-between items-center border-b border-gray-500 py-1"
                    >
                        <div>
                            <div className="font-semibold">
                            Drawer {compartment.compartment_number}
                            </div>
                            <div className="text-xs text-gray-400 ml-4">
                              {compartment.users && compartment.users.length > 0
                                ? compartment.users.map((user, idx) => (
                                    <span key={user.id}>
                                      {user.name}
                                      {idx < compartment.users.length - 1 && ", "}
                                    </span>
                                  ))
                                : "Unknown"}
                            </div>
                            </div>
                        <span
                        className={`
                            text-xs font-bold px-3 py-1 rounded-full
                            ${
                            compartment.status.toLowerCase() === "open"
                                ? "bg-[#41b883] text-white"
                                : "bg-gray-500 text-white"
                            }
                        `}
                        >
                        {compartment.status.toUpperCase()}
                        </span>

                         {/* <button className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition mt-2">
                        Update
                        </button> */}
                    </div>
                    ))}
                </>
                ) : (
                <p className="text-gray-300">Select a locker to see compartments</p>
                )}
            </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}