import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Sidebar from "../components/sidebar";
import Toolbar from "../components/Toolbar";
import { Me, UpdateUser } from "../services/authService";
import type { User } from "../models/User";
import { Toast } from 'primereact/toast';
import { useRef } from "react";


export default function UserInformation() {
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  const [form, setForm] = useState<User>({
    id: 0, 
    name: "",
    last_name: "",
    second_last_name: "",
    email: "",
    roles: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = await Me();
        console.log("User data:", user.data);
        if (user?.data) {
  setForm(user.data);
}
      } catch (err) {
         let message = "Failed to fetch user data.";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        message = (err.response.data as { message?: string }).message ?? message;
      }

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: message ?? "An unexpected error occurred.",
        life: 3000,
      });

      console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const nameRegex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ ]{3,100}$/;
  const emailRegex = /^(?=.{5,100}$)[\p{L}0-9._-]+@[\p{L}0-9-]+(?:\.[\p{L}0-9-]+)*\.[\p{L}0-9]{2,}$/u;

  if (
    !nameRegex.test(form.name.trim()) ||
    !nameRegex.test(form.last_name.trim()) ||
    !nameRegex.test(form.second_last_name.trim())
  ) {
    toast.current?.show({
      severity: 'warn',
      summary: 'Validation error',
      detail: 'Name fields must be 3–100 letters, only letters and spaces are allowed.',
      life: 3000,
    });
    return;
  }

if (!emailRegex.test(form.email.trim())) {
  toast.current?.show({
    severity: 'warn',
    summary: 'Validation error',
    detail: 'Invalid email format. Must be between 5–100 characters.',
    life: 3000,
  });
  return;
}


  try {
    const updated = await UpdateUser(form);

    window.location.reload();
    toast.current?.show({
      severity: 'success',
      summary: 'UpdateF Successful',
      detail: updated.message || 'Your information has been updated successfully.',
      life: 3000
    });
   
  
  } catch (err) {
    console.error("Failed to update user:", err);
    toast.current?.show({
      severity: 'error',
      summary: 'Update Failed',
      detail: (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
          ? (err.response.data as { message?: string }).message
          : 'An error occurred while updating your information.'
      ),
      life: 3000
    });

  } finally {
    setLoading(false);
  }
};


  

  return (
    <div className="flex min-h-screen bg-[#background-color: #2E2E2E;] text-white">
      
      <Sidebar />
       <div className="flex-1 ml-[4rem]">
        <Toolbar title="Me" /><Toast ref={toast} />

      <div className="flex">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl w-full mx-auto bg-[#2e2d2d] p-8 rounded-md space-y-4"
        >
          <h2 className="text-center text-lg font-medium mb-6">Your User Information</h2>

          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-[#444] text-white px-4 py-2 rounded"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full bg-[#444] text-white px-4 py-2 rounded"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Second Last Name</label>
            <input
              name="second_last_name"
              value={form.second_last_name}
              onChange={handleChange}
              className="w-full bg-[#444] text-white px-4 py-2 rounded"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#444] text-white px-4 py-2 rounded"
              type="email"
            />
          </div>

          <button
            type="submit"
            onSubmit={handleSubmit}
            className="w-full mt-6 bg-[#FFD166] text-black font-semibold py-2 hover:brightness-90 transition"
          >
            Update
          </button>
        </form>
      {(form.roles?.length ?? 0) > 0 && (
  <div className="max-w-xl w-[30%] mx-auto bg-[#2e2d2d] p-6 rounded-md mt-6">
    <h3 className="text-lg font-semibold mb-4">My Roles</h3>
    <div className="space-y-3 max-h-100 overflow-y-auto">
      {(() => {
        const groupedRoles = new Map<string, any>();

        for (const role of form.roles!) {
          if (role.role === "super_admin") {
            if (!groupedRoles.has(role.organization_name)) {
              groupedRoles.set(role.organization_name, {
                role: "super_admin",
                organization_name: role.organization_name,
              });
            }
          } else {
          
            groupedRoles.set(
              `${role.role}-${role.organization_name}-${role.area_name}-${role.locker_serial_number}`,
              role
            );
          }
        }

        return Array.from(groupedRoles.values()).map((role, idx) => (
          <div key={idx} className="rounded p-3 text-sm bg-[#3a3a3a] overflow-hidden">
            <div>
              <strong>Role:</strong> {role.role}
            </div>
            <div>
              <strong>Organization:</strong> {role.organization_name}
            </div>
            {role.role !== "super_admin" && (
              <>
                <div>
                  <strong>Area:</strong> {role.area_name}
                </div>
                <div>
                  <strong>Locker:</strong> {role.locker_serial_number}
                </div>
              </>
            )}
            {role.role === "super_admin" && (
              <div className="text-[#FFD166] mt-1">Access to all lockers and areas in app Web</div>
            )}
          </div>
        ));
      })()}
    </div>
  </div>
)}

</div>
      </div>
      {loading && <Loader />}

    </div>
    
  );
}
