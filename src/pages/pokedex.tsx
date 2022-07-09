import { trpc } from "@/utils/trpc";
import { useMemo, useReducer, useRef } from "react";
import { debounce, range } from "lodash";
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
import Pagination from "@/components/UI/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/backend/utils/ts-bs";
import MultiRangeSlider from "@/components/UI/MultiRangeSlider";

const initialState = {
  search: "",
  rangeMin: 36,
  rangeMax: 635,
  color: "",
  page: 1,
};

type ACTIONTYPE =
  | { type: "color"; color: string }
  | { type: "search"; search: string }
  | { type: "rangeMin"; rangeMin: number }
  | { type: "rangeMax"; rangeMax: number }
  | { type: "pagination"; page: number };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case "color":
      return { ...state, search: "", page: 1, color: action.color };
    case "search":
      return { ...state, page: 1, search: action.search };
    case "rangeMin":
      return {
        ...state,
        search: "",
        page: 1,
        rangeMin: action.rangeMin,
      };
    case "rangeMax":
      return {
        ...state,
        search: "",
        page: 1,
        rangeMax: action.rangeMax,
      };
    case "pagination":
      return { ...state, page: action.page };
    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}

type PokemonQueryResult = AsyncReturnType<typeof getAllPokemons>;

const Pokedex = ({ pokemon }: { pokemon: PokemonQueryResult }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredData = pokemon.filter(
    (pokemon) =>
      pokemon.color.includes(state.color) && pokemon.name.includes(state.search) &&
    pokemon.baseExperience >= state.rangeMin
  );

  const totalCount = filteredData?.length!;
  const pageSize = 10;
  const currentPage = state.page;
  const paginationRange = usePagination({
    totalCount,
    pageSize,
    currentPage,
  })!;
  let lastPage = paginationRange?.[paginationRange?.length - 1] === state.page;
  const handleSearch = useMemo(
    () =>
      debounce(
        (e) => dispatch({ type: "search", search: e.target.value }),
        350
      ),
    []
  );
  // const handleRangeMin = (e) =>
  //   dispatch({
  //     type: "rangeMin",
  //     rangeMin: e.target.value,
  //   });
  const handleRangeMin = useMemo(
    () =>
      debounce(
        (e) =>
          dispatch({
            type: "rangeMin",
            rangeMin: e,
          }),
        0
      ),
    []
  );
  const handleRangeMax = useMemo(
    () =>
      debounce(
        (e) =>
          dispatch({
            type: "rangeMax",
            rangeMax: e,
          }),
        0
      ),
    []
  );
  console.log(state);
  return (
    <main className="mx-auto px-[2rem] lg:px-20 3xl:px-40 mt-10 sm:mt-20 pb-20">
      <div className="3xl:flex 3xl:gap-10 3xl:justify-between">
        <div className="flex flex-wrap gap-3">
          {pokemonColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`h-10 px-6 py-2.5 bg-white text-slate-800 font-bold text-md leading-tight capitalize rounded-full shadow-md transition duration-150 ease-in-out ${
                color === state.color &&
                "text-white bg-gradient-to-r from-indigo-800 to-violet-800"
              }`}
              onClick={() => {
                if (searchRef.current) searchRef.current.value = "";
                dispatch({ type: "color", color: color });
              }}
            >
              {color}
            </button>
          ))}
        </div>
        <div className="relative mt-5 3xl:mt-0">
          <input
            type="search"
            className="h-10 w-full sm:w-80 pl-10 py-1.5 text-base font-medium text-slate-500 bg-white rounded-full focus:outline-none placeholder:text-slate-400"
            placeholder="Search by name..."
            aria-label="Search"
            onChange={(e) => handleSearch(e)}
            ref={searchRef}
          />
          <span className="absolute left-3 top-[7.5px] text-gray-700">
            <svg
              width="24"
              height="24"
              fill="none"
              focusable="false"
              aria-hidden="true"
              role="img"
              className="stroke-slate-400"
            >
              <path
                d="m19 19-3.5-3.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <circle
                cx="11"
                cy="11"
                r="6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></circle>
            </svg>
          </span>
        </div>
      </div>
      <label htmlFor="" className="text-lg mr-4">
        Base experience:
      </label>
      {/* <input
        className="mt-8"
        type="range"
        min="36"
        max="635"
        onChange={(e) => handleRangeMin(e)}
      /> */}
      <MultiRangeSlider
        min={36}
        max={635}
        minVal={state.rangeMin}
        maxVal={state.rangeMax}
        onChangeMin={handleRangeMin}
        onChangeMax={handleRangeMax}
      />
      {/* <p>{state.range}</p> */}
      {filteredData && <PokemonListing data={filteredData} page={state.page} />}
      {paginationRange?.length < 2 || !paginationRange ? null : (
        <div className="flex justify-center">
          <Pagination
            onArrowClick={(sign: number = 0) =>
              dispatch({ type: "pagination", page: state.page + sign })
            }
            onPageClick={(page: number) =>
              dispatch({ type: "pagination", page: page })
            }
            disabledPrev={state.page < 2}
            disabledNext={lastPage}
            paginationRange={paginationRange}
            currentPage={state.page}
          />
        </div>
      )}
    </main>
  );
};
// InferGetStaticPropsType<typeof getStaticProps>
const PokemonListing = ({
  data,
  page,
}: {
  data: PokemonQueryResult;
  page: number;
}): JSX.Element => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,minmax(330px,_1fr))] md2:grid-cols-[repeat(auto-fill,minmax(380px,_1fr))] gap-10 mt-20">
      {data.slice((page - 1) * 10, page * 10).map((pokemon: any) => (
        <div key={pokemon.id} className="flex flex-col items-center">
          <div className="h-52 sm:h-64 drop-shadow-[0_0_100px_#3700ffb9] z-10">
            <PokemonImage image={pokemon.spriteUrl} />
          </div>
          <div className="bg-[#111111de] rounded-3xl h-72 -mt-20 px-6 font-semibold text-violet-100 w-full">
            {/* animate-fade-in */}
            <h1 className="text-center pt-24 capitalize text-3xl mb-6">
              {pokemon.name}
            </h1>
            <div className="text-lg flex justify-between items-center gap-4 w-full">
              <p>Percent:</p>
              <p className="text-gray-400">
                {generateCountPercent(pokemon) + "%"}
              </p>
              <div className="relative w-32">
                <div className="bg-gray-300 rounded-full w-full h-4 opacity-50" />
                <div
                  className="absolute inset-0 bg-violet-100 rounded-full h-4"
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

const getAllPokemons = async () => {
  return await prisma.pokemon.findMany({
    // where: {
    //   name: { contains: "" },
    //   id: { lte: 635 },
    //   color: { contains: "" },
    // },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      color: true,
      baseExperience: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

export const getStaticProps: GetStaticProps = async () => {
  const allPokemons = await getAllPokemons();

  return {
    props: {
      pokemon: allPokemons,
    },
    revalidate: 120,
  };
};

export default Pokedex;
