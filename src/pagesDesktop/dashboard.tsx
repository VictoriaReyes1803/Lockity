import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect, use } from "react";
import { activities, noschedule, chartmovements } from "../services/logsService"; 
import Loader from "../components/Loader";
import {groupChartData} from "../lib/helper/helperdate"; 



export default function Dashboard() {
		const [organizationId, setOrganizationId] = useState<number | null>(null);
		const [page, setPage] = useState(0); 
		const toast = useRef<Toast>(null);
		const [chartData, setChartData] = useState<any[]>([]);
		const [groupBy, setGroupBy] = useState<"day" | "week" | "month" | "year">("day");
const [dateFrom, setDateFrom] = useState("2025-07-29");
const [dateTo, setDateTo] = useState("2025-08-05");

		const [lockers, setLockers] = useState<any[]>([]);	
		const [totalLockers, setTotalLockers] = useState(0);
		const[limitlockers, setLimitLockers] = useState(10);
		const [attempts, setAttempts] = useState<any[]>([]);
const [totalAttempts, setTotalAttempts] = useState(0);
const [limit, setLimit] = useState(5);
const [statusFilter, setStatusFilter] = useState<string>("success");

const [loading, setLoading] = useState(false);

const fetchActivities = async () => {
    try {
      setLoading(true);
	  const res = await activities(page, limit, statusFilter, organizationId !== null ? String(organizationId) : undefined); 
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
		const res = await noschedule(page, limit, organizationId !== null ? String(organizationId) : undefined); 
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

  const fetchChartData = async () => {
	try {
	  setLoading(true);
	  const res = await chartmovements(Number(organizationId), dateFrom, dateTo);

	  
	  const grouped = groupChartData(res.data.items || [], groupBy);
	  console.log("Grouped chart data:", grouped);
setChartData(grouped);

	  
	} catch (err) {
	  console.error("Error fetching chart data", err);
	  toast.current?.show({
		severity: "error",
		summary: "Error",
		detail: "Failed to fetch chart data",
		life: 3000,
	  });
	} finally {
	  setLoading(false);
	}
  };


useEffect(() => {
  
  fetchActivities();

}, [page, limit, statusFilter, organizationId]);

useEffect(() => {
  fectchnoschendule();
}, [totalLockers, limitlockers, organizationId]);

useEffect(() => {
  if (organizationId) {
	fetchChartData();
  }
}, [organizationId, dateFrom, dateTo, groupBy]);

	return (
		 <div className="flex h-screen bg-[#2e2d2d] text-white font-sans">
      
      <div className="flex-1 ml-[3.6rem]  w-full">
        <Toolbar
          title="Lockers"
          showOrganizationSelect={true}
          onChangeOrganization={(id) => {
			setOrganizationId(Number(id));
			setPage(0);
          }}
        />
        <Toast ref={toast} />
		<div className="bg-[#2E2D2D] min-h-screen w-full text-black p-5 font-['Roboto']">
			<div className="flex flex-col md:flex-row gap-6 mb-3">

{lockers.length > 0 ? (
	<div className="bg-white rounded-xl p-4  w-full md:w-[40%]">
		<div className="flex items-center mb-1">
			<span className="font-semibold text-lg text-black ">
				Locker without assigned dates
			</span>
	</div>
	<div className="flex gap-4 overflow-x-auto pb-2  h-[80%]">
		{lockers.map((locker, idx) => (
			<div
				key={idx}
				className="bg-[#eaeaea] text-black rounded-lg p-4 min-w-[120px] shadow"
			>
				<div className="font-semibold text-lg ">Locker Number: {locker.locker_number}</div>
				<div className="text-md">Serial: {locker.locker_serial_number}</div>
				<div className="text-md">Area: {locker.area}</div>
				
			</div>
		))}
	</div>
</div>
) : (
	<div className="bg-white rounded-xl p-4 w-full md:w-[40%] h-[150px] flex items-center justify-center">
		<div className="text-gray-500">No lockers without assigned dates</div>
	</div>
)}

				<div className="bg-white rounded-xl p-4 flex-1 w-full md:w-[60%]">
					<div className="flex gap-3 items-center text-center mb-2 text-black text-sm">
  <div className="flex items-center gap-2">
    <label className="text-xs font-medium mb-1 mr-1">From</label>
    <input
      type="date"
      className="bg-white border border-gray-300 rounded px-2 py-[3px] text-xs w-[120px]"
      value={dateFrom}
      onChange={(e) => setDateFrom(e.target.value)}
    />
  </div>
  <div className="flex items-center gap-2">
    <label className="text-xs font-medium mb-1 mr-1">To</label>
    <input
      type="date"
      className="bg-white border border-gray-300 rounded px-2 py-[3px] text-xs w-[120px]"
      value={dateTo}
      onChange={(e) => setDateTo(e.target.value)}
    />
  </div>
  <div className="flex items-center gap-2">
    <label className="text-xs font-medium mb-1 mr-1">Group By</label>
    <select
      value={groupBy}
      onChange={(e) => setGroupBy(e.target.value as any)}
      className="bg-white border border-gray-300 rounded px-2 py-[3px] text-xs w-[100px]"
    >
      <option value="day">Day</option>
      <option value="week">Week</option>
      <option value="month">Month</option>
      <option value="year">Year</option>
    </select>
  </div>
</div>


					{/* <div className="font-semibold text-sm text-black w-full text-center">
					Movements from {dateFrom} to {dateTo}
					</div> */}

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

			<div className="font-semibold text-lg mb-2 text-white">Last attempts</div>

			<div className="flex bg-[#444444] text-white font-semibold rounded-xl mb-4">
				<div className="py-2 px-3 w-1/5">User</div>
				<div className="py-2 px-3 w-1/5">Lockers</div>
				<div className="py-2 px-3 w-1/5">Compartments</div>
				<div className="py-2 px-3 w-1/5">Date</div>
				<div className="py-2 px-3 w-1/5 flex items-center gap-1">
  <select
    className="bg-[#444444] text-white border border-white text-sm rounded"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
  
    <option value="success">Success</option>
    <option value="failure">Failure</option>
  </select>
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
						attempts
  .map((a, idx) => (

  <tr key={idx} className="border-b border-[#eaeaea]">
    <td className="py-2 px-3 w-1/5">
      <div className="font-semibold">{a.user}</div>
      <div className="text-xs text-gray-500">{a.role}</div>
    </td>
    <td className="py-2 px-3 w-1/5">{a.locker_serial_number}</td>
    <td className="py-2 px-3 w-1/5">{a.compartment_number}</td>
    <td className="py-2 px-3 w-1/5">
      <div>{a.date}</div>
      <div className="text-xs text-gray-500">{a.date_time}</div>
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
	<option value={5}>5</option>
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
