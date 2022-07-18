import { PokemonFromServer } from "@/types/PokemonFromServer";

export const generateCountPercent = (pokemon: PokemonFromServer) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if (VoteFor + VoteAgainst === 0) return 0;
  return ((VoteFor / (VoteFor + VoteAgainst)) * 100);
};
