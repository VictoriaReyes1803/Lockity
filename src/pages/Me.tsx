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
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = await Me();
        setForm(user.data);
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
        detail: message,
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

    setForm(updated.data);
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
       <div className="flex-1 ml-[4.3rem]">
        <Toolbar title="Me" /><Toast ref={toast} />


        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-[#2e2d2d] p-8 rounded-md space-y-4"
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
            className="w-full mt-6 bg-[#FFD166] text-black font-semibold py-2 hover:brightness-90 transition"
          >
            Update
          </button>
        </form>
      </div>
      {loading && <Loader />}

    </div>
    
  );
}
