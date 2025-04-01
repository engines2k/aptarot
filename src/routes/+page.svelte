<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import { Motion, useAnimation } from "svelte-motion";
	let controls = useAnimation();
	let draggedUp = false;
	let startY: number = 0;

	function handleDrag(event: PointerEvent) {
		if (!startY) {
			// Store the initial Y position when drag starts
			startY = event.y;
			return;
		}
		// Check if the drag was upwards
		if (event.y - startY < -100) {
			draggedUp = true;
		} else {
			draggedUp = false;
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
				bounceDamping: 20,
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
			onDrag={handleDrag}
			onDragEnd={() => {console.log("HELLO! Drag ended!"); draggedUp=false}}
			>

	
			<div
				use:motion
				class="tarot" class:red-text={draggedUp}
			>
				to <br />Tarot2k.
			</div>
		</Motion>
	</h1>|

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter />
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
		max-width:200px;
		margin:auto;
		background-color: rgb(228, 105, 105);
		user-select: none;
	}

	.red-text {
		color: red;
		font-size: 2rem;
		font-weight: bold;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}
</style>
