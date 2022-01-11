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
	props
) => {
	return (
		<div className="flex border-b items-center">
			<Image
				src={props.pokemon.spriteUrl}
				alt=""
				width={128}
				height={128}
				layout="fixed"
			/>
			<div className="p-2" />
			<div className="capitalize text-lg">{props.pokemon.name}</div>
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
