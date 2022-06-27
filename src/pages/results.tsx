import type { GetStaticProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/backend/utils/ts-bs";
import Image from "next/image";

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (
  props
) => {
  return (
    <div className="flex border-b p-2 items-center">
      <Image
        src={props.pokemon.spriteUrl}
        alt="Pokemon"
        layout="fixed"
        width={64}
        height={64}
      />
      <div className="capitalize">{props.pokemon.name}</div>
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
        {props.pokemon.map((p) => (
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
