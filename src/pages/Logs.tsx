
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Area } from "../models/organization";
import { getAreas } from "../services/organizationsService";
import { getlockersforArea, getCompartments } from "../services/lockersService";
import { useEffect } from "react";
import type { User } from "../models/User";
import type { Locker } from "../models/locker";


 export default function Logs() {
const [areas, setAreas] = useState<Area[]>([]); 
const [lockers, setLockers] = useState<Locker[]>([]);
const [compartments, setCompartments] = useState<any[]>([]); 
const [logs, setLogs] = useState<any[]>([]);
const [history, setHistory] = useState<any[]>([]);
const [organizationId, setOrganizationId] = useState<string>("");
    const [page, setPage] = useState(0); 
    const [selectedOrg, setSelectedOrg] = useState("UTT");
  const [selectedArea, setSelectedArea] = useState("Classroom 3");
  const [selectedLocker, setSelectedLocker] = useState("ASGDF2");
  const [selectedCompartment, setSelectedCompartment] = useState("22");
// Cargar logs
       const logData = [
    { user: "Vicky", locker: "3333", description: "Lorem ipsum dolor sit amet...", time: "10/9/25 4:00 am", target: "Alonso" },
    { user: "Marco", locker: "22222", description: "Lorem ipsum dolor sit amet...", time: "10/9/25 4:00 am", target: "Arturo" },
    { user: "Alonso", locker: "55555", description: "Lorem ipsum dolor sit amet...", time: "10/9/25 4:00 am", target: "Bocher" },
  ];
const historyData = [
    { user: "Vicky", source: "Locker 3333", action: "Opened compartment 1", time: "10/9/25 4:00 am", photo: "https://example.com/photo1.jpg" },
    { user: "Marco", source: "Locker 22222", action: "Closed compartment 2", time: "10/9/25 4:00 am", photo: "https://example.com/photo2.jpg" },
    { user: "Alonso", source: "Locker 55555", action: "Opened compartment 3", time: "10/9/25 4:00 am", photo: "https://example.com/photo3.jpg" },
  ];

  useEffect(() => {
  if (!organizationId) return;

  const fetchAreasAndLockers = async () => {
    try {
      const areaRes = await getAreas(organizationId);
      const allAreas = areaRes.data.items;
      setAreas(allAreas);
      console.log("Areas fetched:", allAreas);
      const firstArea = allAreas[0];
      setSelectedArea(firstArea.id.toString());

      const lockerRes = await getlockersforArea( firstArea.id);
      const lockerItems = lockerRes.data.items;
      console.log("Lockers fetched:", lockerItems);
      setLockers(lockerItems);
      
      

      const areaLockers: Locker[] = lockerItems.filter((l: Locker) => l.area_id === firstArea.id);
      const firstLocker = areaLockers[0];
      setSelectedLocker(firstLocker?.locker_serial_number);

      const comps = await getCompartments(firstLocker.locker_id);
      setCompartments(comps.data.items || []);
      console.log("Compartments fetched:", comps.data.items);
      setSelectedCompartment(comps.data.items[0]?.compartment_number?.toString() || "");

      
      setLogs(logData);
      setHistory(logData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchAreasAndLockers();
}, [organizationId]);

 return (
    <div className="flex h-screen bg-[#2e2d2d] text-white font-sans">
      
      <div className="flex-1 ml-[3.6rem]  w-full">
      

 <Toolbar
          title="Logging"
          showOrganizationSelect={true}
          onChangeOrganization={(id) => {
            setOrganizationId(id);
            setPage(0);
          }}
        />

        <div className="min-h-screen bg-[#2e2d2d] text-white font-sans p-6 space-y-6">
      <div className="flex flex-wrap gap-6">
        {/* Selects */}
        

        <div className="space-y-1">
          <label className="block font-semibold">Area</label>
<select
  className="bg-[#3b3b3b] rounded px-4 py-1"
  value={selectedArea}
  onChange={async (e) => {
    const areaId = parseInt(e.target.value);
    setSelectedArea(areaId.toString());

    const lockerRes = await getlockersforArea(areaId);
    const filteredLockers = lockerRes.data.items || [];
    setLockers(filteredLockers);
    setSelectedLocker(filteredLockers[0]?.locker_serial_number || "");
    const compartmentsRes = await getCompartments(filteredLockers[0]?.locker_id || 0);
    setCompartments(compartmentsRes.data.items || []);
    setSelectedCompartment(compartmentsRes.data.items[0]?.compartment_number?.toString() || "");
  }}
>
  {areas.map((area) => (
    <option key={area.id} value={area.id}>
      {area.name}
    </option>
  ))}
</select>

        </div>

        <div className="space-y-1">
          <label className="block font-semibold">Locker</label>
          <select
  className="bg-[#3b3b3b] rounded px-4 py-1"
  value={selectedLocker}
  onChange={async (e) => {
    const lockerId = e.target.value;
    setSelectedLocker(lockerId);
    const selected = lockers.find(l => l.locker_serial_number === lockerId);
    const compartmentsRes = await getCompartments(selected?.locker_id || 0);
    const compartments = compartmentsRes.data.items || [];
    setCompartments(compartments);
    setSelectedCompartment(compartments[0]?.compartment_number?.toString() || "");
  }}
>
  {lockers
    .filter(l => l.area_id.toString() === selectedArea)
    .map((locker) => (
      <option key={locker.locker_serial_number} value={locker.locker_serial_number}>
        {locker.locker_serial_number}
      </option>
  ))}
</select>

        </div>

      <div className="space-y-1">
  <label className="block font-semibold">Compartments</label>
  <select
    className="bg-[#3b3b3b] rounded px-4 py-1"
    value={selectedCompartment}
    onChange={(e) => setSelectedCompartment(e.target.value)}
  >
    {compartments.map((c) => {
      const visibleUsers = c.users?.filter((u: any) => u.role !== "super_admin" && u.role !== "admin") || [];


      const userNames = visibleUsers.map((u: any) => u.name);

      return (
        <option key={c.compartment_id} value={c.compartment_number}>
          {c.compartment_number} -{" "}
          {userNames.length > 0 ? userNames.join(", ") : "No users"}
        </option>
      );
    })}
  </select>
</div>

      </div>

      {/* Log Table */}
      <div className="flex gap-6 flex-wrap">
        <div className="bg-[#1f1f1f] rounded-xl p-4 flex-1 shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-2">Performed by</th>
                <th>Locker</th>
                <th>Description</th>
                <th>Time</th>
                <th>Target user</th>
              </tr>
            </thead>
            <tbody>
              {logData.map((log, idx) => (
                <tr key={idx} className="border-b border-gray-700">
                  <td className="py-2">{log.user}</td>
                  <td>{log.locker}</td>
                  <td>{log.description}</td>
                  <td>{log.time}</td>
                  <td>{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs text-right mt-2 text-gray-400">Page 3 / 5</div>
        </div>

        {/* History Table */}
        <div className="bg-[#1f1f1f] rounded-xl p-4 flex-1 shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th>User</th>
                <th>Source</th>
                <th>Action</th>
                <th>Time</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-700">
                  <td className="py-2">{row.user}</td>
                  <td>{row.source}</td>
                  <td>{row.action}</td>
                  <td>{row.time}</td>
                  <td>
                    <button className="bg-[#3b3b3b] p-2 rounded-full">
                      <i className="pi pi-camera text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs text-right mt-2 text-gray-400">Page 3 / 5</div>
        </div>
      </div>
    </div>

      

</div>
</div>
  );
}
