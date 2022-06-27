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

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex border-b p-2 items-center">
      <Image
        src={pokemon.spriteUrl}
        alt="Pokemon"
        layout="fixed"
        width={64}
        height={64}
      />
      <div className="capitalize">{pokemon.name}</div>
      <div className="capitalize">{generateCountPercent(pokemon).toFixed(2) + "%"}</div>
    </div>
  );
};

const Results: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl p-4">Results:</h1>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon
          .sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
          .map((p) => (
            <PokemonListing pokemon={p} key={p.id} />
          ))}
      </div>
    </div>
  );
};

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: { VoteFor: { _count: "desc" } },
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
  });
};

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};

export default Results;
