import { useState, useEffect } from "react";

import Sidebar from "../components/sidebar";
import Toolbar from "../components/Toolbar";
import { Me, UpdateUser } from "../services/authService";
import type { User } from "../models/User";

export default function UserInformation() {
 
  
  const [form, setForm] = useState<User>({
    name: "",
    last_name: "",
    second_last_name: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await Me();
        console.log("User data fetched:", user);
        setForm(user);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const updated = await UpdateUser(form);
    setForm(updated);
   
  
  } catch (err) {
    console.error("Failed to update user:", err);

  }
};


  

  return (
    <div className="flex min-h-screen bg-[#background-color: #2E2E2E;] text-white">
      
      <Sidebar />
       <div className="flex-1 ml-[4.3rem]">
        <Toolbar />
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
    </div>
  );
}
