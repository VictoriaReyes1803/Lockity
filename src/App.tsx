import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Callback from './pages/callback';
import UserInformation from './pages/Me';
import Users from './pages/Users';
import PrivateRoute from "./guards/authguard";
import Haslocker from './guards/haslocker';
import CreateOrganization from './pages/welcome';
import NotFound from './pages/notfound';

function App() {
 return (
    <div className="bg-[#2E2D2D] text-white font-sans min-h-screen w-full">
  

      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/callback" element={<Callback />} />
       <Route path="/welcome" element={<PrivateRoute> <CreateOrganization /></PrivateRoute>} />
      <Route  path="/me" element={<PrivateRoute> <Haslocker> <UserInformation /> </Haslocker> </PrivateRoute>} />
      <Route path="/users" element={
            <PrivateRoute>
              <Haslocker>
              <Users /></Haslocker></PrivateRoute>}/>
       <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
