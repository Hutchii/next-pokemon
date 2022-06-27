import type { NextPage } from "next";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import Image from "next/image";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import type React from "react";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="p-8 flex justify-between max-w-2xl items-center">
        {!firstPokemon.isLoading &&
          !secondPokemon.isLoading &&
          firstPokemon.data &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">Vs</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )}
      </div>
    </div>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

//Because of React.FC props.children exist, it`s a consequence of using React.FC, if we dont return JSX we get error.
const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = ({ pokemon, vote }) => {
  return (
    <div className="w-64 h-64 bg-blue-800 text-center">
      <Image
        src={pokemon.spriteUrl}
        // src={pokemon.spriteUrl as string}
        alt="Pokemon"
        width={256}
        height={256}
        layout="fixed"
      />
      <div className="capitalize pt-1">{pokemon.name}</div>
      <button
        className="bg-green-400 p-2 mt-2 text-black"
        onClick={() => vote()}
      >
        Rounder
      </button>
    </div>
  );
};
