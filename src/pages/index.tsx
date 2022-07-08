import type { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import type React from "react";
import PokemonImage from "@/components/UI/PokemonImage";
import { generateCountPercent } from "@/utils/generateCountPercent";

const Home: NextPage = () => {
  const {
    data: pokemonPair,
    refetch,
    isLoading,
  } = trpc.useQuery(["get-pokemon-pair"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (!pokemonPair) return;
    if (selected === pokemonPair?.firstPokemon.id) {
      voteMutation.mutate({
        votedFor: pokemonPair.firstPokemon.id,
        votedAgainst: pokemonPair.secondPokemon.id,
      });
    } else {
      voteMutation.mutate({
        votedFor: pokemonPair.secondPokemon.id,
        votedAgainst: pokemonPair.firstPokemon.id,
      });
    }
    refetch();
  };

  const fetchingNext = voteMutation.isLoading || isLoading;
  return (
    <main className="text-center flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-[2rem] mx-auto pb-20">
      {pokemonPair && (
        <>
          <h1 className="mt-10 text-3xl sm:mt-20 sm:text-4xl lg:text-5xl mb-8 lg:mb-20 font-bold animate-fade-in">
            Which
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
              {" "}
              pokemon
            </span>{" "}
            wins?
          </h1>
          <div className="w-full sm:w-[unset] lg:flex lg:justify-between lg:items-center animate-fade-in">
            <PokemonListing
              pokemon={pokemonPair?.firstPokemon}
              vote={() => voteForRoundest(pokemonPair.secondPokemon.id)}
              even={true}
              disabled={fetchingNext}
            />
            <p className="p-8 font-semibold text-2xl lg:mt-40">vs</p>
            <PokemonListing
              pokemon={pokemonPair?.secondPokemon}
              vote={() => voteForRoundest(pokemonPair?.secondPokemon.id)}
              even={false}
              disabled={fetchingNext}
            />
          </div>
        </>
      )}
      {!pokemonPair && (
        <Image src="/svg/spinner.svg" width={100} height={100} alt="Spinner" />
      )}
    </main>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<"get-pokemon-pair">["firstPokemon"];

//Because of React.FC props.children exist, it`s a consequence of using React.FC, if we don`t return JSX we get error.
const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
  even: boolean;
  disabled: boolean;
}> = ({ pokemon, vote, even, disabled }) => {
  return (
    <div key={pokemon.id}>
      <div
        className={`w-52 h-52 sm:w-64 sm:h-64 m-auto ${
          even
            ? "drop-shadow-[0_0_100px_#3700ffb9]"
            : "drop-shadow-[0_0_100px_#8400ff90]"
        }`}
      >
        <PokemonImage image={pokemon.spriteUrl} />
      </div>
      <div className="bg-[#111111de] rounded-3xl h-72 -mt-20 px-6 font-semibold text-violet-100 sm:w-[400px]">
        <h1 className="pt-24 capitalize text-3xl mb-6 animate-fade-in">
          {pokemon.name}
        </h1>
        <div className="text-lg flex justify-between items-center gap-4">
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
        <button
          className="py-2 px-6 mt-8 text-md rounded-full bg-transparent border-violet-100 border-[1px] focus:outline-none focus:ring-1 focus:ring-violet-200"
          onClick={() => vote()}
          disabled={disabled}
        >
          Cast your vote
        </button>
      </div>
    </div>
  );
};
