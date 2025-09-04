<script lang="ts">
	import cardData from '$lib/card-data-full.json';
	import CardInfo from './CardInfo.svelte';
	import CardCarousel from './CardCarousel.svelte';
    import { createCard } from '$lib/types';
	import type { Card } from '$lib/types';


	let selected = $state(-1);
	let activeCard = $state({ id: -1, name: "No card selected", image: "/cards/card.png" });
	let cardList = cardData.map((card) => createCard(card));
	let cards = $state(cardList);
	
	function changeCard(card: { name: string, image: string }, index: number) {
		activeCard = { ...card, id: index };
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
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 90vh;
	}

	/* Global CardInfo styles */
	:global(.tarot-title) {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 10px;
		color: #f3f4f6;
	}

	:global(.tarot-info) {
		margin: auto;
		max-width: 500px;
		text-align: left;
	}

	:global(.tarot-info-item) {
		font-size: .8rem;
		margin-bottom: 7px;
		color: #e5e7eb;
	}

	:global(.tarot-subheading) {
		font-weight: bold;
		color: #ffc4b2;
	}

	:global(.detail) {
		min-height: 450px;
		margin: 50px;
		position: relative;
		z-index: 1;
	}

	:global(.card-face) {
		width: 80%;
		image-rendering: pixelated;
	}
</style>
