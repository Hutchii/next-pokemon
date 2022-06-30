import type { GetStaticProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/backend/utils/ts-bs";
import Image from "next/image";

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if (VoteFor + VoteAgainst === 0) return 0;
  return (VoteFor / (VoteFor + VoteAgainst)) * 100;
};

const PokemonListing: React.FC<{
  pokemon: PokemonQueryResult[number];
  place: number;
}> = ({ pokemon, place }) => {
  return (
    <div className="flex border-b border-violet-400 border-opacity-20 p-2 items-center justify-between text-xl text-violet-100">
      <div className="flex items-center gap-4 drop-shadow-[0_0_100px_#3700ffb9]">
        <p className="text-gray-100 bg-gradient-to-r from-indigo-800 to-violet-800 w-7 h-7 flex items-center justify-center text-base">{place}</p>
        <Image
          src={pokemon.spriteUrl}
          alt="Pokemon"
          layout="fixed"
          width={64}
          height={64}
        />
        <p className="capitalize">{pokemon.name}</p>
      </div>
      <p className="capitalize text-gray-400 drop-shadow-[0_0_100px_#8400ffd6]">
        {generateCountPercent(pokemon).toFixed(2) + "%"}
      </p>
    </div>
  );
};

const Results: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <main className="flex flex-col items-center">
      <h1 className="mt-10 text-3xl sm:mt-20 sm:text-4xl lg:text-5xl mb-8 lg:mb-12 font-bold animate-fade-in">
        Voting
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
          {" "}
          results
        </span>
      </h1>
      <div className="bg-[#111111de] rounded-3xl w-full max-w-2xl font-semibold text-violet px-4 py-2 animate-fade-in">
        {props.pokemon
          .sort((a, b) => {
            const difference =
              generateCountPercent(b) - generateCountPercent(a);

            if (difference === 0) {
              return b._count.VoteFor - a._count.VoteFor;
            }

            return difference;
          })
          .map((p, index) => (
            <PokemonListing pokemon={p} key={p.id} place={index + 1} />
          ))
          .slice(0, 20)}
      </div>
    </main>
  );
};

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
    orderBy: { VoteFor: { _count: "desc" } },
  });
};

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};

export default Results;
