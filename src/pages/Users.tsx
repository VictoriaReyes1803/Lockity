import Sidebar from "../components/sidebar";
import Toolbar from "../components/Toolbar";
import { useEffect, useState } from "react";
import type { Users } from "../models/User";
import { getUsersWithLockers, putUserRole } from "../services/usersService";

export default function Users() {
  const [users, setUsers] = useState<Users[]>([]);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState<string>("user");
  const [selectedLocker, setSelectedLocker] = useState<number | null>(null);
  const [selectedCompartment, setSelectedCompartment] = useState<number | null>(null);

  const [mode, setMode] = useState<"edit" | "add">("edit");
  const [newEmail, setNewEmail] = useState<string>("");

  const lockers = [
    { id: 1,serial_number: "AAAAAA" },
    { id: 2, serial_number: "654321" },
    { id: 3, serial_number: "654322" },
  ];

  const compartments = [1, 2, 3, 4, 5];

  const fetchUsers = async () => {
    try {
      const data = await getUsersWithLockers("1", 1, 10);
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user: Users) => {
    setSelectedUser(user);
    setNewRole(user.role || "user");
    setSelectedLocker(null);
    setSelectedCompartment(null);
    setShowModal(true);
    setMode("edit");
  };
  const openAddModal = () => {
    setSelectedUser(null);
    setNewRole("user");
    setNewEmail("");
    setSelectedLocker(null);
    setSelectedCompartment(null);
    setMode("add");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setNewEmail("");
  };

  return (
    <div className="flex bg-[#2e2d2d] min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 ml-16">
        <Toolbar title="Users Management" />
        <div className="p-6">
          <button className="bg-[#FFD166] text-black text-[2rem] rounded-full w-12 h-12 shadow-lg hover:scale-105 transition"
          onClick={openAddModal}>
            +
          </button>

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
                      <button
                        className="bg-[#FFD166] text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition"
                        onClick={() => openModal(user)}
                      >
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

     {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#252525] rounded-xl p-6 text-white w-[350px]">
      <h2 className="text-xl font-semibold mb-4">
        {mode === "edit"
          ? `Change role for ${selectedUser?.name}`
          : "Add User"}
      </h2>
      {mode === "add" && (
        <div className="mb-2">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full bg-[#444] p-2 border rounded mb-2"
            placeholder="Enter email"
          />
        </div>
      )}
      <div className="mb-2">
        <label className="block text-sm mb-1">Role</label>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="w-full bg-[#444] p-2 border rounded mb-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Locker</label>
        <select
          value={selectedLocker ?? ""}
          onChange={(e) => setSelectedLocker(Number(e.target.value))}
          className="w-full bg-[#444] p-2 border rounded mb-2"
        >
          <option value="">-- Select locker --</option>
          {lockers.map((locker) => (
            <option key={locker.id} value={locker.id}>
              {locker.serial_number}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Compartment</label>
        <select
          value={selectedCompartment ?? ""}
          onChange={(e) => setSelectedCompartment(Number(e.target.value))}
          className="w-full bg-[#444] p-2 border rounded mb-2"
        >
          <option value="">-- Select compartment --</option>
          {compartments.map((c) => (
            <option key={c} value={c}>
              Compartment {c}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          className="px-4 py-2 text-[black] bg-gray-300 rounded"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          disabled={
            !selectedLocker ||
            !selectedCompartment ||
            (mode === "add" && !newEmail)
          }
          className="px-4 py-2 text-[black] bg-[#FFD166] rounded disabled:opacity-50"
          onClick={async () => {
            if (!selectedLocker || !selectedCompartment) {
              alert("Please select locker and compartment");
              return;
            }
            try {
              if (mode === "edit" && selectedUser) {
                await putUserRole(selectedLocker, selectedCompartment, {
                  user_email: selectedUser.email,
                  role: newRole,
                });
              }
              if (mode === "add") {
                await putUserRole(selectedLocker, selectedCompartment, {
                  user_email: newEmail,
                  role: newRole,
                });
              }
              closeModal();
              fetchUsers();
            } catch (e) {
              console.error("Failed to save", e);
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
