// src/pages/Lockers.tsx
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
import Loader from "../components/Loader";
import { putlocker } from "../services/lockersService";
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
    const [updateAreas, setUpdateAreas] = useState<{ id: number; name: string; description: string }[]>([]);
    const [addSchedule, setAddSchedule] = useState(false);

    const [addLockerModal, setAddLockerModal] = useState(false);
    const [areas, setAreas] = useState<{ id: number; name: string; description: string }[]>([]);
    const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
    const [newSerialNumber, setNewSerialNumber] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedLockerToUpdate, setSelectedLockerToUpdate] = useState<Locker | null>(null);
    const [serialNumber, setSerialNumber] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [repeatSchedule, setRepeatSchedule] = useState(false);
    const [dayOfWeek, setDayOfWeek] = useState<number>(0); // 0 = Sunday


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
                    <h3 className="text-xl font-bold">{locker.locker_serial_number}</h3>
                    <p className="text-sm text-gray-300">Organization: {locker.organization_name}</p>
                    <p className="text-sm text-gray-300">Area: {locker.area_name}</p>
                    <div className="flex justify-end">
                        <button className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition" 
                        onClick={() => {
                            setSelectedLockerToUpdate(locker);
                            setSerialNumber(locker.locker_serial_number.toString()); 
                            setSelectedAreaId(locker.area_id);
                            const orgId = sessionStorage.getItem("selected_organization_id");
                            const orgsRaw = sessionStorage.getItem("organizations");

                            if (orgId && orgsRaw) {
                              const orgs = JSON.parse(orgsRaw);
                              const currentOrg = orgs.find((o: any) => o.id.toString() === orgId);
                              if (currentOrg?.areas) {
                                setUpdateAreas(currentOrg.areas);
                              }
                            }
                            setShowModal(true);
                          }}>
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
                            Compartment {compartment.compartment_number}
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




        {showModal && selectedLockerToUpdate && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#252525] rounded-xl p-6 text-white w-[400px]">
      <h2 className="text-xl font-semibold mb-4">Update Locker</h2>

      <div className="mb-2">
        <label className="block text-sm mb-1">Serial Number</label>
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          className="w-full bg-[#444] p-2 border rounded mb-2"
        />
      </div>

      <div className="mb-2">
  <label className="block text-sm mb-1">Area</label>
  <select
        value={selectedAreaId ?? ""}
        onChange={(e) => setSelectedAreaId(Number(e.target.value))}
        className="w-full bg-[#444] p-2 border rounded mb-2"
      >
        <option value="">Select area</option>
        {updateAreas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name} – {area.description}
          </option>
        ))}
      </select>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={addSchedule}
          onChange={(e) => setAddSchedule(e.target.checked)}
          className="mr-2 accent-[#FFD166]"
        />
        <label className="text-sm">Add Schedule</label>
      </div>


          {addSchedule && (
  <>
      <div className="mb-2">
        <label className="block text-sm mb-1">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full bg-[#444] p-2 border rounded mb-2"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm mb-1">End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full bg-[#444] p-2 border rounded mb-2"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm mb-1">Schedule Date</label>
        <input
          type="date"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="w-full bg-[#444] p-2 border rounded mb-2"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm mb-1">Day of Week</label>
        <select
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(Number(e.target.value))}
          className="w-full bg-[#444] p-2 border rounded mb-2"
        >
          <option value={0}>Sunday</option>
          <option value={1}>Monday</option>
          <option value={2}>Tuesday</option>
          <option value={3}>Wednesday</option>
          <option value={4}>Thursday</option>
          <option value={5}>Friday</option>
          <option value={6}>Saturday</option>
        </select>
      </div>

      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={repeatSchedule}
          onChange={(e) => setRepeatSchedule(e.target.checked)}
          className="mr-2"
        />
        <label>Repeat Schedule</label>
      </div>
  </>)}

      <div className="flex justify-end space-x-2 mt-4">
        <button
          className="px-4 py-2 text-[black] bg-gray-300 rounded"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-[black] bg-[#FFD166] rounded"
          onClick={async () => {
            try {
              if (!selectedLockerToUpdate) return;
              await putlocker({
                organization_id: Number(selectedLockerToUpdate.organization_id),
                area_id: Number(selectedLockerToUpdate.area_id),
                serial_number: serialNumber,
                new_schendule: {
                  day_of_week: dayOfWeek,
                  start_time: startTime,
                  end_time: endTime,
                  repeat_schedule: repeatSchedule,
                  schendule_date: scheduleDate,
                },
              });
              toast.current?.show({
                severity: "success",
                summary: "Locker Updated",
                detail: `Locker updated successfully`,
                life: 3000,
              });
              setShowModal(false);
            } catch (e) {
              console.error("Error updating locker:", e);
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update locker",
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
    </div>
  );
}