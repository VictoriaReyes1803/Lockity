import Sidebar from "../components/sidebar";
import Toolbar from "../components/Toolbar";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import type { Users, User} from "../models/User";
import { Toast } from 'primereact/toast';
import { useRef } from "react";

import { getLockers , getCompartments, deleteRole } from "../services/lockersService";
import { Paginator } from 'primereact/paginator';
import { getUsersWithLockers, putUserRole} from "../services/usersService";
import type { Locker, Compartment } from "../models/locker";
export default function Users() {
  const toast = useRef<Toast>(null);
  const [filterRole, setFilterRole] = useState<string>("");
  const [organizationId, setOrganizationId] = useState<string>("");
  const [deleteAllAccess, setDeleteAllAccess] = useState<boolean>(true);
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

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(null);

  const [mode, setMode] = useState<"edit" | "add">("edit");
  const [newEmail, setNewEmail] = useState<string>("");
  const [availableLockers, setAvailableLockers] = useState<Locker[]>([]);
  const [availableCompartments, setAvailableCompartments] = useState<Compartment[]>([]);

useEffect(() => {
  const orgsRaw = sessionStorage.getItem("organizations");
  
  if (orgsRaw) {
    try {
      const orgs = JSON.parse(orgsRaw);
      if (Array.isArray(orgs) && orgs.length > 0) {
        setOrganizationId(orgs[0].id.toString()); 
      }
    } catch (err) {
      console.error( err);
    }
  }
}, []);


  const fetchUsers = async (
    orgId = organizationId,
    currentPage = page, 
    currentRows = rows,
    roleFilter = filterRole
  ) => {
    setLoading(true);
    try {
      const data = await getUsersWithLockers(orgId, currentPage + 1, currentRows,roleFilter || undefined);

      const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

      const filteredUsers = data.items.filter(
      (user) => user.id !== currentUser.id && user.email !== currentUser.email
    );

    setUsers(filteredUsers);
    setTotalRecords(filteredUsers.length); 

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
     if (!organizationId) return;

    fetchUsers();
  }, [page, rows, filterRole, organizationId]);

  const openModal = (user: Users) => {
    setSelectedUser(user);
    setNewRole( "user");
    setSelectedLocker(null);
    setSelectedCompartment(null);
    setShowModal(true);
    setMode("edit");
    fetchLockers(); 
  };
  const openRemoveModal = (user: Users) => {
  setSelectedUser(user);
  setSelectedRoleIndex(null);
  setShowRemoveModal(true);
};

  const openAddModal = () => {
    setSelectedUser(null);
    fetchLockers(); 
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
    setSelectedLocker(null);
    setSelectedCompartment(null);
    setAvailableCompartments([]);
    setAvailableLockers([]);
  };


  const fetchLockers = async () => {
  try {
    const data = await getLockers(1, 100, organizationId);
    console.log("Lockers data:", data);
    if(data.success === true) {
   
    setAvailableLockers(data.data.items);
  }else {
    toast.current?.show({
      severity: "warn", 
      summary: "Warning",
      detail: data.message ?? "Could not load lockers",
      life: 3000,
    });
    setAvailableLockers([]);
  }

  } catch (error) {
    console.error("Error loading lockers:", error);
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Failed to load lockers",
      life: 3000,
    });
  }
};
const fetchCompartments = async (lockerId: number) => {
  try {
    const response = await getCompartments(lockerId);
    console.log("Compartments data:", response);
    if (response.success) {
      
      setAvailableCompartments(response.data.items);
    } else {

      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: response.message ?? "Could not load compartments",
        life: 3000,
      });
      setAvailableCompartments([]); 
    }
  } catch (error) {
    
    console.error("Error loading compartments:", error);
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail:
        (typeof error === "object" && error !== null && "response" in error && typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Unexpected error while loading compartments"),
      life: 3000,
    });
    setAvailableCompartments([]);
  }
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
                            <div className="ml-4 text-xs text-gray-400">
                                  {locker.role === "super_admin" ? (
                                    <span>All compartments</span>
                                  ) : locker.compartments && locker.compartments.length > 0 ? (
                                    locker.compartments.map((comp) => (
                                      <div key={comp.compartment_id}>- Compartment {comp.compartment_number}</div>
                                    ))
                                  ) : (
                                    <span>No compartments assigned</span>
                                  )}
                                </div>


                          </div>
                        ))}
                      </div>

                      </div>
                    </td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td >
                      <button
                        className="bg-[#FFD166] mr-2 mb-2 text-black px-4 py-1 rounded-full font-semibold hover:brightness-90 transition"
                        onClick={() => openModal(user)}
                      >
                        Change role
                      </button>
                      <button
                        className="bg-[#515355] text-white px-4 py-1 rounded-full font-semibold hover:brightness-90 transition"
                        onClick={() => openRemoveModal(user)}
                      >
                        Remove role
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










{showRemoveModal && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#252525] rounded-xl p-6 text-white w-[350px]">
      <h2 className="text-xl font-semibold mb-4">
        Remove Role for {selectedUser.name}
      </h2>

      {selectedUser.assigned_lockers.length === 0 ? (
        <p className="text-sm text-gray-300">No roles assigned to this user.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {selectedUser.assigned_lockers.map((role, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name="selectedRole"
                checked={selectedRoleIndex === index}
                onChange={() => setSelectedRoleIndex(index)}
              />
              <div className="text-sm">
                <strong>{role.role}</strong> - {role.serial_number}
                <br />
                <span className="text-xs text-gray-400">{role.area}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <button
          className="px-4 py-2 text-[black] bg-gray-300 rounded"
          onClick={() => {
            setShowRemoveModal(false);
            setSelectedRoleIndex(null);
          }}
        >
          Cancel
        </button>
        <button
          disabled={selectedRoleIndex === null}
          className="px-4 py-2 text-[black] bg-red-500 rounded disabled:opacity-50"
          onClick={async () => {
            try {
              const role = selectedUser.assigned_lockers[selectedRoleIndex!];
              console.log("Removing role:", role);
              const user = selectedUser.id;
              const compartmentNumber = role.compartments?.[0]?.compartment_number ?? null;
              const response = await deleteRole(role.locker_id,user, compartmentNumber, deleteAllAccess);

              console.log("Role removed response:", response);
              

              toast.current?.show({
                severity: "success",
                summary: "Role Removed",
                detail: `Role ${role.role} removed from ${selectedUser.name}`,
                life: 3000,
              });

              setShowRemoveModal(false);
              fetchUsers();
            } catch (e) {
              console.error("Error removing role:", e);
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to remove role",
                life: 3000,
              });
            }
          }}
        >
          Remove
        </button>
      </div>
    </div>
  </div>
)}






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
          onChange={(e) => {
          const lockerId = Number(e.target.value);
            setSelectedLocker(lockerId);
            setSelectedCompartment(null);
            fetchCompartments(lockerId); 
          }}
          
          className="w-full bg-[#444] p-2 border rounded mb-2"
        >
          <option value="">-- Select locker --</option>
          {availableLockers.map((locker) => (
          <option key={locker.locker_id} value={locker.locker_id}>
          Locker {locker.locker_serial_number} - {locker.area_name} 
          </option>
        ))}

        </select>
      </div>
      {selectedLocker && (
        <div className="mb-2">
          <label className="block text-sm mb-1">Compartment</label>
          <select
            value={selectedCompartment ?? ""}
            onChange={(e) => setSelectedCompartment(Number(e.target.value))}
            className="w-full bg-[#444] p-2 border rounded mb-2"
          >
            <option value="">-- Select compartment --</option>
            {availableCompartments.map((compartment) => (
              <option key={compartment.compartment_number} value={compartment.compartment_number}>
                Compartment {compartment.compartment_number}
              </option>
            ))}
          </select>
        </div>
      )}



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
              console.error("Error saving changes:", e);
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
