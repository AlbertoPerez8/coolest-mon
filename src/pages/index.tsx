import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function Home() {
	const [ids, updateIds] = useState(() => getOptionsForVote());
	const [first, second] = ids;

	const firstPoke = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
	const secondPoke = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

	if (firstPoke.isLoading || secondPoke.isLoading) return null;

	return (
		<div className="h-screen w-screen flex flex-col justify-center items-center">
			<div className="text-2xl text-center">Select the coolest pokémon</div>
			<div className="p-2" />
			<div className="border rounded p-8 flex justify-between items-center max-w-2xl">
				<div className="w-64 h-64 flex flex-col">
					<img
						src={firstPoke.data?.sprites.front_default}
						className="w-full"
					/>
					<div className="text-xl text-center capitalize mt-[-2rem]">
						{firstPoke.data?.name}
					</div>
				</div>
				<div className="p-6">VS</div>
				<div className="w-64 h-64 flex flex-col">
					<img
						src={secondPoke.data?.sprites.front_default}
						className="w-full"
					/>
					<div className="text-xl text-center capitalize mt-[-2rem]">
						{secondPoke.data?.name}
					</div>
				</div>
			</div>
			<div className="p-2" />
		</div>
	);
}
