import * as trpc from "@trpc/server";
import { z } from "zod";

import { prisma } from "../utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-pokemon-by-id", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const pokemon = await prisma.pokemon.findFirst({
        where: { id: input.id },
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
      if (!pokemon) throw new Error("Pokemon not found");
      return pokemon;
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
  });

// export type definition of API
export type AppRouter = typeof appRouter;
