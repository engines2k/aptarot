<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import CardInfo from './CardInfo.svelte';
	import { gsap } from "gsap";
	import { Draggable } from "gsap/Draggable";
	import { onMount } from 'svelte';
	import cardData from '$lib/card-data.json';

	gsap.registerPlugin(Draggable);

	let ogTarot = {
		x: 0,
		y: 0,
		scale: 1,
		rotation: 0
	}

	onMount(() => {
		Draggable.create(".tarot-card", {
			type: "x,y",
			onDragStart: function() {
				console.log(this)
				ogTarot = {
					x: this.x,
					y: this.y,
					scale: this.scale,
					rotation: gsap.getProperty(this.target, "rotation") as number
				}
				gsap.to(this.target, {
					scale: 1.1,
					rotate: 5,
					ease: "elastic.out(1, 0.5)",
					duration: .6
				});
			},
			onDrag: function() {
				if (ogTarot.y - this.y > 100)
					selected = this.target.id;
				else 
					selected = -1;
			},
			onDragEnd: function() {
				gsap.to(this.target, {
				scale: 1,
				rotate: ogTarot.rotation,
				x: Math.round(ogTarot.x), 
				y: Math.round(ogTarot.y),
				ease: "elastic.out(1, 0.5)", // Mimics elastic motion
				duration: .6 
				});
				if (ogTarot.y - this.y > 100) {
					startY = 0;
					activeCard = cards[this.target.id] || { id: -1, name: "No card selected", image: "/cards/card.png" };
				}
			}
		});
		const spread = 30;
		const tarotEls = document.querySelectorAll(".tarot-card");
		const total = tarotEls.length;
		const angleMapper =  gsap.utils.mapRange(0, total - 1, -spread / 2, spread / 2);
		const yMapper = function(index: number) {
			const height = spread*2;
			let x = index / (total-1);
			let y = (4*x**2 - 4*x) * height;
			return y;
		};
		tarotEls.forEach((card, i) => {
			gsap.set(card, {
				rotation: angleMapper(i),
				y: yMapper(i)
			});
			});
	});

	const playingCard='/cards/card.png';
	let selected = $state(-1);
	let startY: number = 0;
	let activeCard = $state({ id: -1, name: "No card selected", image: "/cards/card.png" });
	
	let cards = $state(cardData);

	function handleDrag(event: PointerEvent | MouseEvent | TouchEvent, index: number) {
		if (!(event instanceof PointerEvent)) return;
		if (!startY || !(event.target instanceof HTMLElement) || !event.target.classList) {
			startY = event.y;
			return;
		}
		if (event.y - startY < -100) {
			selected = index;
		} else {
			selected = -1;
		}
	}

	function handleDragEnd(event: PointerEvent | MouseEvent | TouchEvent, index: number) {
		if (event instanceof PointerEvent) {

		}
	}

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<CardInfo card={activeCard}/>
		<div class="mt-12" style="display: flex; flex-wrap: nowrap; justify-content: center;">
			{#each cards as card, index (card.id)}
			<div
			class="tarot-card"
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

	.tarot-card {
		padding:0;
		max-width:125px;
		margin: 0 auto;
		user-select: none;
	}

	.tarot-card img {
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
