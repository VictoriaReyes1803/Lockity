// components/Toolbar.tsx
const Toolbar = () => {
  return (
    <header className="w-full h-[60px] bg-gradient-to-t from-[#737373] to-[#2e2e2e] rounded-xl flex items-center justify-between px-6 text-white shadow-lg">

      <div className="flex items-center space-x-3">
        <img
          src="/images/User Icon.svg"
          alt="user"
          className="w-8 h-8 rounded-full border border-gray-200"
        />
        <span className="text-sm font-medium">Hello Olivia</span>
      </div>

   
      <h1 className="text-lg font-semibold">Users</h1>
    </header>
  );
};

export default Toolbar;
