import type { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import type React from "react";
import PokemonImage from "@/components/UI/PokemonImage";
import { generateCountPercent } from "@/utils/generateCountPercent";
import { PokemonFromServer } from "@/types/PokemonFromServer";

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
    if (selected === pokemonPair.firstPokemon.id) {
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
    <main className="text-center sm:flex sm:flex-col sm:justify-center sm:items-center min-h-[calc(100vh-10rem)] px-[2rem] pb-20">
      {pokemonPair ? (
        <>
          <h1 className="leading-normal	mt-10 sm:mt-20 lg:mt-0 text-3xl sm:text-4xl lg:text-5xl mb-8 lg:mb-20 font-bold animate-fade-in">
            Which
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
              {" "}
              pokemon
            </span>{" "}
            wins?
          </h1>
          <div className="lg:flex lg:justify-between lg:items-center animate-fade-in">
            <PokemonListing
              pokemon={pokemonPair.firstPokemon}
              vote={() => voteForRoundest(pokemonPair.firstPokemon.id)}
              shadowColor="blue"
              disabled={fetchingNext}
            />
            <div className="p-6 xl:p-8 font-semibold text-2xl lg:mt-40">vs</div>
            <PokemonListing
              pokemon={pokemonPair.secondPokemon}
              vote={() => voteForRoundest(pokemonPair.secondPokemon.id)}
              shadowColor="violet"
              disabled={fetchingNext}
            />
          </div>
        </>
      ) : (
        <Image src="/svg/spinner.svg" width={100} height={100} alt="Loading" />
      )}
    </main>
  );
};

export default Home;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
  shadowColor: string;
  disabled: boolean;
}> = ({ pokemon, vote, shadowColor, disabled }) => {
  const pokemonCountPercent = generateCountPercent(pokemon).toFixed(2);

  return (
    <div key={pokemon.id}>
      <div
        className={`w-52 h-52 sm:w-64 sm:h-64 m-auto ${
          shadowColor === "blue"
            ? "drop-shadow-[0_0_100px_#3700ffb9]"
            : "drop-shadow-[0_0_100px_#8400ff90]"
        }`}
      >
        <PokemonImage image={pokemon.spriteUrl} />
      </div>
      <div className="bg-[#111111de] pt-[92px] pb-10 rounded-3xl -mt-20 px-6 font-semibold text-violet-100 sm:w-[400px]">
        <h1 className="capitalize text-3xl mb-6 animate-fade-in">
          {pokemon.name}
        </h1>
        <div className="text-lg flex justify-between items-center gap-4">
          <p>Percent:</p>
          <p className="text-gray-400 animate-fade-in">
            {pokemonCountPercent + "%"}
          </p>
          <div className="relative w-32">
            <div className="bg-gray-400 rounded-full w-full h-4" />
            <div
              className="animate-fade-in absolute inset-0 bg-violet-100 rounded-full h-4"
              style={{ width: `${+pokemonCountPercent}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          className="mt-8 px-6 py-[9px] bg-violet-100 text-gray-900 font-bold text-md capitalize rounded-full shadow-md transition duration-150 ease-in-out focus:bg-violet-200"
          onClick={() => vote()}
          disabled={disabled}
        >
          Cast your vote
        </button>
      </div>
    </div>
  );
};
