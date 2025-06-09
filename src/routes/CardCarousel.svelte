<script lang="ts">
    import { onMount } from 'svelte';

    const playingCard='/cards/card.png';
    let { cards, activeCard, selected, changeCard } = $props();
    let startY: number = 0;
	let ogTarot = {
		x: 0,
		y: 0,
		scale: 1,
		rotation: 0
	};
    import { gsap } from "gsap";
    import { Observer } from 'gsap/all';
    import { Draggable } from "gsap/Draggable";

    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(Observer);

    // For testing purposes
	let testOffsets = {
		x: 0,
		y: 0
	};
    let scrollOffset = 0;

    onMount(() => {
		const spread = 30;
		const tarotEls = document.querySelectorAll(".tarot-card");
		const total = tarotEls.length;
		const angleMapper = gsap.utils.mapRange(0, total - 1, -spread / 2, spread / 2);
	
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

		tarotEls.forEach((card, i) => {
			gsap.set(card, {
				rotation: angleMapper(i),
				y: yMapper(i),
				x: (i - (total - 1) / 2) * 20
			});
		});
		
		Observer.create({
			type: "wheel,touch,scroll",
			onChangeX({ deltaX }) {
				scrollOffset += deltaX;
				updateCardPositions();
			},
			onChangeY({ deltaY }) {
				scrollOffset += deltaY;
				updateCardPositions();
			}
		});

		Draggable.create(".tarot-card", {
			type: "x,y",
			onPress: function() {
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
			onRelease: function() {
				gsap.to(this.target, {
				scale: 1,
				rotate: ogTarot.rotation,
				x: Math.round(ogTarot.x + testOffsets.x), 
				y: Math.round(ogTarot.y),
				ease: "elastic.out(1, 0.3)", // Mimics elastic motion
				duration: .6 
				});
				if (ogTarot.y - this.y > 100) {
					startY = 0;
					changeCard(cards[this.target.id] || { id: -1, name: "No card selected", image: "/cards/card.png" });
				}
			}
		});
	});
</script>

<div
class="mt-12 card-carousel"
style="display: flex; flex-wrap: nowrap; justify-content: center;">
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

<style>
	.card-selected {
		box-shadow: 6px 10px 89px -10px rgba(255,204,0);
	}

	.card-active {
		box-shadow: 6px 10px 89px 0px rgb(42, 140, 231);
	}

	.card-carousel {
		min-height:200px;
		overflow-x: auto;
		overflow: visible;
		/* scrollbar-width: none; */
	}
</style>