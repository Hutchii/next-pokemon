const Pagination = ({
  onArrowClick,
  onPageClick,
  lastPage,
  paginationRange,
  currentPage,
}: {
  onArrowClick: (sign: number) => void;
  onPageClick: (page: number) => void;
  lastPage: boolean;
  paginationRange: (number | string)[];
  currentPage: number;
}) => {
  return (
    <div className="flex gap-1 mt-10 items-center font-medium justify-center">
      <button
        className="text-2xl mr-2 disabled:opacity-25"
        onClick={() => onArrowClick(-1)}
        disabled={currentPage < 2}
      >
        &#8592;
      </button>
      {paginationRange.map((pageNumber, i) => {
        if (typeof pageNumber === "string") {
          return (
            <div
              className="text-xl w-7 text-center pointer-events-none"
              key={pageNumber + i}
            >
              &#8230;
            </div>
          );
        }
        return (
          <div
            className={`text-xl cursor-pointer w-7 text-center ${
              pageNumber === currentPage &&
              "bg-gradient-to-r from-indigo-800 to-violet-800"
            }`}
            key={pageNumber}
            onClick={() => onPageClick(pageNumber)}
          >
            {pageNumber}
          </div>
        );
      })}
      <button
        className="text-2xl ml-2 disabled:opacity-25"
        onClick={() => onArrowClick(+1)}
        disabled={lastPage}
      >
        &#8594;
      </button>
    </div>
  );
};

export default Pagination;
