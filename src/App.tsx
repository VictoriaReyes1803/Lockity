import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Callback from './pages/callback';
import UserInformation from './pages/Me';
import Sidebar from "./components/sidebar";
import OrganizationsPage from './pages/Organizations';
import Users from './pages/Users';
import PrivateRoute from "./guards/authguard";
import Haslocker from './guards/haslocker';
import CreateOrganization from './pages/welcome';
import NotFound from './pages/notfound';
import HomeDesktop from './pagesDesktop/home';
import Lockers from './pages/Lockers';
import Logs from './pages/Logs';

import Dashboard from './pagesDesktop/dashboard'; 
const isElectron = () => window.navigator.userAgent.includes("Electron");

function App() {
 return (
    <div className="bg-[#2E2D2D] text-white font-sans min-h-screen w-full">
  

      <Routes>
      <Route path="/" element={  isElectron() ? <HomeDesktop /> : <Home /> }/>

       <Route path="/callback" element={<Callback />} />
       <Route path="/welcome" element={<PrivateRoute> <CreateOrganization /></PrivateRoute>} />
       <Route path="/organization" element={<PrivateRoute>  <Haslocker><div><Sidebar /> <OrganizationsPage /></div></Haslocker> </PrivateRoute>} />
    <Route
      path="/lockers"
      element={
        <PrivateRoute>
          <Haslocker>
            <div>
              <Sidebar />
           
                <Lockers />
              </div>
           
          </Haslocker>
        </PrivateRoute>
      }
    />
    <Route
      path="/Logs"
      element={
        <PrivateRoute>
          <Haslocker>
            <div>
              <Sidebar />
              <Logs />
            </div>
          </Haslocker>
        </PrivateRoute>
      }
    />
    <Route
      path="/me"
      element={
        <PrivateRoute>
          <Haslocker>
             <div>
              <Sidebar />
            <UserInformation />
            </div>
          </Haslocker>
        </PrivateRoute>
      }
    />
    <Route
      path="/users"
      element={
        <PrivateRoute>
          <Haslocker>
             <div>
              <Sidebar />
            <Users />
            </div>
          </Haslocker>
        </PrivateRoute>
      }
    />
    {isElectron() && (
    <Route
      path="/dashboard"
      element={
         <PrivateRoute>
          <Haslocker>
             <div>
              <Sidebar />
      <Dashboard />
        </div>
          </Haslocker>
        </PrivateRoute>
      }
    />
    )}


       <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
