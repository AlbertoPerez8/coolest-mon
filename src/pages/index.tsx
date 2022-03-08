import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import type React from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import Image from "next/image";
import Link from "next/link";

const buttonClasses =
	"inline-flex items-center px-3 py-1.5 border border-gray-500 shadow-sm font-small rounded-full text-white bg-cyan-700 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
	const [ids, updateIds] = useState(() => getOptionsForVote());
	const [first, second] = ids;

	const firstPoke = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
	const secondPoke = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

	const voteMutate = trpc.useMutation(["cast-vote"]);

	if (firstPoke.isLoading || secondPoke.isLoading) return null;

	const voteForCoolest = (selected: number) => {
		// fire mutation to persist changes
		if (selected === first) {
			voteMutate.mutate({
				voteFor: first,
				votedAgainst: second,
			});
		}
		voteMutate.mutate({
			voteFor: second,
			votedAgainst: first,
		});
		updateIds(getOptionsForVote());
	};

	return (
		<div className="h-screen w-screen flex flex-col justify-between items-center">
			<div className="text-2xl text-center pt-8">
				Select the coolest pokémon
			</div>
			{!firstPoke.isLoading &&
				firstPoke.data &&
				!secondPoke.isLoading &&
				secondPoke.data && (
					<div className="border rounded p-8 flex justify-between items-center max-w-2xl">
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
						<div className="p-2" />
					</div>
				)}

			{!(
				!firstPoke.isLoading &&
				firstPoke.data &&
				!secondPoke.isLoading &&
				secondPoke.data
			) 
			 && <Image src="../../public/puff.svg" alt="" width={40} height={40} />}

			<div className=" w-full text-xl text-center pb-2">
				<a href="https://github.com/AlbertoPerez8/coolest-mon">
					Github Page
				</a>
				{" | "}
				<Link href="/results">Results</Link>
			</div>
		</div>
	);
}
type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
	pokemon: PokemonFromServer;
	vote: () => void;
}> = (props) => {
	return (
		<div className="flex flex-col items-center">
			<Image src={props.pokemon.spriteUrl} alt="" width={256} height={256} />
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
