export const colorsOptions = [
  "None",
  "black",
  "blue",
  "brown",
  "gray",
  "green",
  "pink",
  "purple",
  "red",
  "white",
  "yellow",
];

export const sortOptions = ["default", "name", "color", "base experience"];

export const initialFilters = {
  search: "",
  minExperience: 36,
  maxExperience: 635,
  color: "None",
  sort: "default",
  page: 1,
};

//Action contains informations from dispatch.
export type ACTIONTYPE_FILTERS =
  | { type: "useFilter"; payload: { key: string; value: string | number } }
  | { type: "changePage"; page: number }
  | { type: "reset" };

export const reducerFilters = (
  state: typeof initialFilters,
  action: ACTIONTYPE_FILTERS
) => {
  switch (action.type) {
    case "useFilter":
      return { ...state, [action.payload.key]: action.payload.value };
    case "changePage":
      return { ...state, page: action.page };
    case "reset":
      return initialFilters;
    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
};
