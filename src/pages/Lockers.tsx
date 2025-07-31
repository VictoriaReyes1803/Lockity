// src/pages/Lockers.tsx
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";

import { Paginator } from "primereact/paginator";
import { useRef, useState, useEffect } from "react";
import Loader from "../components/Loader";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import {getEncryptedCookie} from '../lib/secureCookies';
import { putlocker } from "../services/lockersService";
import type { Locker} from "../models/locker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Compartment } from "../models/locker";
import { getCompartments, deleteSchedule } from "../services/lockersService";
import { getLockers , putSchedule} from "../services/lockersService"; 



export default function Lockers() {
const isElectron = typeof window !== "undefined" && window.navigator.userAgent.includes("Electron");

const [rows, setRows] = useState(10); 
const [totalRecords, setTotalRecords] = useState(0); 

  const toast = useRef<Toast>(null);
    const [organizationId, setOrganizationId] = useState<string>("");
    const [page, setPage] = useState(0); 
    const [deleteAllSchedules, setDeleteAllSchedules] = useState(false);
    const [lockers, setLockers] = useState<Locker[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [compartments, setCompartments] = useState<Compartment[]>([]);
    const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
    const [updateAreas, setUpdateAreas] = useState<{ id: number; name: string; description: string }[]>([]);
    const [addSchedule, setAddSchedule] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [schedules, setSchedules] = useState([
  {
    startTime: "",
    endTime: "",
    dayOfWeek: -1,
    scheduleDate: "",
    repeatSchedule: false,
  },
]); 
  const [scheduleBeingEdited, setScheduleBeingEdited] = useState<{
  lockerId: number;
  scheduleId: number;
} | null>(null);

    const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedLockerToUpdate, setSelectedLockerToUpdate] = useState<Locker | null>(null);
    const [serialNumber, setSerialNumber] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [repeatSchedule, setRepeatSchedule] = useState(false);
    const [dayOfWeek, setDayOfWeek] = useState<number>(0); 
    const [showSchedules, setShowSchedules] = useState(true);

    const updateSchedule = (index: number, newSchedule: typeof schedules[0]) => {
  const updated = [...schedules];
  
  updated[index] = newSchedule;
  setSchedules(updated);
};

const removeSchedule = (index: number) => {
  const updated = schedules.filter((_, i) => i !== index);
  setSchedules(updated);
};


  useEffect(() => {
    setLoading(true);
  const orgsRaw = getEncryptedCookie("o_ae3d8f2b");
  const selectedOrg = getEncryptedCookie("s_12be90dd");

  if (orgsRaw && selectedOrg) {
    setOrganizationId(selectedOrg);
    
    setLoading(false);
  }
else {
    
    toast.current?.show({
      severity: "error",
     summary: "Error",
     detail: "Error loading organization data, please.",
      life: 3000,
    });
  }

}, []);


   useEffect(() => {
      if (!organizationId || organizationId === "") return;   
    fetchLockers();
  }, [organizationId, page, rows, showSchedules]);


 const fetchLockers = async () => {
      try {
        setLoading(true);
        console.log("Fetching lockers for organization:", organizationId);
        const data = await getLockers(page + 1, rows, organizationId, showSchedules);
        setLockers(data.data.items);
        setTotalRecords(data.data.total);
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

useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  window.addEventListener("keydown", handleEsc);
  return () => {
    window.removeEventListener("keydown", handleEsc);
  };
}, []);

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
      
      <div className="flex-1 ml-[3.6rem]  w-full">
        <Toolbar
          title="Lockers"
          showOrganizationSelect={true}
          onChangeOrganization={(id) => {
            setOrganizationId(id);
            setPage(0);
          }}
        />
        <Toast ref={toast} />
          <ConfirmDialog 
          style={{ width: '30vw', background: '#2e2d2d' }}
          contentStyle={{ background: '#2e2d2d', color: 'white' }}
          headerStyle={{ background: '#2e2d2d', color: 'white' }}
          />
        <div className="mt-6 bg-[#252525] rounded-xl p-6 overflow-x-auto ml-6 mr-2">
          <div className="flex justify-between items-center mb-4">
          <div className="flex justify-between items-center mb-4">
  <Paginator
    first={page * rows}
    rows={rows}
    totalRecords={totalRecords}
    rowsPerPageOptions={[5, 10, 50]}
    onPageChange={(e) => {
      setPage(e.page);
      setRows(e.rows);
    }}
    className="bg-[#252525] text-white border-none text-sm px-[0px] py-[0px]"
    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} lockers"
  />

</div>


            <div className="flex items-center gap-2 text-lg font-semibold">
              Add Locker
              <img
                src="/images/Plus.svg"
                alt="Add Locker"
                className="w-7 h-7 cursor-pointer"
                onClick={() => {
      
                setIsEditMode(false);
                setSelectedLockerToUpdate(null);
                setSerialNumber("");
                setSelectedAreaId(null);
                setAddSchedule(false);
                setStartTime("");
                setEndTime("");
                setScheduleDate("");
                setRepeatSchedule(false);

                const orgId = getEncryptedCookie("s_12be90dd");
                const orgsRaw = getEncryptedCookie("o_ae3d8f2b");

                if (orgId && orgsRaw) {
                const orgs = JSON.parse(orgsRaw);
                const currentOrg = orgs.find((o: any) => o.id.toString() === orgId);
                if (currentOrg?.areas) {
                  setUpdateAreas(currentOrg.areas);
                }
                }

                setShowModal(true);
                }}
              />
            </div>
          </div>

          {loading && <Loader />}


          <div className="flex flex-col md:flex-row gap-6">
            {/* Lockers list */}
            <div className="flex-1 space-y-4">
              {lockers.map((locker) => (
                <div
                    key={locker.locker_id}
                    className="border border-[#959595] rounded-xl p-4 bg-[#222] shadow cursor-pointer hover:brightness-110 transition"
                    onClick={() => {
                        setSelectedLocker(locker);
                        fetchCompartments(locker.locker_id);
                    }}
                    >
                    <h3 className="text-xl font-bold">{locker.locker_serial_number}</h3>
                    {/* <p className="text-sm text-gray-300">Organization: {locker.organization_name}</p> */}
                    <p className="text-sm text-gray-300">Area: {locker.area_name}</p>
                    
                    {locker.schedules && locker.schedules.length > 0 && (
                      <div className="">
                      <h4 className="text-sm font-semibold text-white">Schedules:</h4>
                      <ul className="text-sm text-gray-300 list-disc ml-4 mb-3">
                      {locker.schedules
                      ?.filter(
                        (schedule) => schedule.day_of_week || schedule.schedule_date
                      )
                      
                      .map((schedule, index) => (
                      <li key={index}>
                        {schedule.day_of_week
                        ? `${schedule.day_of_week.toUpperCase()}: ${schedule.start_time} - ${schedule.end_time}`
                        : `Date: ${new Date(schedule.schedule_date!).toLocaleDateString()} - ${schedule.start_time} - ${schedule.end_time}`}
                      <button
                      onClick={() => {
                        setIsEditMode(true);
                        setSelectedLockerToUpdate(locker);
                        setSerialNumber(locker.locker_serial_number.toString());
                        setSelectedAreaId(locker.area_id);
                        setAddSchedule(true);
                        setIsEditMode(false);

                        setSchedules([
                          {
                            startTime: schedule.start_time.slice(0, 5),
                            endTime: schedule.end_time.slice(0, 5),
                            dayOfWeek: typeof schedule.day_of_week === "string"
                            ? ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(schedule.day_of_week)
                            : -1, 
                            scheduleDate: schedule.schedule_date ?? "",
                            repeatSchedule: schedule.repeat_schedule,
                          },
                        ]);

                        setScheduleBeingEdited({
                          lockerId: locker.locker_id,
                          scheduleId: schedule.schedule_id,
                        });

                        setShowModal(true);
                      }}
                     className="ml-2 p-1 rounded-full  text-white hover:brightness-110 hover:bg-[#555555] transition"
                    >
                       ✎
                    </button>


                        <button
                        onClick={async (e) => {
                          e.stopPropagation();
                           confirmDialog({
                            message: "Are you sure you want to delete this schedule?",
                            header: "Confirm Deletion",
                            icon: "pi pi-exclamation-triangle",
                             acceptLabel: "✅ Yes",
                              rejectLabel: "❌ No",
                              acceptClassName: "p-button-danger",
                              rejectClassName: "p-button-secondary mr-3",
                            accept: async () => {
                          try {
                            await deleteSchedule(locker.locker_id, schedule.schedule_id, deleteAllSchedules );
                            toast.current?.show({
                              severity: "success",
                              summary: "Schedule Deleted",
                              detail: "Schedule deleted successfully",
                              life: 3000,
                            });
                            fetchLockers();
                          } catch (err) {
                            console.error("Error deleting schedule:", err);
                            toast.current?.show({
                              severity: "error",
                              summary: "Error",
                              detail: "Could not delete schedule.",
                            });
                          }
                        },
                          });
                        }}
                          className="ml-1 mt-1 px-1 py-1 text-sm text-white rounded-full font-semibold hover:brightness-90 hover:bg-[#FFD166] transition"
                        >
                          <FontAwesomeIcon icon="trash" />

                        </button>
                    
                                      
                      </li>
                      ))}
                      </ul>
                      </div>
                      )}

                    <div className="flex justify-end">
                        <button className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition" 
                        onClick={() => {
                            setSelectedLockerToUpdate(locker);
                            setSerialNumber(locker.locker_serial_number.toString()); 
                            setSelectedAreaId(locker.area_id);
                            const orgId = getEncryptedCookie("s_12be90dd");
                            const orgsRaw = getEncryptedCookie("o_ae3d8f2b");

                            if (orgId && orgsRaw) {
                              const orgs = JSON.parse(orgsRaw);
                              const currentOrg = orgs.find((o: any) => o.id.toString() === orgId);
                              if (currentOrg?.areas) {
                                setUpdateAreas(currentOrg.areas);
                              }
                            }
                            setIsEditMode(true);
                            setAddSchedule(false);
                            setSchedules([
                              {
                                startTime: "",
                                endTime: "",
                                dayOfWeek: -1,
                                scheduleDate: "",
                                repeatSchedule: false,
                              },
                            ]);
                            setScheduleBeingEdited(null);
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
                        key={compartment.compartment_id}
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
  onClick={async () => {
    if (compartment.status.toLowerCase() === "closed") {
      try {
        const user = getEncryptedCookie("u_7f2a1e3c");
        const userId = user ? JSON.parse(user).id : null;
        if (!userId) {
          toast.current?.show({
            severity: "warn",
            summary: "User ID missing",
            detail: "No user linked to this compartment",
            life: 3000,
          });
          return;
        }
         const isElectron = typeof window !== "undefined" && window.navigator.userAgent.includes("Electron");
        if (isElectron && window.electronAPI?.publishToggleCommand) {
        console.log(selectedLocker!.locker_serial_number, userId, compartment.id, compartment.compartment_number);
        window.electronAPI?.publishToggleCommand(
              selectedLocker!.locker_serial_number,
              userId,
              compartment.id
            );

        await fetchCompartments(selectedLocker!.locker_id);
        toast.current?.show({
          severity: "success",
          summary: "Compartment Opened",
          detail: `Compartment ${compartment.compartment_number} opened successfully`,
          life: 3000,
        });
        }
       
      } catch (err) {
        console.error("Error toggling compartment:", err);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to open compartment",
        });
      }
    }
  }}
  className={`
    text-xs font-bold px-3 py-1 rounded-full cursor-pointer
    ${
      compartment.status.toLowerCase() === "open"
        ? "bg-[#41b883] text-white"
        : "bg-gray-500 text-white hover:bg-gray-400"
    }
  `}
  title={compartment.status.toLowerCase() === "closed" ? "Click to open" : ""}
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







        {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#252525] rounded-xl p-6 text-white w-[400px] max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">
  {scheduleBeingEdited ? "Edit Schedule" : isEditMode ? "Update Locker" : "Add Locker"}
</h2>


      <div className="mb-2">
        <label className="block text-sm mb-1">Serial Number</label>
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          className="w-full bg-[#444] p-2 border rounded mb-2"
          readOnly={isEditMode}
          disabled={isEditMode}
        />
      </div>

      {!scheduleBeingEdited && (
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
)}


      {!scheduleBeingEdited && (
  <div className="flex items-center mb-4">
    <input
      type="checkbox"
      checked={addSchedule}
      onChange={(e) => setAddSchedule(e.target.checked)}
      className="mr-2 accent-[#FFD166]"
    />
    <label className="text-sm">Add Schedule</label>
  </div>
)}


      {addSchedule &&
        schedules.map((s, index) => (
          <div key={index} className="border border-[#444] rounded-lg p-3 mb-3 bg-[#333] relative">
            {schedules.length > 1 && (
      <button
        type="button"
        onClick={() => removeSchedule(index)}
        className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm"
        title="Remove schedule"
      >
        ✕
      </button>
    )}

            <div className="mb-2">
              <label className="block text-sm mb-1">Start Time</label>
              <input
                type="time"
                value={s.startTime}
                onChange={(e) =>
                  updateSchedule(index, { ...s, startTime: e.target.value })
                }
                className="w-full bg-[#444] p-2 border rounded"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm mb-1">End Time</label>
              <input
                type="time"
                value={s.endTime}
                onChange={(e) =>
                  updateSchedule(index, { ...s, endTime: e.target.value })
                }
                className="w-full bg-[#444] p-2 border rounded"
              />
            </div>
              
            {!s.repeatSchedule && (
              <div className="mb-2">
                <label className="block text-sm mb-1">Schedule Date</label>
               <input
                type="date"
                value={s.scheduleDate ? s.scheduleDate.slice(0, 10) : ""}
                onChange={(e) =>
                  updateSchedule(index, {
                    ...s,
                    scheduleDate: e.target.value,
                  })
                }
                className="w-full bg-[#444] p-2 border rounded"
              />

              </div>
            )}



   {Boolean(s.repeatSchedule) && (
              <div className="mb-2">
                <label className="block text-sm mb-1">Day of Week</label>
                <select
                    value={s.dayOfWeek >= 0 ? s.dayOfWeek : ""}
                    onChange={(e) =>
                    updateSchedule(index, {
                    ...s,
                    dayOfWeek: e.target.value === "" ? -1 : Number(e.target.value),
                    })
                    }
                    className="w-full bg-[#444] p-2 border rounded"
                    >
                    <option value="">Select day</option>
                    <option value={0}>Sunday</option>
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                    </select></div>)}
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={s.repeatSchedule}
                onChange={(e) =>
                  
                  updateSchedule(index, {
                    ...s,
                    
                    repeatSchedule: e.target.checked,
                  })
                 
                }
                className="mr-2 accent-[#FFD166]"
                
              />
              
              <label>Repeat Schedule</label>
            </div>
          </div>
        ))}

      {addSchedule && !scheduleBeingEdited && (
        <button
          type="button"
          onClick={() =>
            setSchedules([
              ...schedules,
              {
                startTime: "",
                endTime: "",
                dayOfWeek: -1,
                scheduleDate: "",
                repeatSchedule: false,
              },
            ])
          }
          className="text-sm text-yellow-400 mb-4 hover:underline"
        >
          + Add another schedule
        </button>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <button
          className="px-4 py-2 text-black bg-gray-300 rounded"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-black bg-[#FFD166] rounded"
          onClick={async () => {
            try {
              if (isEditMode && !selectedLockerToUpdate) return;

              if (addSchedule) {
                for (const s of schedules) {
                  if (!s.startTime || !s.endTime) {
                    toast.current?.show({
                      severity: "warn",
                      summary: "Validation Error",
                      detail: "Each schedule must have start and end time",
                      life: 3000,
                    });
                    return;
                  }

                  const start = parseInt(s.startTime.replace(":", ""));
                  const end = parseInt(s.endTime.replace(":", ""));

                  if (start >= end) {
                    toast.current?.show({
                      severity: "warn",
                      summary: "Validation Error",
                      detail: "Start time must be before end time",
                      life: 3000,
                    });
                    return;
                  }

                  if (!s.repeatSchedule && !s.scheduleDate) {
                    toast.current?.show({
                      severity: "warn",
                      summary: "Validation Error",
                      detail:
                        "Provide schedule date or mark as repeat for each schedule",
                      life: 3000,
                    });
                    return;
                  }
                }
              }


            if (scheduleBeingEdited) {
              const s = schedules[0]; 

              const payload = {
                 day_of_week: s.repeatSchedule && s.dayOfWeek >= 0
                  ? ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][s.dayOfWeek]
                  : null,
                start_time: `${s.startTime}:00`,
                end_time: `${s.endTime}:00`,
                repeat_schedule: s.repeatSchedule,
                schedule_date: s.repeatSchedule ? null : s.scheduleDate || null,

              };

              await putSchedule(scheduleBeingEdited.lockerId, scheduleBeingEdited.scheduleId, payload);

              toast.current?.show({
                severity: "success",
                summary: "Schedule Updated",
                detail: "Schedule updated successfully",
                life: 3000,
              });

              setShowModal(false);
              setScheduleBeingEdited(null);
              fetchLockers();
              return;
            }

                          const payload: any = {
                            organization_id: isEditMode
                              ? Number(selectedLockerToUpdate!.organization_id)
                              : Number(organizationId),
                            area_id: Number(selectedAreaId),
                            serial_number: serialNumber,
                          };

                          if (addSchedule) {
                            payload.new_schedule = schedules.map((s) => ({
                              day_of_week: s.repeatSchedule
                                ? [
                                    "sun",
                                    "mon",
                                    "tue",
                                    "wed",
                                    "thu",
                                    "fri",
                                    "sat",
                                  ][s.dayOfWeek]
                                : null,
                              start_time: `${s.startTime}:00`,
                              end_time: `${s.endTime}:00`,
                              repeat_schedule: Boolean(s.repeatSchedule),
                              schedule_date: s.repeatSchedule ? null : s.scheduleDate || null,
                            })
                          );
                          }
                          const response = await putlocker(payload);
                          console.log("Locker updated:", response);
                          fetchLockers();

                          toast.current?.show({
                            severity: "success",
                            summary: "Locker Updated",
                            detail: "Locker updated successfully",
                            life: 3000,
                          });

                          setShowModal(false);
                          setSerialNumber("");
                          setSelectedAreaId(null);
                          setScheduleBeingEdited(null);
                          setAddSchedule(false);
                          setSchedules([
                            {
                              startTime: "",
                              endTime: "",
                              dayOfWeek: -1,
                              scheduleDate: "",
                              repeatSchedule: false,
                            },
                            

                          ]);
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
                      {isEditMode ? "Save" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            )}


      </div>
    </div>
  );
}