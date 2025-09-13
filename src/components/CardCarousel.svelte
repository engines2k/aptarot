<script lang="ts">
	import { onMount } from 'svelte';
	import { Carousel as Carousel } from '$lib/carousel';
	
    let { cards, activeCard, selected, changeCard } = $props();

	onMount(() => {
		const controller = new Carousel("card-carousel", changeCard);
	});

</script>
<div
class="mt-12"
id="card-carousel"
>
<div class="carousel-item">
	<span> hello there </span>
</div>
{#each cards as card, index}
    <div
    class="carousel-item"
	data-carousel-item-type="card"
	data-card={JSON.stringify(card)}
    id="{String(index)}"
	class:card-active={index == activeCard.id}
    >
        <img 
        src={card.image}
        alt="Playing card"
        width="100"
        draggable="false"
        />
    </div>
    {/each}
</div>

<style>
	:global(.card-selected) {
		box-shadow: 6px 10px 89px -10px rgba(255,204,0);
	}

	.card-active {
		box-shadow: 6px 10px 89px 0px rgb(42, 140, 231);
	}

	#card-carousel {
		pointer-events: none;
		display: flex;
		flex-wrap: nowrap;
		align-items:flex-end;
		justify-content: left;
		height: 100vh;
		width: 100vw;
		padding-top: 60vh;
		padding-bottom: 5vh;
		overflow: hidden;
		position: absolute;
		bottom: 0;
	}

	#card-carousel .carousel-item {
		pointer-events: auto;
		z-index: 100;
		flex: 0 0 auto;
		width: 70px;
		display: flex;
		align-items: center;
		justify-content: center;
		height:max-content;
	}

	.carousel-item img {
		width: 70px;
		height: auto;
		display: block;
		image-rendering: pixelated;
	}
</style>