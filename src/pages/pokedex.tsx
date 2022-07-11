import { useMemo, useReducer, useRef } from "react";
import { debounce } from "lodash";
import type { GetStaticProps } from "next";
import PokemonImage from "@/components/UI/PokemonImage";
import { generateCountPercent } from "@/utils/generateCountPercent";
import Pagination from "@/components/UI/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/backend/utils/ts-bs";
import MultiRangeInput from "@/components/UI/MultiRangeInput";
import SelectInput from "@/components/UI/SelectInput";
import SearchBar from "@/components/UI/SearchBar";
import {
  initialFilters,
  reducerFilters,
  colorsOptions,
  sortOptions,
} from "@/utils/filtersReducer";

const PAGE_SIZE = 10;

type PokemonQueryResult = AsyncReturnType<typeof getAllPokemons>;

const Pokedex = ({ pokemon }: { pokemon: PokemonQueryResult }) => {
  const [state, dispatch] = useReducer(reducerFilters, initialFilters);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredData = pokemon.filter(
    (pokemon) =>
      pokemon.color.includes(state.filterByColor) &&
      pokemon.name.includes(state.search) &&
      pokemon.baseExperience >= state.minExperience &&
      pokemon.baseExperience <= state.maxExperience
  );

  const totalCount = filteredData?.length;
  const currentPage = state.page;
  const paginationRange = usePagination({
    totalCount,
    PAGE_SIZE,
    currentPage,
  })!;
  let lastPage = paginationRange?.[paginationRange?.length - 1] === state.page;
  const handleSearch = useMemo(
    () =>
      debounce(
        (e) =>
          dispatch({
            type: "useFilter",
            payload: { key: "search", value: e.target.value },
          }),
        350
      ),
    []
  );

  const handleRangeMin = useMemo(
    () =>
      debounce(
        (e) =>
          dispatch({
            type: "useFilter",
            payload: { key: "minExperience", value: e },
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
            type: "useFilter",
            payload: { key: "maxExperience", value: e },
          }),
        0
      ),
    []
  );
  const handleFilter = (value: string) => {
    dispatch({
      type: "useFilter",
      payload: { key: "filterByColor", value: value },
    });
  };
  const handleSorting = (value: string) => {
    dispatch({ type: "useFilter", payload: { key: "sort", value: value } });
  };

  return (
    <main className="mx-auto px-[2rem] lg:px-20 3xl:px-40 mt-10 sm:mt-20 pb-20">
      <div className="3xl:flex 3xl:gap-10 3xl:justify-between items-center">
        <div className="flex gap-10 items-center">
          <SelectInput
            state={state.sort}
            onChange={handleSorting}
            options={sortOptions}
            title="Sort by"
          />
          <SelectInput
            state={state.filterByColor}
            onChange={handleFilter}
            options={colorsOptions}
            title="Filter by"
          />
          <MultiRangeInput
            min={36}
            max={635}
            minVal={state.minExperience}
            maxVal={state.maxExperience}
            onChangeMin={handleRangeMin}
            onChangeMax={handleRangeMax}
          />
          <button
            type="button"
            className="h-10 px-6 bg-white text-black font-bold text-md leading-tight capitalize rounded-full shadow-md transition duration-150 ease-in-out focus:bg-neutral-300"
            onClick={() => dispatch({ type: "reset" })}
          >
            Reset all filters
          </button>
        </div>
        <SearchBar handleSearch={handleSearch} />
      </div>
      {filteredData && <PokemonListing data={filteredData} page={state.page} />}
      {paginationRange?.length < 2 || !paginationRange ? null : (
        <Pagination
          onArrowClick={(sign: number = 0) =>
            dispatch({ type: "changePage", page: state.page + sign })
          }
          onPageClick={(page: number) =>
            dispatch({ type: "changePage", page: page })
          }
          disabledPrev={state.page < 2}
          disabledNext={lastPage}
          paginationRange={paginationRange}
          currentPage={state.page}
        />
      )}
    </main>
  );
};

const PokemonListing = ({
  data,
  page,
}: {
  data: PokemonQueryResult;
  page: number;
}): JSX.Element => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,minmax(330px,_1fr))] md2:grid-cols-[repeat(auto-fill,minmax(380px,_1fr))] gap-10 mt-20">
      {data
        .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        .map((pokemon: any) => (
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
