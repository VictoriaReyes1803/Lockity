import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
import { activities, noschedule } from "../services/logsService"; 
import Loader from "../components/Loader";

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

export default function Dashboard() {
		const [organizationId, setOrganizationId] = useState<string>("");
		const [page, setPage] = useState(0); 
		const toast = useRef<Toast>(null);
		const [lockers, setLockers] = useState<any[]>([]);	
		const [totalLockers, setTotalLockers] = useState(0);
		const[limitlockers, setLimitLockers] = useState(10);
		const [attempts, setAttempts] = useState<any[]>([]);
const [totalAttempts, setTotalAttempts] = useState(0);
const [limit, setLimit] = useState(10);
const [loading, setLoading] = useState(false);

const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await activities(page, limit); 
      setAttempts(res.data.items || []); 
      setTotalAttempts(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching activities", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch activity logs",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fectchnoschendule = async () => {
	try {
		setLoading(true);
		const res = await noschedule(page, limit); 
		setLockers(res.data.items || []); 
		setTotalLockers(res.data.total || 0);
		setLimitLockers(res.data.limit || 10);
	}
	catch (err) {
		console.error("Error fetching noschedule", err);
		toast.current?.show({
			severity: "error",
			summary: "Error",
			detail: "Failed to fetch noschedule data",
			life: 3000,
		});
	} finally {
		setLoading(false);
	}
  };

useEffect(() => {
  
  fetchActivities();

}, [page, limit]);

useEffect(() => {
  fectchnoschendule();
}, [totalLockers, limitlockers]);



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
		<div className="bg-[#2E2D2D] min-h-screen w-full text-black p-8 font-['Roboto']">
			<div className="flex flex-col md:flex-row gap-6 mb-8">
				<div className="bg-white rounded-xl p-4 flex-1 min-w-[400px]">
					<div className="flex items-center mb-4">
						<span className="font-semibold text-lg text-black">
							Locker without assigned dates
						</span>
					</div>
					<div className="flex gap-4 overflow-x-auto pb-2">
						{lockers.map((locker, idx) => (
							<div
								key={idx}
								className="bg-[#eaeaea] text-black rounded-lg p-4 min-w-[220px] shadow"
							>
								<div className="font-semibold">Locker: {locker.locker_id}</div>
								<div className="text-sm">Serial: {locker.serial_number}</div>
								<div className="text-sm">Area: {locker.area}</div>
								<div className="text-sm">
									Organization: {locker.organization}
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="bg-white rounded-xl p-4 flex-1 min-w-[300px]">
					<div className="font-semibold mb-2 text-sm text-black">
						Movements by UTT in 2024
					</div>
					<ResponsiveContainer width="100%" height={150}>
						<BarChart data={chartData}>
							<XAxis dataKey="name" stroke="#000" fontSize={12} />
							<YAxis stroke="#000" fontSize={12} />
							<Tooltip wrapperClassName="!bg-[#000000] !text-white" />
							<Bar
								dataKey="value"
								fill="#FFD166"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="font-semibold text-lg mb-4 text-white">Last attempts</div>

			<div className="flex bg-[#444444] text-white font-semibold rounded-xl mb-4">
				<div className="py-2 px-3 w-1/5">User</div>
				<div className="py-2 px-3 w-1/5">Lockers</div>
				<div className="py-2 px-3 w-1/5">Compartments</div>
				<div className="py-2 px-3 w-1/5">Date</div>
				<div className="py-2 px-3 w-1/5 flex items-center gap-1">
					State
				</div>
			</div>

			<div className="bg-white rounded-xl p-4">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-black">
						<tbody>
							{attempts.length === 0 ? (
    <tr>
      <td colSpan={5} className="text-center py-4 text-gray-500">
        No attempts found
      </td>
    </tr>
  ) : (
						attempts.map((a, idx) => (
  <tr key={idx} className="border-b border-[#eaeaea]">
    <td className="py-2 px-3 w-1/5">
      <div className="font-semibold">{a.performerName}</div>
      <div className="text-xs text-gray-500">{a.performerRole}</div>
    </td>
    <td className="py-2 px-3 w-1/5">{a.lockerId}</td>
    <td className="py-2 px-3 w-1/5">{a.compartmentId || a.compartment}</td>
    <td className="py-2 px-3 w-1/5">
      <div>{a.date}</div>
      <div className="text-xs text-gray-500">{a.time}</div>
    </td>
    <td className="py-2 px-3 w-1/5">
      <span
        className={`font-semibold text-sm flex items-center gap-1 ${
          a.status === "Open" ? "text-red-500" : "text-[#FFD166]"
        }`}
      >
        {a.status}
      </span>
    </td>
  </tr>
))
)}

						</tbody>
					</table>
				</div>
					{attempts.length > 0 ? (
				<div className="flex items-center justify-end mt-4 gap-2 text-gray-700">
					<button onClick={() => setPage(0)}>&lt;&lt;</button>
<button onClick={() => setPage(Math.max(0, page - 1))}>&lt;</button>
<span className="px-3 py-1 rounded bg-[#FFD166] text-black font-semibold">
  {page + 1}
</span>
<button onClick={() => setPage(page + 1)}>&gt;</button>
<button onClick={() => setPage(Math.ceil(totalAttempts / limit) - 1)}>&gt;&gt;</button>

<select
  value={limit}
  onChange={(e) => {
    setLimit(Number(e.target.value));
    setPage(0); 
  }}
  className="ml-4 bg-white border border-[#eaeaea] rounded px-2 py-1 text-black"
>
  <option value={10}>10</option>
  <option value={20}>20</option>
  <option value={50}>50</option>
</select>

				</div>
					) : null}
			</div>
		</div>
		</div>
		  {loading && <Loader />  }
	  </div>
	
	);
}
