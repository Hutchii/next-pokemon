import type { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import type React from "react";
import Background from "@/components/UI/Background";
import { useState } from "react";

const Home: NextPage = () => {
  const {
    data: pokemonPair,
    refetch,
    isLoading,
  } = trpc.useQuery(["get-pokemon-pair"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
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
    <main className="relative h-screen w-screen flex flex-col justify-center items-center">
      <Background />
      <div className="text-[50px] text-center z-10 mb-10 font-bold">Which <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">pokemon</span> wins?</div>
      <div className="p-2"></div>
      {pokemonPair && (
        <div className="p-8 flex justify-between items-center z-10 animate-fade-in">
          <PokemonListing
            pokemon={pokemonPair?.firstPokemon}
            vote={() => voteForRoundest(pokemonPair.secondPokemon.id)}
            even={true}
            disabled={fetchingNext}
          />
          <div className="p-8 font-semibold text-2xl mt-20">vs</div>
          <PokemonListing
            pokemon={pokemonPair?.secondPokemon}
            vote={() => voteForRoundest(pokemonPair?.secondPokemon.id)}
            even={false}
            disabled={fetchingNext}
          />
        </div>
      )}
      {/* {!pokemonPair && (
        <Image src="/svg/spinner.svg" width={100} height={100} alt="Spinner" />
      )} */}
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
  const generateCountPercent = (pokemon: PokemonFromServer) => {
    const { VoteFor, VoteAgainst } = pokemon._count;
    if (VoteFor + VoteAgainst === 0) return 0;
    return ((VoteFor / (VoteFor + VoteAgainst)) * 100).toFixed(2);
  };
  return (
    <div className={`text-center w-[400px]`} key={pokemon.id}>
      <div
        className={`w-64 h-64 m-auto ${
          even
            ? "drop-shadow-[0_0_100px_#3700ffb9]"
            : "drop-shadow-[0_0_100px_#8400ff90]"
        }`}
      >
        <PokemonImage image={pokemon.spriteUrl} />
      </div>
      <div className="bg-[#111111de] rounded-3xl h-[280px] mt-[-80px] px-6 font-semibold text-white">
        <div>
          <h1 className="pt-[85px] capitalize text-3xl mb-6">{pokemon.name}</h1>
          <div className="text-lg flex justify-between items-center">
            <p>Percent:</p>
            <p className="text-gray-400 animate-fade-in">
              {generateCountPercent(pokemon) + "%"}
            </p>
            <div className="relative w-40 h-4">
              <div className="bg-gray-500 rounded-full w-40 h-4"></div>
              <div
                className="animate-fade-in absolute inset-0 bg-white rounded-full h-4 z-10"
                style={{ width: `${+generateCountPercent(pokemon)}%` }}
              ></div>
            </div>
          </div>
          <button
            className="py-2 mt-8 text-white font-semibold text-md rounded-full bg-transparent px-6 border-white border-[1px] transition-colors"
            onClick={() => vote()}
            disabled={disabled}
          >
            Cast your vote
          </button>
        </div>
      </div>
    </div>
  );
};

const PokemonImage = ({ image }: { image: string }): JSX.Element => {
  const [startAnimation, setStartAnimation] = useState(false);
  return (
    <Image
      src={image}
      alt="Pokemon"
      width={256}
      height={256}
      layout="fixed"
      quality={90}
      className={`opacity-0 ${startAnimation && "animate-fade-in"}`}
      onLoadingComplete={() => setStartAnimation(true)}
    />
  );
};
