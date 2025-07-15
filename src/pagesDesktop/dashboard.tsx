import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Toolbar from "../components/Toolbar";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
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
	{
		user: "Alonso Fugoroa",
		role: "user",
		locker: "1",
		compartment: "AFGJL",
		date: "Today",
		time: "2m ago",
		state: "Close",
	},
	{
		user: "Vicky jaime",
		role: "Admin",
		locker: "2",
		compartment: "LKJHJSHJ",
		date: "Today",
		time: "5m ago",
		state: "Close",
	},
	{
		user: "Marco Chavis",
		role: "user",
		locker: "2",
		compartment: "AFGJL",
		date: "Today",
		time: "1h ago",
		state: "Close",
	},
	{
		user: "Titi Arturo",
		role: "user",
		locker: "3",
		compartment: "AFGJL",
		date: "Today",
		time: "2h ago",
		state: "Open",
	},
	{
		user: "Bocher Hernandez",
		role: "user",
		locker: "4",
		compartment: "AFGJL",
		date: "Yesterday",
		time: "09:00 AM",
		state: "Close",
	},
	{
		user: "Ricarno Fifi",
		role: "User",
		locker: "5",
		compartment: "AFGJL",
		date: "Yesterday",
		time: "08:00 AM",
		state: "Close",
	},
];

export default function Dashboard() {
		const [organizationId, setOrganizationId] = useState<string>("");
		const [page, setPage] = useState(0); 
		const toast = useRef<Toast>(null);
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
								<div className="font-semibold">Locker: {locker.id}</div>
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
							{attempts.map((a, idx) => (
								<tr key={idx} className="border-b border-[#eaeaea]">
									<td className="py-2 px-3 w-1/5">
										<div className="font-semibold">{a.user}</div>
										<div className="text-xs text-gray-500">{a.role}</div>
									</td>
									<td className="py-2 px-3 w-1/5">{a.locker}</td>
									<td className="py-2 px-3 w-1/5">{a.compartment}</td>
									<td className="py-2 px-3 w-1/5">
										<div>{a.date}</div>
										<div className="text-xs text-gray-500">{a.time}</div>
									</td>
									<td className="py-2 px-3 w-1/5">
										<span
											className={`font-semibold text-sm flex items-center gap-1 ${
												a.state === "Open"
													? "text-red-500"
													: "text-[#FFD166]"
											}`}
										>
											{a.state}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="flex items-center justify-end mt-4 gap-2 text-gray-700">
					<button className="px-2 py-1 rounded hover:bg-[#f5f5f5]">
						&lt;&lt;
					</button>
					<button className="px-2 py-1 rounded hover:bg-[#f5f5f5]">
						&lt;
					</button>
					<span className="px-3 py-1 rounded bg-[#FFD166] text-black font-semibold">
						1
					</span>
					<button className="px-2 py-1 rounded hover:bg-[#f5f5f5]">
						&gt;
					</button>
					<button className="px-2 py-1 rounded hover:bg-[#f5f5f5]">
						&gt;&gt;
					</button>
					<select className="ml-4 bg-white border border-[#eaeaea] rounded px-2 py-1 text-black">
						<option>10</option>
						<option>20</option>
						<option>50</option>
					</select>
				</div>
			</div>
		</div>
		</div>
	  </div>
	
	);
}
