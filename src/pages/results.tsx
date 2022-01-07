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

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (
	{pokemon}
) => {
	return (
		<div className="flex">
			<Image
				src={pokemon.spriteUrl}
				alt=""
				width={256}
				height={256}
				layout="fixed"
			/>
		</div>
	);
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


export const getStaticProps: GetServerSideProps = async () => {
	const pokemonOrdered = await getPokemonInOrder();
	return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};
