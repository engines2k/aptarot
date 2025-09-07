<script lang="ts">
	import cardData from '$lib/card-data-2.json';
	import cardImagePaths from '$lib/card-image-paths.json';
	import CardInfo from './CardInfo.svelte';
	import CardCarousel from './CardCarousel.svelte';
    import { createCard } from '$lib/types';
	import type { Card } from '$lib/types';
	import "$/routes/cards.css";


	let selected = $state(-1);
	let activeCard = $state({ id: -1, name: "No card selected", image: "/cards/card.png" });
	let cardList = cardData.map(importCardData);
	let cards = $state(cardList);
	
	function changeCard(card: { name: string, image: string }, index: number) {
		activeCard = { ...card, id: index };
		selected = index;
	}

	function importCardData(cardData: any) {
		let card = createCard(cardData);
		addCardImage(card);
		return card;
	}

	function addCardImage(card: Card) {
		if(!card.image)
			card.image = (cardImagePaths as Record<string, string>)[card.name] || "/cards/card.png";
		return card
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<CardInfo card={activeCard}/>
	<CardCarousel 
	{cards}
	{activeCard}
	{selected}
	{changeCard}
	/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 90vh;
	}
</style>
