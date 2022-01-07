export const MAX_DEX = 649;

export const getRandomPokemon: (notThisOne?: number) => number = (
	notThisOne?: number
) => {
	const pokedexNum = Math.floor(Math.random() * MAX_DEX) + 1;

	if (pokedexNum !== notThisOne) return pokedexNum;
	return getRandomPokemon(notThisOne);
};

export const getOptionsForVote = () => {
	const firstId = getRandomPokemon();
	const secondId = getRandomPokemon(firstId);

    return [firstId, secondId];
};
