import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import UserInformation from './pages/Me';
import Users from './pages/Users';
  // import Login from './pages/Login';
  // import Register from './pages/Register';

function App() {
 return (
    <div className="bg-[#2E2D2D] text-white font-sans min-h-screen w-full">
      <nav className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center space-x-2">
          <img src="/images/logosin.svg" alt="LOCKITY logo" className="w-6 h-6" />
          <span className="text-xl font-bold">LOCKITY</span>
        </div>
        <div className="space-x-4 text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/login" className="hover:underline">Sign In</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </div>
      </nav>

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
