type LoaderProps = {
  message?: string;
};

const Loader =  ({ message = "Loading lockers system..." }: LoaderProps) => {
  return (
    <div className="fixed inset-0 bg-[#2E2D2D] flex flex-col items-center justify-center z-50">
      <div className="relative w-16 h-16 animate-spin border-4 border-[#FFD166] border-t-transparent rounded-full">
        <img
          src="/images/Locker Icon.svg"
          alt="Locker"
          className="absolute inset-0 m-auto w-6 h-6"
        />
      </div>
      <p className="mt-4 text-[#FFD166] text-sm">{message}</p>
    </div>
  );
};

export default Loader;
