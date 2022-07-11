export const colorsOptions = [
  "",
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

export const sortOptions = ["", "name", "color", "baseExperience"];

export const initialFilters = {
  search: "",
  minExperience: 36,
  maxExperience: 635,
  color: "",
  sort: "",
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
      return { ...state, page: 1, [action.payload.key]: action.payload.value };
    case "changePage":
      return { ...state, page: 1 };
    case "reset":
      return initialFilters;
    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
};
