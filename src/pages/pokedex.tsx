import { trpc } from "@/utils/trpc";
import { useMemo, useReducer } from "react";
import { debounce } from "lodash";
import type {
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@/backend/router";
import PokemonImage from "@/components/UI/PokemonImage";
import { generateCountPercent } from "@/utils/generateCountPercent";
import { pokemonColors } from "@/utils/pokemonColors";

const initialState = { search: "", range: 493, color: "" };

type ACTIONTYPE =
  | { type: "color"; color: string }
  | { type: "search"; search: string }
  | { type: "range"; range: number };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case "color":
      return { ...state, color: action.color };
    case "search":
      return { ...state, search: action.search };
    case "range":
      return { ...state, range: action.range };
    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}

const Pokedex = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data } = trpc.useQuery([
    "filter-pokemon",
    { search: state.search, range: state.range, color: state.color },
  ]);
  const handleSearch = useMemo(
    () =>
      debounce(
        (e) => dispatch({ type: "search", search: e.target.value }),
        350
      ),
    []
  );
  const handleRange = useMemo(
    () =>
      debounce(
        (e) => dispatch({ type: "range", range: parseInt(e.target.value) }),
        350
      ),
    []
  );

  return (
    <main className="mx-auto px-[2rem] lg:px-20 3xl:px-40 mt-10 sm:mt-20">
      <div className="flex gap-3">
        {pokemonColors.map((color) => (
          <button
            key={color}
            className={`nfont-semibold text-violet-100 capitalize py-2 px-6 mt-8 text-md rounded-full border-violet-100 border-[1px] focus:outline-none focus:ring-1 focus:ring-violet-200 ${color === state.color && "bg-gradient-to-r from-indigo-800 to-violet-800"}`}
            onClick={() => dispatch({ type: "color", color: color })}
          >
            {color}
          </button>
        ))}
      </div>
      {/* <input
        type="search"
        className="text-black"
        onChange={(e) => handleSearch(e)}
      />
      <input type="range" min="1" max="493" onChange={(e) => handleRange(e)} />
      <button>Something</button> */}
      {data && <PokemonListing data={data} />}
    </main>
  );
};
// InferGetStaticPropsType<typeof getStaticProps>
const PokemonListing = ({
  data,
}: {
  data: any;
}): JSX.Element => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,minmax(330px,_1fr))] md2:grid-cols-[repeat(auto-fill,minmax(380px,_1fr))] gap-10 mt-20">
      {data.slice(0, 10).map((pokemon: any) => (
        <div key={pokemon.id} className="flex flex-col items-center">
          <div className="h-52 sm:h-64 drop-shadow-[0_0_100px_#3700ffb9]">
            <PokemonImage image={pokemon.spriteUrl} />
          </div>
          <div className="bg-[#111111de] rounded-3xl h-72 -mt-20 px-6 font-semibold text-violet-100 w-full">
            <h1 className="text-center pt-24 capitalize text-3xl mb-6 animate-fade-in">
              {pokemon.name}
            </h1>
            <div className="text-lg flex justify-between items-center gap-4 w-full">
              <p>Percent:</p>
              <p className="text-gray-400 animate-fade-in">
                {generateCountPercent(pokemon) + "%"}
              </p>
              <div className="relative w-32">
                <div className="bg-gray-300 rounded-full w-full h-4 opacity-50" />
                <div
                  className="animate-fade-in absolute inset-0 bg-violet-100 rounded-full h-4"
                  style={{ width: `${+generateCountPercent(pokemon)}%` }}
                />
              </div>
            </div>
            <div className="text-lg flex justify-between items-center gap-4 w-full mt-2">
              <p>Base experience:</p>
              <p>{pokemon.baseExperience}</p>
            </div>
            <div className="text-lg flex justify-between items-center gap-4 w-full mt-2">
              <p>Color:</p>
              <p className="capitalize">{pokemon.color}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: {},
  });

  await ssg.fetchQuery("filter-pokemon", { search: "", range: 493, color: "" });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default Pokedex;
