<script lang="ts">
	import cardData from '$lib/card-data.json';
	import CardInfo from './CardInfo.svelte';
	import CardCarousel from './CardCarousel.svelte';

	let selected = $state(-1);
	let activeCard = $state({ id: -1, name: "No card selected", image: "/cards/card.png" });
	let cards = $state(cardData);
	
	function changeCard(card: { id: number, name: string, image: string }) {
		activeCard = card;
		selected = card.id;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<CardInfo card={activeCard}/>
		<!-- <div class="mt-12" style="display: flex; flex-wrap: nowrap; justify-content: center;">
			{#each cards as card, index (card.id)}
			<div
			class="tarot-card"
			id="{String(card.id)}"
			>
				<img
				src={playingCard}
				alt="Playing card"
				width="100"
				draggable="false"
				class:card-active={index == activeCard.id}
				class:card-selected={index == selected && index !== activeCard.id}
				/>
			</div>
			{/each}
		</div> -->
		<CardCarousel 
		{cards}
		{activeCard}
		{selected}
		{changeCard}
		/>
	</h1>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
