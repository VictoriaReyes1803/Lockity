import { Link, useLocation } from 'react-router-dom';

function NavbarHome() {
  const location = useLocation();
  const currentPath = location.pathname;

interface IsActiveFn {
    (path: string): string;
}

const isActive: IsActiveFn = (path: string): string =>
    currentPath === path
        ? 'underline hover:decoration-[#A3A8AF] hover:text-[#A3A8AF] underline-offset-8 decoration-[#A3A8AF] decoration-2'
        : 'hover:underline hover:decoration-[#A3A8AF] hover:text-[#A3A8AF]';

  return (
    <nav className="sticky top-0 z-50 bg-[#2E2D2D] flex justify-between items-center px-8 py-2">
 
      <div className="flex items-center space-x-2">
        <img src="/images/logo.svg" alt="LOCKITY logo" className="w-14 h-14" />
      </div>

      <div className="flex-1 flex justify-center items-center space-x-10 text-sm font-semibold">
        <Link to="/" className={isActive('/')}>
          Home
        </Link>
        <Link to="/login" className={isActive('/login')}>
          Sign In
        </Link>
        <Link to="/register" className={isActive('/register')}>
          Register
        </Link>
      </div>

   
    </nav>
  );
}

export default NavbarHome;
