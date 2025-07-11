import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const lockers = [
  { id: 82829, area: "Classroom 3", organization: "UTT" },
  { id: 82829, area: "Classroom 3", organization: "UTT" },
  { id: 82829, area: "Classroom 3", organization: "UTT" },
];

const chartData = [
  { name: "Jan", value: 10000 },
  { name: "Feb", value: 20000 },
  { name: "Mar", value: 30000 },
  { name: "Apr", value: 35000 },
  { name: "May", value: 40000 },
  { name: "Jun", value: 38000 },
  { name: "Jul", value: 32000 },
  { name: "Aug", value: 39000 },
  { name: "Sep", value: 41000 },
  { name: "Oct", value: 39000 },
  { name: "Nov", value: 37000 },
  { name: "Dec", value: 35000 },
];

const attempts = [
  { user: "Alonso Fugoroa", role: "user", locker: "1", compartment: "AFGJL", date: "Today", time: "2m ago", state: "Close" },
  { user: "Vicky jaime", role: "Admin", locker: "2", compartment: "LKJHJSHJ", date: "Today", time: "5m ago", state: "Close" },
  { user: "Marco Chavis", role: "user", locker: "2", compartment: "AFGJL", date: "Today", time: "1h ago", state: "Close" },
  { user: "Titi Arturo", role: "user", locker: "3", compartment: "AFGJL", date: "Today", time: "2h ago", state: "Open" },
  { user: "Bocher Hernandez", role: "user", locker: "4", compartment: "AFGJL", date: "Yesterday", time: "09:00 AM", state: "Close" },
  { user: "Ricarno Fifi", role: "User", locker: "5", compartment: "AFGJL", date: "Yesterday", time: "08:00 AM", state: "Close" },
];

export default function Dashboard() {
  return (
    <div className="bg-[#2E2D2D] min-h-screen w-full text-white p-8 font-['Roboto']">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-[#232323] rounded-xl p-4 flex-1 min-w-[400px]">
          <div className="flex items-center mb-4">
            <span className="font-semibold text-lg text-gray-100">Locker without assigned dates</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {lockers.map((locker, idx) => (
              <div key={idx} className="bg-[#eaeaea] text-black rounded-lg p-4 min-w-[220px] shadow">
                <div className="font-semibold">Locker: {locker.id}</div>
                <div className="text-sm">Area: {locker.area}</div>
                <div className="text-sm">Organization: {locker.organization}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#232323] rounded-xl p-4 flex-1 min-w-[300px]">
          <div className="font-semibold mb-2 text-sm text-gray-100">Movements by UTT in 2024</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip wrapperClassName="!bg-[#232323] !text-white" />
              <Bar dataKey="value" fill="#FFD166" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#232323] rounded-xl p-4">
        <div className="font-semibold text-lg mb-4 text-gray-100">Last attempts</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#353535] text-gray-200">
                <th className="py-2 px-3 font-semibold">User</th>
                <th className="py-2 px-3 font-semibold">Lockers</th>
                <th className="py-2 px-3 font-semibold">Compartments</th>
                <th className="py-2 px-3 font-semibold">Date</th>
                <th className="py-2 px-3 font-semibold">State</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a, idx) => (
                <tr key={idx} className="border-b border-[#444]">
                  <td className="py-2 px-3">
                    <div className="font-semibold">{a.user}</div>
                    <div className="text-xs text-gray-400">{a.role}</div>
                  </td>
                  <td className="py-2 px-3">{a.locker}</td>
                  <td className="py-2 px-3">{a.compartment}</td>
                  <td className="py-2 px-3">
                    <div>{a.date}</div>
                    <div className="text-xs text-gray-400">{a.time}</div>
                  </td>
                  <td className="py-2 px-3">
                    <span className={`font-semibold text-sm flex items-center gap-1 ${a.state === "Open" ? "text-red-500" : "text-[#FFD166]"}`}>
                      {a.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end mt-4 gap-2 text-gray-300">
          <button className="px-2 py-1 rounded hover:bg-[#353535]">&lt;&lt;</button>
          <button className="px-2 py-1 rounded hover:bg-[#353535]">&lt;</button>
          <span className="px-3 py-1 rounded bg-[#FFD166] text-black font-semibold">1</span>
          <button className="px-2 py-1 rounded hover:bg-[#353535]">&gt;</button>
          <button className="px-2 py-1 rounded hover:bg-[#353535]">&gt;&gt;</button>
          <select className="ml-4 bg-[#232323] border border-[#353535] rounded px-2 py-1">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
