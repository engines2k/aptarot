<script lang="ts">
	import {
		ChevronsLeft,
		ChevronLeft,
		Dices,
		ChevronRight,
		ChevronsRight,
	} from "lucide-svelte";
	import CarouselPositionIndicator from "./CarouselPositionIndicator.svelte";

	let {
		previousSection,
		previousCard,
		randomCard,
		nextCard,
		nextSection,
		positionIndicator,
		sectionIndicator,
	} = $props();
</script>

<div class="carousel-controls">
	<div class="controls-buttons">
		<button onclick={previousSection} title="Previous Section"
			><ChevronsLeft /></button
		>
		<button onclick={previousCard} title="Previous card"
			><ChevronLeft /></button
		>
		<button onclick={randomCard} title="Random card"><Dices /></button>
		<button onclick={nextCard} title="Next card"><ChevronRight /></button>
		<button onclick={nextSection} title="Next section"
			><ChevronsRight /></button
		>
	</div>
	<CarouselPositionIndicator pos={positionIndicator} />
	<div><p>{sectionIndicator}</p></div>
</div>

<style>
	.controls-buttons {
		display: flex;
		gap: 10px;
		z-index: 200;
		margin-bottom: 5px;
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
</style>
