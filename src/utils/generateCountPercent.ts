import { inferQueryResponse } from "../pages/api/trpc/[trpc]";

type PokemonFromServer = inferQueryResponse<"get-pokemon-pair">["firstPokemon"];

export const generateCountPercent = (pokemon: PokemonFromServer) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if (VoteFor + VoteAgainst === 0) return 0;
  return ((VoteFor / (VoteFor + VoteAgainst)) * 100).toFixed(2);
};
