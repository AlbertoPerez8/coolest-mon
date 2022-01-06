import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

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
				<div className="w-64 h-64 flex flex-col items-center">
					{/* <img
						src={firstPoke.data?.sprites.front_default}
						className="w-full"
					/> */}
					<div className="text-xl text-center capitalize mt-[-2rem]">
						{firstPoke.data?.name}
					</div>
					<button
						className={buttonClasses}
						onClick={() => {
							voteForCoolest(first);
						}}
					>
						Cooler
					</button>
				</div>

				<div className="p-6">VS</div>

				<div className="w-64 h-64 flex flex-col items-center">
					{/* <img
						src={secondPoke.data?.sprites.front_default}
						className="w-full"
					/> */}
					<div className="text-xl text-center capitalize mt-[-2rem]">
						{secondPoke.data?.name}
					</div>
					<button
						className={buttonClasses}
						onClick={() => {
							voteForCoolest(second);
						}}
					>
						Cooler
					</button>
				</div>
			</div>
			<div className="p-2" />
		</div>
	);
}
