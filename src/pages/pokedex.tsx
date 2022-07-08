import { trpc } from "@/utils/trpc";
import { useMemo, useReducer } from "react";
import { debounce } from "lodash";
import type { GetStaticProps, GetStaticPropsContext } from "next";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/backend/utils/ts-bs";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@/backend/router";
import superjson from "superjson";

// type PokemonQueryResult = AsyncReturnType<typeof getAllPokemons>;

const initialState = { filter: 0, search: "" };

type ACTIONTYPE =
  | { type: "filter"; filter: number }
  | { type: "search"; search: string };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case "filter":
      return { ...state, filter: action.filter };
    case "search":
      return { ...state, search: action.search };
    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}

const Pokedex = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data } = trpc.useQuery(["filter-pokemon", { search: "s" }]);
  // const { data } = trpc.useQuery([
  //   "filter-pokemon",
  //   { search: state.search },
  //   // { filter: state.filter, search: state.search },
  // ]);
  console.log(data);
  const handleSearch = useMemo(
    () =>
      debounce(
        (e) => dispatch({ type: "search", search: e.target.value }),
        350
      ),
    []
  );

  return (
    <main className="mx-auto px-[2rem] 2xl:px-40">
      <input
        type="search"
        className="text-black"
        onChange={(e) => handleSearch(e)}
      />
      <button
        // onClick={() => dispatch({ type: "filter", filter: 1 })}
        className="block"
      >
        All
      </button>
      <button>Something</button>
      {data?.map((pokemon) => (
        <div key={pokemon.name}>{pokemon.name}</div>
      ))}
    </main>
  );
};

// const getAllPokemons = async () => {
//   return await prisma.pokemon.findMany({
//     orderBy: { name: "desc" },
//   });
// };

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: {},
    // transformer: superjson,
  });

  // const allPokemons = await getAllPokemons();
  // return {
  //   props: {
  //     pokemons: allPokemons,
  //   },
  //   revalidate: 60,
  // };

  await ssg.fetchQuery("filter-pokemon", { search: "s" });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default Pokedex;
