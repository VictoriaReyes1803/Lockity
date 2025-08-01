import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { postOrganization } from "../services/organizationsService"; 
import Loader from "../components/Loader";
  import { useEffect } from "react";
  import { haslocker } from "../services/authService";
  import { useNavigate } from "react-router-dom";
  import { getEncryptedCookie } from "../lib/secureCookies";
  

export default function CreateOrganization() {
  const [organization, setOrganization] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [areaName, setAreaName] = useState("");
  const [areaDescription, setAreaDescription] = useState("");
  const [lockerCode, setLockerCode] = useState("");
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [showWifiModal, setShowWifiModal] = useState(false);

useEffect(() => {
  const checkLocker = async () => {
    setLoading(true);
    try {
      const result = await haslocker();
      console.log("checkLocker on welcome page:", result);
      setLoading(false);
      if (result) {

         if (typeof window !== "undefined" && !window.navigator.userAgent.includes("Electron")) {
        
                  const userRaw = getEncryptedCookie("u_7f2a1e3c");
                  console.log("User cookie:", userRaw);
                  if (userRaw) {
                    try {
                      const user = JSON.parse(userRaw);
        
                      const isSuperAdmin = Array.isArray(user.roles) &&
                        user.roles.some((r: any) => r.role === "super_admin");
        
                      if (!isSuperAdmin) {
                        // navigate("/welcome", { replace: true });
                        return;
                      }
        
            } catch (error) {
              console.error("Invalid user cookie format", error);
              // navigate("/welcome", { replace: true });
              return;
            }
        
            
          } else {
            // navigate("/welcome", { replace: true });
            return;
          }
        } else {

        navigate("/lockers", { replace: true });
        }

      }
    } catch (error) {
      console.error("Error checking locker on welcome:", error);
     setLoading(false); 
    }
  };
  checkLocker();
}, [navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Submitting organization:", {
        organization,
        orgDescription,
        areaName, 
        areaDescription,
        lockerCode,
      });
      await postOrganization({
        name: organization,
        description: orgDescription,
        area: {
          name: areaName,
          description: areaDescription,
        },
        locker_serial_number: lockerCode,
      });
      setLoading(false);
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

      setShowWifiModal(true);
      
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
      setLoading(false);
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
          You do not have a locker assigned. Please contact your Super administrator
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
        <Dialog
          header="Wi-Fi Configuration Reminder"
          visible={showWifiModal}
          closeOnEscape={true}
          style={{ width: '30vw', background: '#2e2d2d' }}
          contentStyle={{ background: '#2e2d2d', color: 'white' }}
          headerStyle={{ background: '#2e2d2d', color: 'white' }}
          onHide={() => setShowWifiModal(false)}
          footer={
            <Button
              label="Understood"
              icon="pi pi-check"
              onClick={() => {
          setShowWifiModal(false);
          navigate("/lockers");
              }}
              autoFocus
            />
            
          }
        >
          <p className="m-0">
            Before you can use your locker, please configure its Wi-Fi connection.<br />
            Connect to the lockity_config Wi-Fi network, access its admin panel, and set up its internet connection.
          </p>
        </Dialog>

      </div>
      {loading && <Loader />}

    </div>
  );
}
