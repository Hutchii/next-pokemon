import { inferQueryResponse } from "../pages/api/trpc/[trpc]";

export type PokemonFromServer = inferQueryResponse<"get-pokemon-pair">["firstPokemon"];
