const Background = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-rose-600" />
      <div className="pointer-events-none absolute inset-0 bg-radial-content-shadow" />
      <div className="bg-[url('/svg/bg.svg')] pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-900 via-[#18181800] to-gray-900" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gray-900 via-[#18181800] to-gray-900" />
    </>
  );
};

export default Background;
