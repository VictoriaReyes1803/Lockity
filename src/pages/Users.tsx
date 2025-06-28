import Sidebar from "../components/sidebar";
import Toolbar from "../components/Toolbar";
import { useEffect, useState } from "react";
import type { Users } from "../models/User";
import { getUsersWithLockers } from "../services/usersService";

export default function Users() {
  const [users, setUsers] = useState<Users[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsersWithLockers("1", 1, 10); 
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div className="flex bg-[#2e2d2d] min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 ml-16">
        <Toolbar title="Users Management"/>
        <div className="p-6">
   <button className=" bg-[#FFD166] text-black text-3xl rounded-full w-12 h-12 shadow-lg hover:scale-105 transition">+</button>

        <div className="mt-6 bg-[#252525] rounded-xl p-6 overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-white border-b border-gray-600">
                <th className="py-2">Name</th>
                <th className="py-2">Last Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
                {users.map((user, i) => (
                  <tr key={i} className="border-b border-white">
                    <td className="py-4">
                      <div>
                        <div>{user.name}</div>
                        <div className="text-sm text-gray-400">{user.role}</div>
                      </div>
                    </td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition">
                        Change role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>

         
       </div>
        </div>
      </div>
    </div>
  );
}
