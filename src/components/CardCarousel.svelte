<script lang="ts">
	import { onMount } from "svelte";
	import { Carousel } from "$/lib/types/Carousel";
	import { prepareCardDataInSections, type Card } from "$/lib/types/Card";
	import CarouselCard from "./CarouselCard.svelte";
	import CarouselControl from "./CarouselControl.svelte";
	import CarouselSection from "./CarouselSection.svelte";

	let { changeCard, cards } = $props<{ changeCard: (card: Card) => void; cards: Card[] }>();
	let cardSections = prepareCardDataInSections(cards);
	let positionIndicator = $state(0);
	let sectionIndicator = $state("");
	let carousel: Carousel;

	onMount(() => {
		carousel = new Carousel(
			"card-carousel",
			changeCard,
			updatePositionIndicator,
			updateSectionIndicator,
		);
	});
	function updatePositionIndicator(pos: number) {
		positionIndicator = pos;
	}
	function updateSectionIndicator(label: string) {
		sectionIndicator = label;
	}
	function previousCard() {
		carousel.goToPrevious();
	}
	function randomCard() {
		carousel.goToRandom();
	}
	function nextCard() {
		carousel.goToNext();
	}
</script>

<div class="carousel-spacer"></div>
<div class="mt-12 hide-until-loaded" id="card-carousel">
	<div class="carousel-item carousel-divider mx-4"></div>
	{#each Object.entries(cardSections) as [sectionLabel, section]}
		<CarouselSection {sectionLabel} />
		{#each section as card, index}
			<CarouselCard {card} {index} />
		{/each}
	{/each}
	<div class="carousel-item carousel-divider mx-4"></div>
</div>
<CarouselControl
	{previousCard}
	{randomCard}
	{nextCard}
	{positionIndicator}
	{sectionIndicator}
/>

<style>
	:global(.hide-until-loaded) {
		visibility: hidden;
	}

	:global(.card-selected) {
		box-shadow: 6px 10px 89px -10px rgba(255, 204, 0);
	}

	:global(.card-active) {
		box-shadow: 6px 10px 89px 0px rgb(42, 140, 231);
	}

	.carousel-spacer {
		position: relative;
		height: 10vh;
	}

	#card-carousel {
		pointer-events: none;
		display: flex;
		flex-wrap: nowrap;
		align-items: flex-end;
		justify-content: left;
		height: 100vh;
		width: 100vw;
		/* padding-top: 60vh; */
		padding-bottom: 10vh;
		overflow: hidden;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	:global(.carousel-item) {
		pointer-events: auto;
		z-index: 100;
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.carousel-divider {
		height: 100%;
		max-height: 150px;
		border-right: 1px solid rgb(190, 190, 190);
		width: 0;
		margin-bottom: -15px;
	}

	@media (max-width: 40rem) {
		.carousel-divider {
			max-height: 100px;
		}
	}
</style>
