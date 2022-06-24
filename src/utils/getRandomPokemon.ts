const MAX_DEX_ID = 493;

export const getRandomPokemon = (notThisOne?: number): number => {
  const pokedexNumber = Math.floor(Math.random() * MAX_DEX_ID) + 1;

  if (pokedexNumber !== notThisOne) return pokedexNumber;
  return getRandomPokemon(notThisOne);
};

export const getOptionsForVote = () => {
  const getFirstId = getRandomPokemon();
  const getSecondId = getRandomPokemon(getFirstId);

  return [getFirstId, getSecondId];
};

// export const getRandomPokemon: (notThisOne?: number) => number = (notThisOne?: number) => {
//   const pokedexNumber = Math.floor(Math.random() * MAX_DEX_ID + 1);

//   if (pokedexNumber !== notThisOne) return pokedexNumber;
//   return getRandomPokemon(notThisOne);
// };

// export const getRandomPokemon = (notThisOne?: number): ((notThisOne?: number) => number) | number => {
//   const pokedexNumber = Math.floor(Math.random() * MAX_DEX_ID + 1);

//   if (pokedexNumber !== notThisOne) return pokedexNumber;
//   return getRandomPokemon(notThisOne);
// };

// const test = (title: number): number => title;

// function getFavoriteNumber(): number {
//   return 26;
// }

// let add: (x: number, y: number) => number;

// let remove: Function;
