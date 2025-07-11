<script lang="ts">
    import { onMount } from 'svelte';
	import { gsap } from "gsap";
	import { Observer } from 'gsap/all';
	import { Draggable } from "gsap/Draggable";
	gsap.registerPlugin(Draggable);
	gsap.registerPlugin(Observer);
	
    const playingCardImg='/cards/card.png';
    let { cards, activeCard, selected, changeCard } = $props();
	let startY: number = 0;
	let scrollOffset = 0;
	let tempPos = {
		x: 0,
		y: 0,
		scale: 1,
		rotation: 0
	};
	let isDragging = false;

    onMount(() => {
		const spread = 30;
		const tarotEls = document.querySelectorAll(".tarot-card");
		const total = tarotEls.length;
		const angleMapper = gsap.utils.mapRange(0, total - 1, -spread / 2, spread / 2);
		
		// Calculate initial offset to center the middle card in the viewport
		const middleCardIndex = Math.floor(total / 2);
		const viewportWidth = window.innerWidth;
		const cardWidth = 70;
		let scrollOffset = 0;
		console.log(`scrollOffset: ${scrollOffset} viewportWidth: ${viewportWidth}`);
	
		const yMapper = function(index: number) {
			const height = spread*2;
			let x = (index + scrollOffset/80) / (total-1);
			if (x < 0 || x > 1) return 0 + (height);
			let y = (4*x**2 - 4*x) * height + height;
			return y;
		};
		
		function updateCardPositions() {
			tarotEls.forEach((card, i) => {
				const baseX = (i - (total - 1) / 2) * 20; // space cards horizontally
				gsap.to(card, {
					x: baseX + scrollOffset,
					y: yMapper(i),
					rotation: angleMapper(i),
					duration: 0.5,
					ease: "power2.out"
				});
			});
		}
		
		const observer = Observer.create({
			type: "wheel,touch,scroll",
			onChangeX({ deltaX }) {
				if (!isDragging) {
					scrollOffset += deltaX;
					updateCardPositions();
				}
			},
			onChangeY({ deltaY }) {
				if (!isDragging) {
					scrollOffset += deltaY;
					updateCardPositions();
				}
			}
		});

		tarotEls.forEach((card, i) => {
			gsap.set(card, {
				rotation: angleMapper(i),
				y: yMapper(i),
				x: (i - (total - 1) / 2) * 20 + scrollOffset
			});
		});
		

		Draggable.create(".tarot-card", {
			type: "x,y",
			onPress: function() {
				isDragging = true;
				console.log(this)
				tempPos = {
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
				if (tempPos.y - this.y > 100)
					selected = this.target.id;
				else 
					selected = -1;
			},
			onRelease: function() {
				isDragging = false;
				gsap.to(this.target, {
				scale: 1,
				rotate: tempPos.rotation,
				x: Math.round(tempPos.x), 
				y: Math.round(tempPos.y),
				ease: "elastic.out(1, 0.3)", // Mimics elastic motion
				duration: .6 
				});
				if (tempPos.y - this.y > 100) {
					startY = 0;
					changeCard(cards[this.target.id] || { id: -1, name: "No card selected", image: "/cards/card.png" });
				}
			}
		});
	});
</script>

<div
class="mt-12 card-carousel"
>
    {#each cards as card, index (card.id)}
    <div
    class="tarot-card"
    id="{String(card.id)}"
    >
        <img
        src={playingCardImg}
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

	.card-carousel {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		height: 100vw;
		padding-top: 60vh;
		padding-bottom: 20vh;
		width: 100vw;
		overflow: hidden;
		position: absolute;
		top: 0;
	}

	.tarot-card {
		flex: 0 0 auto;
		width: 70px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tarot-card img {
		width: 70px;
		height: auto;
		display: block;
		image-rendering: pixelated;
	}
</style>