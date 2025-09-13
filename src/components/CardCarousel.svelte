<script lang="ts">
	import { onMount } from 'svelte';
	import { Carousel as Carousel } from '$lib/carousel';
	
    let { cards, activeCard, selected, changeCard } = $props();

	onMount(() => {
		const controller = new Carousel("card-carousel", window, cards, selected, changeCard);
	});


</script>
<div
class="mt-12"
id="card-carousel"
>
{#each cards as card, index (index)}
    <div
    class="tarot-card"
    id="{String(index)}"
	data-carousel-item-type="card"
    >
        <img 
        src={card.image}
        alt="Playing card"
        width="100"
        draggable="false"
        class:card-active={index == activeCard.id}
        class:card-selected={index == selected && index !== activeCard.id}
        />
    </div>
    {/each}
</div>

<style>
	.card-selected {
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

	.tarot-card {
		pointer-events: auto;
		z-index: 100;
		flex: 0 0 auto;
		width: 70px;
		display: flex;
		align-items: center;
		justify-content: center;
		height:max-content;
	}

	.tarot-card img {
		width: 70px;
		height: auto;
		display: block;
		image-rendering: pixelated;
	}
</style>