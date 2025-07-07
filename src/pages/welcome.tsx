import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { postOrganization } from "../services/lockersService"; 
import Loader from "../components/Loader";
  import { useEffect } from "react";
  import { haslocker } from "../services/authService";
  import { useNavigate } from "react-router-dom";

export default function CreateOrganization() {
  const [organization, setOrganization] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [areaName, setAreaName] = useState("");
  const [areaDescription, setAreaDescription] = useState("");
  const [lockerCode, setLockerCode] = useState("");
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

useEffect(() => {
  const checkLocker = async () => {
    setLoading(true);
    try {
      const result = await haslocker();
      console.log("checkLocker on welcome page:", result);
      setLoading(false);
      if (result) {
        navigate("/me", { replace: true });
      }
    } catch (error) {
      console.error("Error checking locker on welcome:", error);
      
    }
  };
  checkLocker();
}, [navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await postOrganization({
        name: organization,
        description: orgDescription,
        area: {
          name: areaName,
          description: areaDescription,
        },
        locker_serial_number: lockerCode,
      });

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: `Organization "${organization}" created successfully`,
        life: 3000,
      });

      
      setOrganization("");
      setOrgDescription("");
      setAreaName("");
      setAreaDescription("");
      setLockerCode("");

      
      window.location.href = "/me"; 
    } catch (error) {
      console.error("Error creating organization:", error);

      let errorMessage = "Failed to create organization, please try again.";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
      ) {
        errorMessage = error.response.data.message;
      }

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 4000,
      });
    }
  };

  const isElectron = () => window.navigator.userAgent.includes("Electron");

  if (isElectron()) {
    return (
      <div className="h-screen w-full bg-[#2e2d2d] flex flex-col items-center justify-center text-white p-6 space-y-4">
        <img
          src="/images/Locker Icon.svg"
          alt="Locker"
          className="h-16 w-16 animate-pulse"
        />
        <h1 className="text-2xl font-bold">No locker assigned</h1>
        <p className="text-center max-w-md text-gray-400">
          You do not have a locker assigned. Please contact your administrator
          to assign you one.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#2e2d2d] flex items-center justify-center relative">
      <div className="absolute top-8 left-8">
        <img src="images/logo.svg" alt="Lockity" className="h-12" />
      </div>

      <Toast ref={toast} />

      <div className="bg-[#2e2d2d] rounded-lg shadow space-y-4 ">
        <h1 className="text-center text-2xl font-bold mb-2">Welcome!!!</h1>
        <p className="text-center text-sm mb-4">
          To Enter You Must Create An Organization
        </p>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col items-center"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-1 text-left">
                Enter Organization
              </label>
              <input
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-[25rem] bg-[#444] px-4 py-2 rounded text-white"
                type="text"
                placeholder="Organization name"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-left">
                Enter Description
              </label>
              <input
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
                className="w-[25rem] bg-[#444] px-4 py-2 rounded text-white"
                type="text"
                placeholder="Organization description"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-left">
                Enter Name Of Area
              </label>
              <input
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="w-[25rem] bg-[#444] px-4 py-2 rounded text-white"
                type="text"
                placeholder="Area name"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-left">
                Enter Description Of Area
              </label>
              <input
                value={areaDescription}
                onChange={(e) => setAreaDescription(e.target.value)}
                className="w-[25rem] bg-[#444] px-4 py-2 rounded text-white"
                type="text"
                placeholder="Area description"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-left">
                Enter Code Of Locker
              </label>
              <input
                value={lockerCode}
                onChange={(e) => setLockerCode(e.target.value)}
                className="w-[25rem] bg-[#444] px-4 py-2 rounded text-white"
                type="text"
                placeholder="Locker code"
                required
              />
            </div>
            <button
              type="submit"
              className="w-[25rem] bg-[#FFD166] text-black font-bold py-2 mt-4 rounded hover:brightness-90 transition"
            >
              ADD
            </button>
          </div>
        </form>
      </div>
      {loading && <Loader />}

    </div>
  );
}
