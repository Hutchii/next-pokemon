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

type PokemonQuery = AsyncReturnType<typeof getAllPokemons>;

const Pokedex = ({ pokemon }: { pokemon: PokemonQuery }) => {
  const [state, dispatch] = useReducer(reducerFilters, initialFilters);
  const searchRef = useRef<HTMLInputElement>(null);

  const filterData = () => {
    const composeData =
      (...fns: ((d: PokemonQuery) => PokemonQuery)[]) =>
      (data: PokemonQuery) =>
        fns.reduce((acc, fn) => fn(acc), data);

    const filterByColor = (d: PokemonQuery) =>
      d.filter(({ color }) => color.includes(state.color));

    const searchResult = (d: PokemonQuery) =>
      d.filter(({ name }) => name.includes(state.search));

    const filterByExperience = (d: PokemonQuery) =>
      d.filter(
        ({ baseExperience }) =>
          baseExperience <= state.maxExperience &&
          baseExperience >= state.minExperience
      );

    const sortResult = (d: PokemonQuery) => {
      if (state.sort === "") return d;
      return d.sort((a, b) =>
        a[state.sort as keyof PokemonQuery[0]] >
        b[state.sort as keyof PokemonQuery[0]]
          ? 1
          : -1
      );
    };

    return composeData(
      filterByColor,
      searchResult,
      filterByExperience,
      sortResult
    )(pokemon);
  };

  const filteredData = filterData();
  // const filteredData = pokemon
  //   .filter(
  //     (pokemon) =>
  //       pokemon.color.includes(state.color === "" ? "" : state.color) &&
  //       pokemon.name.includes(state.search) &&
  //       pokemon.baseExperience >= state.minExperience &&
  //       pokemon.baseExperience <= state.maxExperience
  //   )
  //   .sort((a, b) => {
  //     if (state.sort === "") return;
  //     return a[state.sort] > b[state.sort] ? 1 : -1;
  //   });

  const totalCount = filteredData?.length;
  const currentPage = state.page;
  const paginationRange = usePagination({
    totalCount,
    PAGE_SIZE,
    currentPage,
  });
  const lastPage =
    paginationRange?.[paginationRange?.length - 1] === state.page;

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

  const handleMultiRangeInput = (e: number, key: string) =>
    dispatch({
      type: "useFilter",
      payload: { key: key, value: e },
    });

  const handleSortSelectInput = (value: string, key: string) =>
    dispatch({ type: "useFilter", payload: { key: key, value: value } });

  const handleResetButton = () => {
    dispatch({ type: "reset" });
    if (searchRef.current) searchRef.current.value = "";
  };

  return (
    <main className="mx-auto px-[2rem] lg:px-20 3xl:px-40 mt-10 sm:mt-20 pb-20">
      <div className="3xl:flex 3xl:gap-10 3xl:justify-between items-center">
        <div className="flex gap-10 items-center">
          <SelectInput
            title="Sort by"
            selected={state.sort}
            onChange={(e) => handleSortSelectInput(e, "sort")}
            options={sortOptions}
            firstValue="Default"
          />
          <SelectInput
            title="Filter by"
            selected={state.color}
            onChange={(e) => handleSortSelectInput(e, "color")}
            options={colorsOptions}
            firstValue="None"
          />
          <MultiRangeInput
            min={36}
            max={635}
            minVal={state.minExperience}
            maxVal={state.maxExperience}
            onChange={handleMultiRangeInput}
          />
          <button
            type="button"
            className="h-10 px-6 bg-white text-black font-bold text-md leading-tight rounded-full shadow-md"
            onClick={handleResetButton}
          >
            Reset all filters
          </button>
        </div>
        <SearchBar handleSearch={handleSearch} searchRef={searchRef} />
      </div>
      {filteredData && filteredData.length > 0 ? (
        <PokemonListing data={filteredData} page={state.page} />
      ) : (
        <PokemonEmptyMessage />
      )}
      {!paginationRange || paginationRange.length < 2 ? null : (
        <Pagination
          onArrowClick={(sign: number = 0) =>
            dispatch({ type: "changePage", page: state.page + sign })
          }
          onPageClick={(page: number) =>
            dispatch({ type: "changePage", page: page })
          }
          lastPage={lastPage}
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
  data: PokemonQuery;
  page: number;
}): JSX.Element => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,minmax(330px,_1fr))] md2:grid-cols-[repeat(auto-fill,minmax(380px,_1fr))] gap-10 mt-20">
      {data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((pokemon) => (
        <div key={pokemon.id} className="flex flex-col items-center">
          <div className="h-52 sm:h-64 drop-shadow-[0_0_100px_#3700ffb9] z-10">
            <PokemonImage image={pokemon.spriteUrl} />
          </div>
          <div className="bg-[#111111de] rounded-3xl h-72 -mt-20 px-6 font-semibold text-violet-100 w-full">
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

const PokemonEmptyMessage = () => {
  return (
    <div className="mt-20 flex flex-col items-center justify-center min-h-[600px] animate-fade-in">
      <p className="text-4xl font-medium">No results found</p>
      <p className="text-xl mt-2 font-normal">
        We couldn`t find what you are looking for
      </p>
    </div>
  );
};

const getAllPokemons = async () => {
  return await prisma.pokemon.findMany({
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
