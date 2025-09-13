<script lang="ts">
	import cardData from '$lib/card-data-2.json';
	import cardImagePaths from '$lib/card-image-paths.json';
	import CardInfo from '$/components/CardInfo.svelte';
	import CardCarousel from '$/components/CardCarousel.svelte';
    import { createCard } from '$lib/Cards';
	import type { Card } from '$lib/Cards';
	import "$/cards.css";

	let noCard = $state(createCard({ id: -1, name: "No card selected", image: "/cards/card.png" }));
	let selected = $state(-1);
	let activeCard = $state(noCard);
	let cardList = cardData.map(importCardData);
	let cards = $state(cardList);
	
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

	function changeCard(card: Card, index: number) {
		activeCard = card;
		selected = index;
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
