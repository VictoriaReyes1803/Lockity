import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Callback from './pages/callback';
import UserInformation from './pages/Me';
import Users from './pages/Users';
import PrivateRoute from "./guards/authguard";

function App() {
 return (
    <div className="bg-[#2E2D2D] text-white font-sans min-h-screen w-full">
  

      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/callback" element={<Callback />} />
    
         <Route
          path="/me"
          element={
            <PrivateRoute>
              <UserInformation />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
       
      </Routes>
    </div>
  );
}

export default App;
