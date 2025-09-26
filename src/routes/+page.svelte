<script lang="ts">
	import { createCard, type Card } from '$/lib/types/Card';
	import CardInfo from '$/components/CardInfo.svelte';
	import CardCarousel from '$/components/CardCarousel.svelte';
	import "$/cards.css";

	let activeCard = $state(createCard());

	function changeCard(card: Card, index: number) {
		activeCard = card;
	}
</script>

<svelte:head>
	<title>ApTarot</title>
	<meta name="description" content="A tarot card digital compendium" />
</svelte:head>

<section class="lg:items-center justify-center">
	<CardInfo card={activeCard}/>
	<CardCarousel {changeCard} />
</section>

<style>
	section {
		display: flex;
		flex-wrap:wrap;
		flex-direction: column;
		/* align-items: center; */
		width: 100%;
		height: calc(90vh - 50px);
		overflow-y: hidden;
	}

	@media (max-width: 40rem) {
		section {
			height:95vh;
		}
	}
</style>
