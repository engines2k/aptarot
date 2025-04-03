<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import CardInfo from './CardInfo.svelte';
	import { Motion, useAnimation } from "svelte-motion";

	const playingCard='/cards/card.png';
	let controls = useAnimation();
	let selected = $state(-1);
	let startY: number = 0;
	let activeCard = $state({ id: -1, name: "No card selected", image:"/cards/card.png"});
	
	let cards = $state([
		{ id: 0, name: "The Fool", image:"/cards/jack-of-hearts.png"},
		{ id: 1, name: "The Magician", image:"/cards/queen-of-hearts.png"},
		{ id: 2, name: "The High Priestess", image:"/cards/king-of-hearts.png"},
		{ id: 3, name: "The High Priestess 2", image:"/cards/king-of-hearts.png"},
		{ id: 4, name: "The High Priestess 3", image:"/cards/king-of-hearts.png"},
	]);

	function handleDrag(event: PointerEvent | MouseEvent | TouchEvent, index: number) {
		if (!(event instanceof PointerEvent)) return;
		if (!startY || !(event.target instanceof HTMLElement) || !event.target.classList) {
			// Store the initial Y position when drag starts
			startY = event.y;
			return;
		}
		// Check if the drag was upwards
		if (event.y - startY < -100) {
			selected = index;
		} else {
			selected = -1;
			controls.start({
				scale: 2,
				rotate: 0,
				transition: { duration: 0.2 }
			});
		}
	}

	function handleDragEnd(event: PointerEvent | MouseEvent | TouchEvent, index:number) {
		if (event instanceof PointerEvent) {
			if (event.y - startY < -100) {
				startY = 0;
				activeCard = cards[index];
			}
		}
	}

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcomeFallback} alt="Welcome" />
			</picture>
		</span>
		<CardInfo card={activeCard}/>
		<div style="display: flex; flex-wrap: wrap; justify-content: center;">
			{#each cards as card, index (card.id)}
			<Motion
			let:motion
			drag={true}
			dragListener={true}
			dragConstraints={{
				top: -0,
				bottom: 0,
				right: 0,
				left: -0,
			}}
			dragTransition={{
				bounceStiffness: 600,
				bounceDamping: 25,
			}}
			
			dragElastic={0.5}
			whileTap={{
				cursor: "grabbing",
			}}
			whileDrag={{
				scale: 1.05,
				rotate: 5,
				transition: { duration: 0.2 }
			}}
			onDrag={(event: PointerEvent | MouseEvent | TouchEvent) => { handleDrag(event, index) }}
			onDragEnd={ (event) => { handleDragEnd(event, index) }}
			>
				<div
				use:motion
				class="tarot"
				id="{String(card.id)}"
				>
					<img
					src={playingCard}
					alt="Playing card"
					width="100"
					draggable="false"
					class:card-active={index == activeCard.id}
					class:card-selected={index == selected && index !== activeCard.id}
					/>
				</div>
			</Motion>
			{/each}
		</div>
	</h1>
</section>

<style>

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}

	.tarot {
		padding:0;
		max-width:125px;
		margin: 0 auto;
		user-select: none;
	}

	.tarot img {
		image-rendering: pixelated;
		padding:0;
		margin:0;
	}

	.card-selected {
		box-shadow: 6px 10px 89px -10px rgba(255,204,0);
	}

	.card-active {
		box-shadow: 6px 10px 89px 0px rgb(42, 140, 231);
	}
</style>
