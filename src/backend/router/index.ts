import { getOptionsForVote } from "@/utils/getRandomPokemon";
import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-pokemon-pair", {
    async resolve() {
      const [first, second] = getOptionsForVote();
      const bothPokemon = await prisma.pokemon.findMany({
        where: { id: { in: [first, second] } },
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
      if (bothPokemon.length !== 2) throw new Error("Pokemon not found");
      return { firstPokemon: bothPokemon[0], secondPokemon: bothPokemon[1] };
    },
  })
  .mutation("cast-vote", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          ...input,
        },
      });
      return { success: true, vote: voteInDb };
    },
  })
  .query("filter-pokemon", {
    input: z.object({
      color: z.string(),
      search: z.string(),
      range: z.number(),
    }),
    async resolve({ input }) {
      const filteredPokemon = await prisma.pokemon.findMany({
        where: {
          name: { contains: input.search },
          id: { lte: input.range },
          color: { contains: input.color },
        },
        select: {
          id: true,
          name: true,
          spriteUrl: true,
          color: true,
          baseExperience: true,
          _count: {
            select: {
              VoteFor: true,
              VoteAgainst: true,
            },
          },
        },
      });
      if (!filteredPokemon) throw new Error("No results!");
      return filteredPokemon;
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
