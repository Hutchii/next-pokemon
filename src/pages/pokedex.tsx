import { trpc } from "@/utils/trpc";
import { useReducer } from "react";

// const filterReducer(currentState, action) {
//   if (action.type === "filter") {
//     return {...currentState, filter: action}
//   }
// }

const Pokedex = () => {
  // const [state, dispatch] = useReducer(reducer, { category: "" });
  const { data } = trpc.useQuery(["filter-pokemon", "bul"]);

  // function handleFilter(filter: string) {
  //   dispatch({
  //     type: 'filter',
  //     filter: filter
  //   });
  // }
  
  return (
    <main className="mx-auto px-[2rem] 2xl:px-40">
      <button className="block">All</button>
      <button>Something</button>
      {data?.map((pokemon) => (
        <div key="asd">{pokemon.name}</div>
      ))}
    </main>
  );
};

export default Pokedex;
