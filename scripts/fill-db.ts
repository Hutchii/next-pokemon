import { PokemonClient } from "pokenode-ts";
import { prisma } from "../src/backend/utils/prisma";
import fetch from "node-fetch";

const doBackfill = async () => {
  const pokeApi = new PokemonClient();
  const allPokemon = await pokeApi.listPokemons(0, 493);

  let results = [];
  for (let i = 0; i < allPokemon.results.length; i++) {
    const details = await pokeApi.getPokemonByName(allPokemon.results[i].name);
    const color: any = await (await fetch(details.species.url)).json();
    results.push({
      id: i + 1,
      name: allPokemon.results[i].name,
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        i + 1
      }.png`,
      baseExperience: details.base_experience,
      color: color.color.name,
    });
  }

  const creation = await prisma.pokemon.createMany({
    data: results,
  });

  console.log("Creation:", creation);
};

doBackfill();
