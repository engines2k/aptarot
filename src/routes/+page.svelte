<script lang="ts">
	import cardData from '$lib/card-data-full.json';
	import CardInfo from './CardInfo.svelte';
	import CardCarousel from './CardCarousel.svelte';

	let selected = $state(-1);
	let activeCard = $state({ id: -1, name: "No card selected", image: "/cards/card.png" });
	let cards = $state(cardData);
	
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
</style>
