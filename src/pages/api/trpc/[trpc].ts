import { appRouter, AppRouter } from "@/backend/router";
import { inferProcedureOutput } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

//API Endpoint
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

//Infer helper that will get out of AppRouter the type of a specifing thing that we are doing
export type inferQueryResponse<
  TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>;
