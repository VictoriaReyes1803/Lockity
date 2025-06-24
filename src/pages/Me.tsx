import { useState } from "react";

export default function UserInformation() {
  const [form, setForm] = useState({
    name: "Victoria",
    lastname: "Jaime",
    secondLastname: "Reyes",
    email: "22170152@uttcampus.edu.mx",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User updated:", form);
    // Aquí iría la lógica para enviar al backend
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] text-white">
      
      {/* Sidebar */}
      <aside className="w-16 bg-[#2e2d2d] flex flex-col items-center py-4 space-y-6 text-xl">
        <span>👤</span>
        <span>🔒</span>
        <span>👥</span>
        <span>📊</span>
        <span>⚙️</span>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-2">
            <img src="/images/user.svg" alt="user" className="w-10 h-10 rounded-full border border-gray-400" />
            <span className="text-lg font-semibold">Hello Olivia</span>
          </div>
          <h1 className="text-2xl font-bold">User Information</h1>
        </header>

        {/* Formulario */}
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
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="w-full bg-[#444] text-white px-4 py-2 rounded"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Second Last Name</label>
            <input
              name="secondLastname"
              value={form.secondLastname}
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
            className="w-full mt-6 bg-[#FFD166] text-black font-semibold py-2 rounded-full hover:brightness-90 transition"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
