const Background = () => {
  return (
    <>
      <div className="-z-10 absolute inset-0 bg-gradient-to-r from-blue-600 to-rose-600" />
      <div className="-z-10 absolute inset-0 bg-radial-content-shadow" />
      <div className="-z-10 bg-[url('/svg/bg.svg')] absolute inset-0 overflow-hidden" />
      <div className="-z-10 absolute inset-0 bg-gradient-to-b from-gray-900 via-[#18181800] to-gray-900" />
      <div className="-z-10 absolute inset-0 bg-gradient-to-r from-gray-900 via-[#18181800] to-gray-900" />
    </>
  );
};

export default Background;
