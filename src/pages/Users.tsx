import Sidebar from "../components/sidebar";
import Toolbar from "../components/Toolbar";
import { useState } from "react";

type User = {
  name: string;
  lastname: string;
  email: string;
  role: string;
};

const usersData: User[] = [
  { name: "Vicky", lastname: "Jaime", email: "reydevictoria1803@gmail.com", role: "Super admin" },
  { name: "Alonso", lastname: "Melan", email: "reydevictoria1803@gmail.com", role: "User" },
  { name: "Marco", lastname: "Colmena", email: "reydevictoria1803@gmail.com", role: "Admin" },
  { name: "Larana", lastname: "Saucedo", email: "reydevictoria1803@gmail.com", role: "User" },
];

export default function Users() {
  const [users] = useState(usersData);

  return (
    <div className="flex bg-[#1a1a1a] min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 ml-16">
        <Toolbar />
        <div className="p-6">
   <button className=" bg-[#FFD166] text-black text-3xl rounded-full w-12 h-12 shadow-lg hover:scale-105 transition">+</button>

        <div className="mt-6 bg-[#2e2d2d] rounded-xl p-6 overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-gray-400 border-b border-gray-600">
                <th className="py-2">Name</th>
                <th className="py-2">Last Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="py-4">
                    <div>
                      <div>{user.name}</div>
                      <div className="text-sm text-gray-400">{user.role}</div>
                    </div>
                  </td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition">
                      Change rol
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
