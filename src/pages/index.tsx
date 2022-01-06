import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import type React from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";

const buttonClasses =
	"inline-flex items-center px-3 py-1.5 border border-gray-500 shadow-sm font-small rounded-full text-white bg-cyan-700 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
	const [ids, updateIds] = useState(() => getOptionsForVote());
	const [first, second] = ids;

	const firstPoke = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
	const secondPoke = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

	if (firstPoke.isLoading || secondPoke.isLoading) return null;

	const voteForCoolest = (selected: number) => {
		// fire mutation to persist changes

		updateIds(getOptionsForVote());
	};

	return (
		<div className="h-screen w-screen flex flex-col justify-center items-center">
			<div className="text-2xl text-center">Select the coolest pokémon</div>
			<div className="p-2" />
			<div className="border rounded p-8 flex justify-between items-center max-w-2xl">
				{!firstPoke.isLoading &&
					firstPoke.data &&
					!secondPoke.isLoading &&
					secondPoke.data && (
						<>
							<PokemonListing
								pokemon={firstPoke.data}
								vote={() => voteForCoolest(first)}
							/>
							<div className="p-6">VS</div>
							<PokemonListing
								pokemon={secondPoke.data}
								vote={() => voteForCoolest(second)}
							/>
						</>
					)}
			</div>
			<div className="p-2" />
		</div>
	);
}
type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{ pokemon: PokemonFromServer; vote: () => void }> = (
	props
) => {
	return (
		<div className="flex flex-col items-center">
			{/* <img src={props.pokemon.sprites.front_default} className="w-64 h-64" /> */}
			<div className="text-xl text-center capitalize mt-[-0.5rem]">
				{props.pokemon.name}
			</div>
			<button
				className={buttonClasses}
				onClick={() => {
					props.vote();
				}}
			>
				Cooler
			</button>
		</div>
	);
};
