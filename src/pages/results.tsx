import { GetServerSideProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import React from "react";
import { AsyncReturnType } from "@/utils/ts-bs";
import Image from "next/image";

const getPokemonInOrder = async () => {
	return prisma.pokemon.findMany({
		orderBy: { VotesFor: { _count: "desc" } },
		select: {
			id: true,
			name: true,
			spriteUrl: true,
			_count: {
				select: {
					VotesFor: true,
					VotesAgainst: true,
				},
			},
		},
	});
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
	const { VotesFor, VotesAgainst } = pokemon._count;

	if (VotesFor + VotesAgainst === 0) return 0;

	return (VotesFor / (VotesAgainst + VotesFor)) * 100;
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
	pokemon,
}) => {
	return (
		<div className="flex border-b items-center justify-between">
			<div className="flex items-center">
				<Image
					src={pokemon.spriteUrl}
					alt=""
					width={64}
					height={64}
					layout="fixed"
				/>
				<div className="p-2" />
				<div className="capitalize ">{pokemon.name}</div>
			</div>
			<div className="pr-1">{generateCountPercent(pokemon).toFixed(2) + "%"}</div>
		</div>
	);
};

const ResultsPage: React.FC<{
	pokemon: PokemonQueryResult;
}> = (props) => {
	return (
		<div className="flex flex-col items-center">
			<h2 className="text-2xl p-4">Results</h2>
			<div className="flex flex-col w-full max-w-2xl border">
				{props.pokemon.map((currentPokemon, index) => {
					return <PokemonListing pokemon={currentPokemon} key={index} />;
				})}
			</div>
		</div>
	);
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
	const pokemonOrdered = await getPokemonInOrder();
	return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};
