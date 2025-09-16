<script lang="ts">
	import { onMount } from 'svelte';
	import { Carousel } from '$/lib/types/Carousel';
	import { createCard, type Card } from '$/lib/types/Card';
	import cardData from '$/lib/card-data.json';
	import cardImagePaths from '$lib/card-image-paths.json';

	let cards = prepareCardData(cardData);
	let { changeCard } = $props();
	let carousel: Carousel;

	onMount(() => {
		carousel = new Carousel("card-carousel", changeCard);
	});

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
<div
class="mt-12"
id="card-carousel"
>
{#each Object.entries(cards) as [typeName, typeCards], typeIndex}
	<div class="carousel-item carousel-divider">
	</div>
	<div class="carousel-item">
		<span>{typeName}</span>
	</div>
	{#each typeCards as card, index}
		<div
		class="carousel-item carousel-card"
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
</div>

<div class="carousel-controls">
	<button onclick={() => carousel.goToPrevious()}>Previous</button>
	<button onclick={() => carousel.goToRandom()}>Random</button>
	<button onclick={() => carousel.goToNext()}>Next</button>
</div>

<style>
	button {
		padding: 5px 15px;
		font-size:1em;
		background-color: rgb(43, 43, 43);
		border-radius:5px;
	}

	:global(.card-selected) {
		box-shadow: 6px 10px 89px -10px rgba(255,204,0);
	}

	:global(.card-active) {
		box-shadow: 6px 10px 89px 0px rgb(42, 140, 231);
	}

	#card-carousel {
		pointer-events: none;
		display: flex;
		flex-wrap: nowrap;
		align-items:center;
		justify-content: left;
		height: 100vh;
		width: 100vw;
		padding-top: 60vh;
		padding-bottom: 5vh;
		overflow: hidden;
		position: absolute;
		bottom: 0;
	}

	.carousel-controls {
		position: absolute;
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
		border-right: 10px solid white;
		width:0;
	}
</style>