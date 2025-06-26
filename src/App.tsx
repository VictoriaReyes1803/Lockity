import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Callback from './pages/Callback';
import UserInformation from './pages/Me';
import Users from './pages/Users';


function App() {
 return (
    <div className="bg-[#2E2D2D] text-white font-sans min-h-screen w-full">
  

      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/callback" element={<Callback />} />
        <Route path="/users" element={<Users />} />
        <Route path="/me" element={<UserInformation />} />
       
      </Routes>
    </div>
  );
}

export default App;
