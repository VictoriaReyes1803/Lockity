import Sidebar from "../components/sidebar";
import Toolbar from "../components/Toolbar";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import type { Users} from "../models/User";
import { Toast } from 'primereact/toast';
import { useRef } from "react";
import { Paginator } from 'primereact/paginator';
import { getUsersWithLockers, putUserRole } from "../services/usersService";

export default function Users() {
  const toast = useRef<Toast>(null);
  const [filterRole, setFilterRole] = useState<string>("");
  const [organizationId, setOrganizationId] = useState<string>("1");

  const [users, setUsers] = useState<Users[]>([]);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState<string>("user");
  const [selectedLocker, setSelectedLocker] = useState<number | null>(null);
  const [selectedCompartment, setSelectedCompartment] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0); 
  const [rows, setRows] = useState(10); 
  const [totalRecords, setTotalRecords] = useState(0);


  const [mode, setMode] = useState<"edit" | "add">("edit");
  const [newEmail, setNewEmail] = useState<string>("");

  const lockers = [
    { id: 1,serial_number: "AAAAAA" },
    { id: 2, serial_number: "654321" },
    { id: 3, serial_number: "654322" },
  ];

  const compartments = [1, 2, 3, 4, 5];

  const fetchUsers = async (
    orgId = organizationId,
    currentPage = page, 
    currentRows = rows,
    roleFilter = filterRole
  ) => {
    setLoading(true);
    try {
      const data = await getUsersWithLockers(orgId, currentPage + 1, currentRows,roleFilter || undefined);
      console.log("Fetched users:", data);
      setUsers(data.items);
      setTotalRecords(data.total); 

    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setTotalRecords(0);
      setPage(0);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch users",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rows, filterRole, organizationId]);

  const openModal = (user: Users) => {
    setSelectedUser(user);
    setNewRole( "user");
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
        <Toolbar title="Users Management" 
        showOrganizationSelect={true}
        onChangeOrganization={(id) => {
        setOrganizationId(id);
        setPage(0); 
      }}/>
        <Toast ref={toast} />

        <div className="p-6">
          <button className="bg-[#FFD166] text-black text-[2rem] rounded-full w-12 h-12 shadow-lg hover:scale-105 transition"
          onClick={openAddModal}>
            +
          </button>

          <div className="mt-6 bg-[#252525] rounded-xl p-6 overflow-x-auto">
            <div className="mb-4">
              <label className="block text-sm mb-1">Filter by Role</label>
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setPage(0); 
                }}
                className="bg-[#444] p-2 rounded text-white"
              >
                <option value="">All</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

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
                {users.length === 0 ? (
                  <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                  No users found.
                  </td>
                  </tr>
                  ) : (

                users.map((user, i) => (
                  <tr key={i} className="border-b border-white">
                    <td className="py-4">
                      <div>
                        <div>{user.name}</div>
                       <div className="text-xs text-gray-400 mt-1 space-y-1">
                        {user.assigned_lockers.map((locker, idx) => (
                          <div key={idx}>
                            {locker.role} - {locker.serial_number} ({locker.area})
                          </div>
                        ))}
                      </div>

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
                ))
              )}

              
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
              className="bg-[#252525] text-white border-none"
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
            />

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
            setLoading(true);
            try {
              if (mode === "edit" && selectedUser) {
                await putUserRole(selectedLocker, selectedCompartment, {
                  user_email: selectedUser.email,
                  role: newRole,
                });
                toast.current?.show({
                  severity: 'success',
                  summary: 'Role Updated',
                  detail: `Role for ${selectedUser.name} updated to ${newRole}`,
                  life: 3000
                });
              }
              if (mode === "add") {
                await putUserRole(selectedLocker, selectedCompartment, {
                  user_email: newEmail,
                  role: newRole,
                });
                toast.current?.show({
                  severity: 'success',
                  summary: 'User Added',
                  detail: `User with email ${newEmail} added with role ${newRole}`,
                  life: 3000
                });
              }
              closeModal();
              
              fetchUsers();
            } catch (e) {
              if (
                typeof e === "object" &&
                e !== null &&
                "response" in e &&
                (e as { response?: { status?: number } }).response?.status === 404
              ) {
                toast.current?.show({
                  severity: "warn",
                  summary: "Invitation Sent",
                  detail: "User not found in the system, invitation email has been sent.",
                  life: 4000,
                });
              } else {
                toast.current?.show({
                  severity: "error",
                  summary: "Error",
                  detail: "Failed to save changes",
                  life: 3000,
                });
              }
              closeModal();
              fetchUsers();
            }
            finally
            {
              setLoading(false);
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
{loading && <Loader />}


    </div>

    
  );
  
}
