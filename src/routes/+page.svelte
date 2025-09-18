<script lang="ts">
	import CardInfo from '$/components/CardInfo.svelte';
	import CardCarousel from '$/components/CardCarousel.svelte';
	import "$/cards.css";
	import { createCard, type Card } from '$/lib/types/Card';

	let activeCard = $state(createCard());

	function changeCard(card: Card, index: number) {
		activeCard = card;
	}
</script>

<svelte:head>
	<title>Aptarot</title>
	<meta name="description" content="Tarot card information" />
</svelte:head>

<section>
	<CardInfo card={activeCard}/>
	<CardCarousel {changeCard} />
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
