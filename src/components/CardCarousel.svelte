<script lang="ts">
	import { onMount } from "svelte";
	import { Carousel } from "$/lib/types/Carousel";
	import {
		prepareCardData,
		prepareCardDataInSections,
	} from "$/lib/types/Card";
	import cardData from "$/lib/data/card-data.json";
	import { ChevronLeft, Dices, ChevronRight } from "lucide-svelte";
	import CarouselPositionIndicator from "./CarouselPositionIndicator.svelte";

	let cards = prepareCardData(cardData);
	let cardSections = prepareCardDataInSections(cardData);
	let { changeCard } = $props();
	let positionIndicator = $state(0);
	let carousel: Carousel;

	function updatePositionIndicator(pos: number) {
		positionIndicator = pos;
	}

	onMount(() => {
		carousel = new Carousel(
			"card-carousel",
			changeCard,
			updatePositionIndicator,
		);
	});

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
		<div
			class="carousel-item carousel-section"
			data-carousel-item-type="section-marker"
			data-carousel-section-label={sectionLabel}
		></div>
		{#each section as card, index}
			<div
				class="carousel-item carousel-card mx-1 lg:mx-2"
				data-carousel-item-type="card"
				data-card={JSON.stringify(card)}
				id={String(index)}
			>
				<img
					src={`/cards/small/${card.image}`}
					alt="Playing card"
					width="100"
					draggable="false"
				/>
			</div>
		{/each}
	{/each}
	<div class="carousel-item carousel-divider mx-4"></div>
</div>

<div class="carousel-controls">
	<div class="controls-buttons">
		<button onclick={previousCard} title="Previous card"
			><ChevronLeft /></button
		>
		<button onclick={randomCard} title="Random card"><Dices /></button>
		<button onclick={nextCard} title="Next card"><ChevronRight /></button>
	</div>
	<CarouselPositionIndicator pos={positionIndicator} />
</div>

<style>
	.hide-until-loaded {
		visibility: hidden;
	}

	button {
		padding: 5px 15px;
		font-size: 1em;
		background-color: rgb(43, 43, 43);
		border-radius: 5px;
	}

	button:hover {
		background-color: rgb(60, 60, 60);
		cursor: pointer;
		color: var(--color-theme-1);
	}

	:global(.card-selected) {
		/* box-shadow: 6px 10px 89px -10px rgba(255,204,0); */
		box-shadow:
			#fff 0 -1px 4px,
			#ff0 0 -2px 10px,
			#ff8000 0 -10px 20px,
			red 0 -18px 40px,
			5px 5px 15px 5px rgba(0, 0, 0, 0);
	}

	:global(.card-active) {
		box-shadow: 6px 10px 89px 0px rgb(42, 140, 231);
	}

	:global(.carousel-controls svg) {
		max-width: 20px;
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

	.carousel-controls {
		position: fixed;
		bottom: 5vh;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.controls-buttons {
		display: flex;
		gap: 10px;
		z-index: 200;
		margin-bottom: 5px;
	}

	.carousel-item {
		pointer-events: auto;
		z-index: 100;
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.carousel-card img {
		width: 70px;
		height: auto;
		display: block;
		image-rendering: pixelated;
	}

	.carousel-card {
		width: 70px;
	}

	.carousel-divider {
		height: 100%;
		max-height: 150px;
		border-right: 1px solid rgb(190, 190, 190);
		width: 0;
		margin-bottom: -15px;
	}

	@media (max-width: 40rem) {
		.carousel-card {
			width: 50px;
		}

		.carousel-divider {
			max-height: 100px;
		}
	}
</style>
