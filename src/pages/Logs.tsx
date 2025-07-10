
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

 export default function Logs() {


    const [selectedOrg, setSelectedOrg] = useState("UTT");
  const [selectedArea, setSelectedArea] = useState("Classroom 3");
  const [selectedLocker, setSelectedLocker] = useState("ASGDF2");
  const [selectedCompartment, setSelectedCompartment] = useState("22");

  const logData = [
    { user: "Vicky", locker: "3333", description: "Lorem ipsum dolor sit amet...", time: "10/9/25 4:00 am", target: "Alonso" },
    { user: "Marco", locker: "22222", description: "Lorem ipsum dolor sit amet...", time: "10/9/25 4:00 am", target: "Arturo" },
    { user: "Alonso", locker: "55555", description: "Lorem ipsum dolor sit amet...", time: "10/9/25 4:00 am", target: "Bocher" },
  ];

  const historyData = [
    { user: "Vicky", source: "Movil", action: "Opening", time: "10/9/25 4:00 am" },
    { user: "Marco", source: "Desktop", action: "Closing", time: "10/9/25 4:00 am" },
    { user: "Alonso", source: "Movil", action: "Closing", time: "10/9/25 4:00 am" },
  ];


 return (
    <div className="flex h-screen bg-[#2e2d2d] text-white font-sans">
      
      <div className="flex-1 ml-[3.6rem]  w-full">
        <Toolbar
          title="Logs"
        />



        <div className="min-h-screen bg-[#2e2d2d] text-white font-sans p-6 space-y-6">
      <div className="flex flex-wrap gap-6">
        {/* Selects */}
        <div className="space-y-1">
          <label className="block font-semibold">Organization</label>
          <select
            className="bg-[#3b3b3b] rounded px-4 py-1"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
          >
            <option>UTT</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-semibold">Area</label>
          <select
            className="bg-[#3b3b3b] rounded px-4 py-1"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option>Classroom 3</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-semibold">Locker</label>
          <select
            className="bg-[#3b3b3b] rounded px-4 py-1"
            value={selectedLocker}
            onChange={(e) => setSelectedLocker(e.target.value)}
          >
            <option>ASGDF2</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-semibold">Compartments</label>
          <select
            className="bg-[#3b3b3b] rounded px-4 py-1"
            value={selectedCompartment}
            onChange={(e) => setSelectedCompartment(e.target.value)}
          >
            <option>22</option>
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
