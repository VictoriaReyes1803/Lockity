
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { use, useState } from "react";

import { Paginator } from "primereact/paginator";
import type { Area } from "../models/organization";
import { getAreas } from "../services/organizationsService";
import { getlockersforArea, getCompartments } from "../services/lockersService";
import { useEffect } from "react";
import type { User } from "../models/User";
import type { Locker } from "../models/locker";
import { accesslogs, auditLogs } from "../services/logsService"; 
import { supabase } from "../lib/supabaseClient";

 export default function Logs() {
const [areas, setAreas] = useState<Area[]>([]); 
const [lockers, setLockers] = useState<Locker[]>([]);
const [compartments, setCompartments] = useState<any[]>([]); 
const [filterEmail, setFilterEmail] = useState("");
const [filterAction, setFilterAction] = useState("");
const [filterDateFrom, setFilterDateFrom] = useState("");
const [filterDateTo, setFilterDateTo] = useState("");

const [history, setHistory] = useState<any[]>([]);
const [organizationId, setOrganizationId] = useState<string>("");
    const [page, setPage] = useState(0); 
    const [selectedOrg, setSelectedOrg] = useState("UTT");
  const [selectedArea, setSelectedArea] = useState("Classroom 3");
  const [selectedLocker, setSelectedLocker] = useState("SN-2025-0745-AX93-PLQ7");
  const [selectedCompartment, setSelectedCompartment] = useState("22");
const [logs, setLogs] = useState<any[]>([]);
const [totalRecords, setTotalRecords] = useState(0);
const [totalRecordsAudit, setTotalRecordsAudit] = useState(0);
const [auditLogsData, setAuditLogsData] = useState<any[]>([]);
const [rows, setRows] = useState(10); 
const [imageUrl, setImageUrl] = useState<string | null>(null);
const [showImageModal, setShowImageModal] = useState(false);

const [rowsaudit, setRowsAudit] = useState(5);
const [pageAudit, setPageAudit] = useState(0);


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
      console.log("Lockers for area fetched:", lockerRes.data);
      const lockerItems = lockerRes.data.items;
      console.log("Lockers fetched:", lockerItems);
      setLockers(lockerItems);
      
      

      const areaLockers: Locker[] = lockerItems.filter((l: Locker) => l.area_id === firstArea.id);
      const firstLocker = areaLockers[0];
      setSelectedLocker(firstLocker?.locker_serial_number);
      
      // fetchLogs();

      const comps = await getCompartments(firstLocker.locker_id);
      setCompartments(comps.data.items || []);
      console.log("Compartments fetched:", comps.data.items);
      setSelectedCompartment(comps.data.items[0]?.compartment_number?.toString() || "");

    
      // setLogs(data.data.items || []);
      // setAuditLogsData(dataAudit.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchAreasAndLockers();
}, [organizationId]);



const accessLogsM = async () => {
  if (!selectedLocker || !selectedCompartment) return;
  const data = await accesslogs(
    selectedLocker,
    page + 1,
    rows,
    selectedCompartment ? parseInt(selectedCompartment) : undefined,
    filterEmail || undefined,
    filterAction || undefined,
    filterDateFrom || undefined,
    filterDateTo || undefined
  );
   setLogs(data.data.items || []);
  setTotalRecords(data.data.total || 0);
 
};


const fetchLogs = async () => {
  if (!selectedLocker || !selectedCompartment) return;
 const dataAudit = await auditLogs(
    pageAudit + 1,
    rowsaudit,
    selectedLocker,
    filterEmail || undefined,
    filterDateFrom || undefined,
    filterDateTo || undefined
  );
    accessLogsM();
 
   setAuditLogsData(dataAudit.data.items || []);
    setTotalRecordsAudit(dataAudit.data.total || 0);

 
};


const generateSignedUrl = async (path: string) => {
  const { data, error } = await supabase.storage
    .from("lockity-images")
    .createSignedUrl(path, 60 * 2); 

  if (error) {
    console.error("Error generating signed URL:", error.message);
    return;
  }

  setImageUrl(data.signedUrl);
  setShowImageModal(true);
};


useEffect(() => {
  fetchLogs();
}, [selectedLocker, selectedCompartment, page, rows, filterDateFrom,filterDateTo]);

useEffect(() => {
  accessLogsM();
},[filterAction]);


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
<div className="flex flex-wrap gap-4">
 
  <div>
    <label className="block text-sm font-semibold">Action</label>
 
    <select
      className="bg-[#3b3b3b] rounded px-2 py-1"
      value={filterAction}
      onChange={(e) => setFilterAction(e.target.value)}
    >
      <option value="">All Actions</option>
      <option value="opening">Opening</option>
      <option value="closing">Closing</option>
      <option value="failed_attempt">Failed Attempt</option>
      </select>

  </div>
  <div>
    <label className="block text-sm font-semibold">From</label>
    <input
      type="date"
      className="bg-[#3b3b3b] rounded px-2 py-1"
      value={filterDateFrom}
      onChange={(e) => setFilterDateFrom(e.target.value)}
    />
  </div>
  <div>
    <label className="block text-sm font-semibold">To</label>
    <input
      type="date"
      className="bg-[#3b3b3b] rounded px-2 py-1"
      value={filterDateTo}
      onChange={(e) => setFilterDateTo(e.target.value)}
    />
  </div>
   <div>
    <label className="block text-sm font-semibold">Email</label>
    <input
      type="text"
      className="bg-[#3b3b3b] rounded px-2 py-1"
      value={filterEmail}
      onChange={(e) => setFilterEmail(e.target.value)}
      placeholder="example@email.com"
    />
  </div>
  <div className="flex items-end">
    <button
      className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition"
      onClick={() => {
        setPage(0);
        setPageAudit(0);
        fetchLogs();
      }}
    >
      Apply Filters
    </button>
  </div>
</div>


      </div>

      {/* Log Table */}
      <div className="flex gap-6 flex-wrap">
        <div className="bg-[#1f1f1f] rounded-xl p-4 flex-1 shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-2">Performed by</th>
                
                <th>Description</th>
                <th>Time</th>
                <th>Target user</th>
              </tr>
            </thead>
            <tbody>
              {auditLogsData.map((log, id) => (
                <tr key={id} className="border-b border-gray-700">
                  <td className="py-2">{log.performed_by.full_name}</td>
                 
                  <td>{log.description}</td>
                 <td>{new Date(log.timestamp).toLocaleString("es-MX", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}</td>

                  <td>{log.target_user.full_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
             <Paginator
  first={pageAudit * rowsaudit}
  rows={rowsaudit}
  totalRecords={totalRecordsAudit}
  rowsPerPageOptions={[5, 10, 50]}
  onPageChange={(e) => {
    setPageAudit(e.page);
    setRowsAudit(e.rows);
    setRows(e.rows);
  }}
  className="bg-[#252525] text-white border-none text-sm px-[0px] py-[0px]"
  template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} logs"
/>

        </div>

        {/* access logs Table */}
        <div className="bg-[#1f1f1f] rounded-xl p-4 flex-1 shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th>User</th>
                <th>Email</th>
                <th>User role</th>
                <th>Source</th>
            
                <th>Action</th>
                <th>Time</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-700">
                  <td className="py-2">{row.performed_by.full_name}</td>
                  <td>{row.performed_by.email}</td>
                  <td className="py-2 px-2">{row.performed_by.role}</td>
          
                  <td>{row.source}</td>
                  <td>{row.action}</td>
                  <td>{new Date(row.timestamp).toLocaleString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  })}</td>

                <td>
                <button
                  className="bg-[#3b3b3b] p-2 rounded-full"
                  onClick={() => generateSignedUrl(row.photo_path)}
                >
                  <i className="pi pi-camera text-white" />
                </button>
              </td>

                </tr>
              ))}
            </tbody>
          </table>
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
  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} logs"
/>

        </div>
      </div>
    </div>

      

</div>

{showImageModal && imageUrl && (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
    <div className="bg-[#1f1f1f] p-4 rounded-lg shadow-lg">
      <img src={imageUrl} alt="Captured" className="max-w-[80vw] max-h-[80vh]" />
      <div className="flex justify-end mt-4">
        <button
          className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold"
          onClick={() => setShowImageModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

</div>
  );
}
