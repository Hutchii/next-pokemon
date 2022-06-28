import type { NextPage } from "next";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import Image from "next/image";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import type React from "react";
import { AsyncReturnType } from "@/backend/utils/ts-bs";
import { Transition } from "@headlessui/react";
import Fade from "@/utils/animate";

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

  const dataLoaded = Boolean(
    !firstPokemon.isLoading &&
      firstPokemon.data &&
      !secondPokemon.isLoading &&
      secondPokemon.data
  );

  return (
    <div className="relative h-screen w-screen flex flex-col justify-center items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-rose-600 " />
      <div className="pointer-events-none absolute inset-0 bg-radial-content-shadow" />
      <div className="bg-[url('/svg/bg.svg')] pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-900 via-[#18181800] to-gray-900" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gray-900 via-[#18181800] to-gray-900" />
      <div className="text-2xl text-center">Which pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="p-8 flex justify-between items-center z-10">
        <PokemonListing
          pokemon={firstPokemon.data}
          vote={() => voteForRoundest(first)}
          even={true}
          isLoading={firstPokemon.isLoading}
        />
        <div className="p-8 font-semibold text-2xl mt-20">vs</div>
        <PokemonListing
          pokemon={secondPokemon.data}
          vote={() => voteForRoundest(second)}
          even={false}
          isLoading={secondPokemon.isLoading}
        />
      </div>
    </div>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

//Because of React.FC props.children exist, it`s a consequence of using React.FC, if we don`t return JSX we get error.
const PokemonListing: React.FC<{
  pokemon: PokemonFromServer | undefined;
  vote: () => void;
  even: boolean;
  isLoading: boolean;
}> = ({ pokemon, vote, even, isLoading }) => {
  const loaded = !isLoading && pokemon;

  const generateCountPercent = (pokemon: PokemonFromServer) => {
    const { VoteFor, VoteAgainst } = pokemon._count;
    if (VoteFor + VoteAgainst === 0) return 0;
    return ((VoteFor / (VoteFor + VoteAgainst)) * 100).toFixed(2);
  };
  return (
    <div className="text-center w-[400px]">
      <div
        className={`w-64 h-64 m-auto ${
          even
            ? "drop-shadow-[0_0_100px_#3700ffb9]"
            : "drop-shadow-[0_0_100px_#8400ff90]"
        }`}
      >
        {!loaded ? (
          <Image
            src={pokemon.spriteUrl}
            alt="Pokemon"
            width={256}
            height={256}
            layout="fixed"
            quality={90}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Image
              src="/svg/spinner.svg"
              alt="Spinner"
              width={64}
              height={64}
            />
          </div>
        )}
      </div>
      <div className="bg-[#111111de] rounded-3xl h-[300px] mt-[-80px] px-6 font-semibold text-white">
        {loaded && (
          <>
            <h1 className="pt-[75px] capitalize text-3xl mb-6">
              {pokemon.name}
            </h1>
            <div className="text-lg flex justify-between items-center">
              <p>Percent:</p>
              <p className="text-gray-400">
                {generateCountPercent(pokemon) + "%"}
              </p>
              <div className="relative w-40 h-4">
                <div className="bg-gray-500 rounded-full w-40 h-4"></div>
                <div
                  className="absolute inset-0 bg-white rounded-full h-4 z-10"
                  style={{ width: `${+generateCountPercent(pokemon)}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
      <button
        className="p-2 mt-5 text-white font-semibold text-lg rounded-full bg-transparent px-6 border"
        onClick={() => vote()}
      >
        Cast your vote
      </button>
    </div>
  );
};

const PokemonPlaceholder = () => {
  return <div className="text-center w-[400px] text-white z-10">asdasd</div>;
};

{
  /* <Image src="/svg/spinner.svg" alt="Spinner" width={80} height={80} /> */
}
