import type { NextPage } from "next";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import Image from "next/image";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

  const voteForRoundest = (selected: number) => {
    updateIds(getOptionsForVote());
  };

  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return null;
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="p-8 flex justify-between max-w-2xl items-center">
        <div className="w-64 h-64 bg-blue-800 text-center">
          <Image src={firstPokemon.data?.sprites.front_default}
            alt="First pokemon"
            className="w-full"
            width={256}
            height={256}
          />

          <div className="capitalize pt-1">{firstPokemon.data?.name}</div>
          <button
            className="bg-green-400 p-2 mt-2 text-black"
            onClick={() => voteForRoundest(first)}
          >
            Rounder
          </button>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 bg-blue-800 text-center">
          <Image src={secondPokemon.data?.sprites.front_default}
            alt="second pokemon"
            className="w-full"
            width={256}
            height={256}
          />
          <div className="capitalize pt-1">{secondPokemon.data?.name}</div>
          <button
            className="bg-green-400 p-2 mt-2 text-black"
            onClick={() => voteForRoundest(second)}
          >
            Rounder
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
