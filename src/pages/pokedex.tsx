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
import SortOrder from "@/components/UI/SortOrder";

const pageSize = 10;

type DataQuery = AsyncReturnType<typeof getAllPokemons>;
type ComposeFns = ((d: DataQuery) => DataQuery)[];

const Pokedex = ({ pokemon }: { pokemon: DataQuery }) => {
  const [state, dispatch] = useReducer(reducerFilters, initialFilters);
  const searchRef = useRef<HTMLInputElement>(null);

  //Data filtering function:
  const filterData = () => {
    const composeData =
      (...fns: ComposeFns) =>
      (d: DataQuery) =>
        fns.reduce((acc, fn) => fn(acc), d);

    const filterByColor = (d: DataQuery) =>
      d.filter(({ color }) => color.includes(state.color));

    const searchResult = (d: DataQuery) =>
      d.filter(({ name }) => name.includes(state.search));

    const filterByExperience = (d: DataQuery) =>
      d.filter(
        ({ baseExperience }) =>
          baseExperience <= state.maxExperience &&
          baseExperience >= state.minExperience
      );

    const sortResult = (d: DataQuery) => {
      type key = keyof DataQuery[0];
      if (state.sort === "") return d;
      return d.sort((a, b) =>
        state.sortBy
          ? a[state.sort as key] > b[state.sort as key]
            ? 1
            : -1
          : a[state.sort as key] < b[state.sort as key]
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

  //Pagination variables:
  const totalCount = filteredData?.length;
  const currentPage = state.page;
  const pagination = usePagination({
    totalCount,
    pageSize,
    currentPage,
  });
  const lastPage = pagination?.at(-1) === state.page;

  //Dispatch update functions:
  const handleUseFilter = (value: string, key: string) =>
    dispatch({
      type: "useFilter",
      payload: { key: key, value: value },
    });

  const handleSearch = useMemo(
    () => debounce((value) => handleUseFilter(value, "search"), 350),
    []
  );

  const handleReset = () => {
    dispatch({ type: "reset" });
    if (searchRef.current) searchRef.current.value = "";
  };
  return (
    <main className="px-5 sm:px-10 2xl:px-20 4xl:px-40 mt-10 sm:mt-20 pb-20">
      <div className="3xl:flex 3xl:gap-10 3xl:justify-between items-end">
        {/* <div className="3xl:flex 3xl:gap-8 3xl:items-end"> */}
        <SelectInput
          title="Sort by"
          selected={state.sort}
          onChange={(value) => handleUseFilter(value, "sort")}
          options={sortOptions}
          defaultName="Default"
        >
          <SortOrder
            onChange={() => dispatch({ type: "sortBy" })}
            order={state.sortBy}
            disabled={state.sort}
          />
        </SelectInput>
        <SelectInput
          title="Filter by"
          selected={state.color}
          onChange={(value) => handleUseFilter(value, "color")}
          options={colorsOptions}
          defaultName="None"
        />
        <MultiRangeInput
          min={36}
          max={635}
          minVal={state.minExperience}
          maxVal={state.maxExperience}
          onChange={handleUseFilter}
        />
        <SearchBar handleSearch={handleSearch} searchRef={searchRef} />
        <button
          type="button"
          className="h-10 px-6 bg-white text-black font-bold text-md leading-tight rounded-full shadow-md mt-4"
          onClick={handleReset}
        >
          Reset all filters
        </button>
        {/* </div> */}
      </div>
      {filteredData && filteredData.length > 0 ? (
        <PokemonListing data={filteredData} currentPage={state.page} />
      ) : (
        <PokemonEmptyMessage />
      )}
      {!pagination || pagination.length < 2 ? null : (
        <Pagination
          onArrowClick={(sign: number = 0) =>
            dispatch({ type: "changePage", page: state.page + sign })
          }
          onPageClick={(page: number) =>
            dispatch({ type: "changePage", page: page })
          }
          lastPage={lastPage}
          paginationRange={pagination}
          currentPage={state.page}
        />
      )}
    </main>
  );
};

const PokemonListing = ({
  data,
  currentPage,
}: {
  data: DataQuery;
  currentPage: number;
}): JSX.Element => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,minmax(330px,_1fr))] 2xl:grid-cols-[repeat(auto-fill,minmax(380px,_1fr))] gap-10 3xl:gap-6 mt-20 sm:justify-center">
      {data
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        .map((pokemon) => (
          <div key={pokemon.id} className="">
            <div className="w-52 h-52 sm:w-64 sm:h-64 m-auto drop-shadow-[0_0_100px_#3700ffb9]">
              <PokemonImage image={pokemon.spriteUrl} />
            </div>
            <div className="bg-[#111111de] rounded-3xl pt-[92px] pb-8 -mt-20 px-6 font-semibold text-violet-100 w-full sm:w-[400px] md:w-full">
              <h1 className="text-center mb-6 capitalize text-3xl">
                {pokemon.name}
              </h1>
              <div className="text-lg flex justify-between items-center gap-4 w-full">
                <p>Percent:</p>
                <p className="text-gray-400">
                  {generateCountPercent(pokemon) + "%"}
                </p>
                <div className="relative w-32">
                  <div className="bg-gray-400 rounded-full w-full h-4" />
                  <div
                    className="absolute inset-0 bg-violet-100 rounded-full h-4"
                    style={{ width: `${+generateCountPercent(pokemon)}%` }}
                  />
                </div>
              </div>
              <div className="text-lg flex justify-between gap-4 mt-2">
                <p>Base experience:</p>
                <p>{pokemon.baseExperience}</p>
              </div>
              <div className="text-lg flex justify-between gap-4 mt-2">
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
