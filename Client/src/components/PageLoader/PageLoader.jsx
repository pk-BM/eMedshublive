const PageLoader = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white fixed z-[9999]">
      <div className="relative flex items-center justify-center">
        {/* Spinning Circle Outline */}
        <div className="absolute w-50 h-50 border-6 border-[#A6ADBB] border-t-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>

        {/* Logo */}
        <h1 className="text-2xl font-semibold">
          eMeds<span className="text-tertiary">Hub</span>
        </h1>
      </div>
    </div>
  );
};

export default PageLoader;
