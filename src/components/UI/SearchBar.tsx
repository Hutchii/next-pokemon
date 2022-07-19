const SearchBar = ({
  handleSearch,
  searchRef,
}: {
  handleSearch: (value: string) => void;
  searchRef: React.Ref<HTMLInputElement>;
}) => {
  return (
    <div className="relative 3xl:mt-0">
      <p className="text-lg mb-1 sm:mb-1.5 lg:mb-2 lg:text-xl">Search:</p>
      <input
        type="search"
        className="h-10 w-full sm:w-80 pl-10 py-1.5 text-base font-bold text-slate-800 bg-violet-100 rounded-full focus:outline-none placeholder:text-slate-800"
        placeholder="Search by name..."
        aria-label="Search"
        onChange={(e) => handleSearch(e.target.value)}
        ref={searchRef}
      />
      <span className="absolute left-3 top-[42px]">
        <svg
          width="24"
          height="24"
          fill="none"
          focusable="false"
          aria-hidden="true"
          role="img"
          className="stroke-slate-800"
        >
          <path
            d="m19 19-3.5-3.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="11"
            cy="11"
            r="6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
};

export default SearchBar;
