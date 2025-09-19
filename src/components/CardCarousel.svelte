<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { Carousel } from '$/lib/types/Carousel';
	import { createCard, type Card } from '$/lib/types/Card';
	import cardData from '$/lib/card-data.json';
	import cardImagePaths from '$lib/card-image-paths.json';
	import { ChevronLeft, Dices, ChevronRight } from 'lucide-svelte';
    import { goto } from '$app/navigation';

	let cards = prepareCardData(cardData);
	let { changeCard } = $props();
	let carousel: Carousel;

	onMount(() => {
		carousel = new Carousel("card-carousel", changeCard);
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

	function scrollToTop() {
		window.scrollTo(0, 0);
	}

	function prepareCardData(cardData: any) {
		let result: { [key: string]: Card[] } = {};
		for (let i=0; i < cardData.length; i++) {
			let card = createCard(cardData[i]);
			addCardImage(card);
			result[card.type] = result[card.type] || [];
			result[card.type].push(card);
		}
		return result;
	}
	
	function addCardImage(card: Card) {
		if(!card.image)
			card.image = (cardImagePaths as Record<string, string>)[card.name] || "/cards/card.png";
		return card
	}

</script>
<div class="carousel-spacer"></div>
<div
class="mt-12 hide-until-loaded"
id="card-carousel"
>
{#each Object.entries(cards) as [typeName, typeCards], typeIndex}
	<div class="carousel-item carousel-divider mx-4">
	</div>
	{#each typeCards as card, index}
		<div
		class="carousel-item carousel-card mx-1 lg:mx-2"
		data-carousel-item-type="card"
		data-card={JSON.stringify(card)}
		id="{String(index)}"
		>
			<img 
			src={card.image}
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
	<button onclick={previousCard} title="Previous card"><ChevronLeft /></button>
	<button onclick={randomCard} title="Choose random card"><Dices/></button>
	<button onclick={nextCard} title="Next card"><ChevronRight /></button>
</div>

<style>
	.hide-until-loaded {
		visibility: hidden;
	}

	button {
		padding: 5px 15px;
		font-size:1em;
		background-color: rgb(43, 43, 43);
		border-radius:5px;
	}

	button:hover {
		background-color: rgb(60, 60, 60);
		cursor: pointer;
		color: var(--color-theme-1);
	}

	:global(.card-selected) {
		/* box-shadow: 6px 10px 89px -10px rgba(255,204,0); */
		box-shadow: #FFF 0 -1px 4px, #ff0 0 -2px 10px, #ff8000 0 -10px 20px, red 0 -18px 40px, 5px 5px 15px 5px rgba(0,0,0,0);
	}

	:global(.card-active) {
		box-shadow: 6px 10px 89px 0px rgb(42, 140, 231);
	}
	
	:global(.carousel-controls svg) {
		max-width: 20px;
	}

	.carousel-spacer {
		position: relative;
		height:10vh;
	}

	#card-carousel {
		pointer-events: none;
		display: flex;
		flex-wrap: nowrap;
		align-items:flex-end;
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
		gap: 10px;
		z-index: 200;
		
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
		height:100%;
		max-height:150px;
		border-right: 1px solid rgb(190, 190, 190);
		width:0;
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