<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import playingCard from '$lib/images/card.png';
	import { Motion, useAnimation } from "svelte-motion";
	let controls = useAnimation();
	let draggedUp = false;
	let startY: number = 0;

	let cards = $state([
		{ id: 0, name: "The Fool", image: "path/to/image1.jpg", active: false },
		{ id: 1, name: "The Magician", image: "path/to/image2.jpg", active: false },
		{ id: 2, name: "The High Priestess", image: "path/to/image3.jpg", active: false },
	]);

	function handleDrag(event: PointerEvent, index: number) {
		if (!startY || !event.target || !event.target.classList) {
			// Store the initial Y position when drag starts
			startY = event.y;
			return;
		}
		// Check if the drag was upwards
		if (event.y - startY < -100) {
			cards = cards.map((card, i) => i === index ? { ...card, active: true } : card);
			// event.target.classList.add("red-text");
			// draggedUp = true;
		} else {
			cards = cards.map((card, i) => i === index ? { ...card, active: false } : card);
			// event.target.classList.remove("red-text");
			// draggedUp = false;
			controls.start({
				scale: 2,
				rotate: 0,
				transition: { duration: 0.2 }
			});
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
		<div class="detail">

		</div>
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
			onDrag={(event) => { handleDrag(event, index) }}
			onDragEnd={ (event) => {console.log("HELLO! Drag ended!"); cards = cards.map((card, i) => i === index ? { ...card, active: false } : card); }}
			>	
				<div
				use:motion
				class="tarot"
				id="{String(card.id)}"
				
				>
					<img class:red-text={card.active} draggable="false" src={playingCard} alt="Playing card" width="100"/>
				</div>
			</Motion>
		{/each}
		</div>
	</h1>
</section>

<style>
	.detail {
		min-height: 200px;
	}
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
		padding:0;
		margin:0;
	}

	.red-text {
		box-shadow: 6px 10px 89px -10px rgba(255,204,0,1);
		color: red;
		font-size: 2rem;
		font-weight: bold;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}
</style>
