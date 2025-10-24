<script lang="ts">
	import { onMount } from "svelte";
	import { createCard, type Card } from "$/lib/types/Card";
	import LoadingScreen from "$/components/LoadingScreen.svelte";
	import CardInfo from "$/components/CardInfo.svelte";
	import CardCarousel from "$/components/CardCarousel.svelte";
	import "$/cards.css";

	let { data } = $props();
	let loading = $state(true);
	let activeCard = $state(createCard());

	function changeCard(card: Card) {
		activeCard = card;
	}

	onMount(() => {
		loading = false;
	});
</script>

<svelte:head>
	<title>ApTarot</title>
	<meta name="description" content="A tarot card digital compendium" />
</svelte:head>

<section class="lg:items-center justify-center">
	<div class={loading ? "" : "invisible"}>
		<LoadingScreen />
	</div>
	<div class={loading ? "invisible" : ""}>
		<CardInfo card={activeCard} />
		<CardCarousel {changeCard} cards={data.cards} />
	</div>
</section>

<style>
	section {
		display: flex;
		flex-wrap: wrap;
		flex-wrap: wrap;
		flex-direction: column;
		/* align-items: center; */
		width: 100%;
		height: calc(90vh - 50px);
		overflow-y: hidden;
	}

	/*@media (max-width: 40rem) {
		section {
			height: 95vh;
		}
	}*/
</style>
