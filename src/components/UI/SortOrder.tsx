const SortOrder = ({
  onChange,
  order,
  disabled,
}: {
  onChange: () => void;
  order: boolean;
  disabled: string;
}) => {
  console.log(disabled);
  return (
    <button
      className="ml-2 mb-[6px] disabled:opacity-30"
      onClick={onChange}
      disabled={disabled === ""}
    >
      <svg
        className="h-6 w-6"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="transition ease-in duration-75"
          d="M5 13V1M5 1L1 5M5 1L9 5"
          stroke={order ? "white" : "#334155"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="transition ease-in duration-75"
          d="M15 5V17M15 17L19 13M15 17L11 13"
          stroke={order ? "#334155" : "white"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default SortOrder;
