import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home';

import UserInformation from './pages/Me';
import Users from './pages/Users';
  // import Login from './pages/Login';
  // import Register from './pages/Register';

function App() {
 return (
    <div className="bg-[#2E2D2D] text-white font-sans min-h-screen w-full">
  

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/users" element={<Users />} />
        <Route path="/me" element={<UserInformation />} />
       
      </Routes>
    </div>
  );
}

export default App;
