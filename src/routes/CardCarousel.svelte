<script lang="ts">
    import { onMount } from 'svelte';
	import { gsap,  } from "gsap";
	import { Observer } from 'gsap/all';
	import { Draggable } from "gsap/Draggable";
	gsap.registerPlugin(Draggable);
	gsap.registerPlugin(Observer);
	
	const cardSpread = 30;
    let { cards, activeCard, selected, changeCard } = $props();
	let tempPos = { x: 0, y: 0, scale: 1, rotation: 0 };
	let isDragging = false;
	
    onMount(() => {
		const tarotCards = document.querySelectorAll(".tarot-card");
		const totalCards = tarotCards.length;	
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const angleMapper = gsap.utils.mapRange(0, viewportWidth, -cardSpread / 2, cardSpread / 2);
		const yMapper = function(x: number) {
			const height = cardSpread*viewportHeight/300;
			let normalizedX = gsap.utils.normalize(0, viewportWidth, x);
			let y = (4*normalizedX**2 - 4*normalizedX) * height;
			return y;
		};
		
		let scrollOffset = 0;
		
		const scrollObserver = Observer.create({
			type: "wheel,touch, scroll",
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


		function updateCardPositions() {
			tarotCards.forEach((card, i) => {
				let logging = i == 39;
				const xSpread = (i - ((totalCards - 1) / 2)) * 20; // space cards horizontally
				const rect = card.getBoundingClientRect();
				let translateX = xSpread+scrollOffset; // x position of the card from the center of the carousel, NOT edge of the screen
				if(logging) console.log(`${card.id} ${xSpread + scrollOffset} ${rect.x}`);
				// WIP: Calculate the center of each card on screen , stop animating if it's off screen 
				// let theoreticalX = xSpread + scrollOffset + (viewportWidth / 2) - 35;
				// if(logging) console.log(`theoreticalX: ${theoreticalX}`);
				// if(theoreticalX < 0 || theoreticalX > viewportWidth*1.1) {
				// 	if(logging) console.log(`${xSpread + scrollOffset}`)
				// 	return;
				// }
				gsap.to(card, {
					x: translateX,
					y: yMapper(rect.x),
					rotation: angleMapper(rect.x),
					scale: 1.1,
					duration: 0.5,
					ease: "power2.out"
				});
			});
		}
		
		updateCardPositions();

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
					selected = parseInt(this.target.id);
				else 
					selected = -1;
			},
			onRelease: function() {
				isDragging = false;
				let scale = 1.1
				if(selected == this.target.id) scale = 1.2;
				gsap.to(this.target, {
				scale: scale,
				rotate: tempPos.rotation,
				x: Math.round(tempPos.x), 
				y: Math.round(tempPos.y),
				ease: "elastic.out(.5, 0.2)", // Mimics elastic motion
				duration: .6 
				});
				if (tempPos.y - this.y > 100) {
					const cardIndex = parseInt(this.target.id);
					changeCard(cards[cardIndex] || { name: "No card selected", image: "/cards/card.png" }, cardIndex);
				}
			}
		});
	});
</script>

<div
class="mt-12 card-carousel"
>
    {#each cards as card, index (index)}
    <div
    class="tarot-card"
    id="{String(index)}"
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

	.card-carousel {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		height: 90vh;
		padding-top: 60vh;
		padding-bottom:10vh;
		width: 100vw;
		overflow: hidden;
		position: absolute;
		bottom: 0;
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