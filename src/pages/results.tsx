import { GetServerSideProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import React from "react";
import { AsyncReturnType } from "@/utils/ts-bs";
import Image from "next/image";

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (
	props
) => {
	return (
		<div className="flex">
			<Image
				src={props.pokemon.spriteUrl}
				alt=""
				width={256}
				height={256}
				layout="fixed"
			/>
		</div>
	);
};

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

export const getServerSideProps: GetServerSideProps = async (props) => {
	const pokemonOrdered = await getPokemonInOrder();
	return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};

const ResultsPage: React.FC<{
	pokemon: PokemonQueryResult;
}> = (props) => {
	return (
		<div className="flex flex-col">
			<h2>Results</h2>
			{props.pokemon.map((currentPokemon, index) => {
				return <PokemonListing pokemon={currentPokemon} key={index} />;
			})}
		</div>
	);
};

export default ResultsPage;
