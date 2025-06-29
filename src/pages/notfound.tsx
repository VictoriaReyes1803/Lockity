import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#2e2d2d] text-white p-6 space-y-4">
      <div className="relative w-24 h-24 animate-bounce">
        <img
          src="/images/Locker Icon.svg"
          alt="Locker open"
          className="w-full h-full"
        />
      </div>
      <h1 className="text-4xl font-bold mt-4">404 - Page Not Found</h1>
      <p className="text-gray-400">Oops! The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="bg-[#FFD166] text-black px-4 py-2 rounded font-semibold hover:brightness-90 transition mt-4"
      >
        Go Home
      </Link>
    </div>
  );
}
