<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from "gsap";
	import { Observer } from 'gsap/all';
	import { Draggable } from "gsap/Draggable";
	
	gsap.registerPlugin(Draggable);
	gsap.registerPlugin(Observer);
	
    let { cards, activeCard, selected, changeCard } = $props();

	const defaultCard = { name: "No card selected", image: "/cards/card.png" };
	const cardSpread = 30;

	let startingPos = { x: 0, y: 0, scale: 1, rotation: 0 };
	let scrollOffset = 0;
	let isDragging = false;
	let viewportWidth: number;
	let viewportHeight: number;
	let tarotCards: NodeListOf<Element>;
    let numCards: number;
	let angleMapper: (x: number) => number;
	
	onMount(() => {
		setUpMountDependentVars();
		initializeCardDraggable();
		initializeScrollObserver();
		updateAllCardPositions();
	});

	function setUpMountDependentVars() {
		tarotCards = document.querySelectorAll(".tarot-card");
		numCards = tarotCards.length;
		viewportWidth = window.innerWidth;
		viewportHeight = window.innerHeight;
		angleMapper = gsap.utils.mapRange(0, viewportWidth, -cardSpread / 2, cardSpread / 2);
	}

	function initializeScrollObserver() {
		Observer.create({
			type: "wheel, touch, scroll",
			onChangeX({ deltaX }) { handleScroll(deltaX); },
			onChangeY({ deltaY }) { handleScroll(deltaY); }
		});
	}
	
	function handleScroll(delta: number ) {
		if (isDragging) return;
		scrollOffset += delta;
		updateAllCardPositions();
	}
	
	function updateAllCardPositions() {
		tarotCards.forEach((card, i) => {
			updateCardPosition(card, i);
		});
	}
	
	function updateCardPosition(card: Element, cardIndex: number) {
		const cardRect = card.getBoundingClientRect();
		const spread = (cardIndex - ((numCards - 1) / 2)) * 20; 
		const translateX = scrollOffset+spread;
		if (cardOutOfView(cardIndex, cardRect, translateX)) return;
		gsap.to(card, {
			x: translateX,
			y: calculateHeight(cardRect.x),
			rotation: calculateAngle(cardRect.x),
			scale: 1.1,
			duration: 0.5,
			ease: "power2.out"
		});
	}

	function cardOutOfView(cardIndex: number, cardRect: DOMRect, translateX: number) {
		let leftBound = -100;
		let rightBound = viewportWidth + 100;
		let magicIntendedX = cardIndex * 70 + translateX; // The constant 70 is the width of each card in px. This should be made dynamic.
		return  (cardRect.x < leftBound && magicIntendedX < leftBound) ||
				(cardRect.x > rightBound && magicIntendedX > rightBound);
	}


	function calculateAngle(x: number) {
		return angleMapper(x);
	}

	function calculateHeight(x: number) {
		//TODO Adjust height factor for different screen sizes instead of using a magic number lolol
		const height = cardSpread * viewportHeight / 200;
		let normalizedX = gsap.utils.normalize(0, viewportWidth, x);
		// Create an arc using a parabolic formula 4x^2 - 4x.
		let y = (4 * normalizedX ** 2 - 4 * normalizedX) * height;
		return y;
	};
		

	function initializeCardDraggable() {
		Draggable.create(".tarot-card", {
			type: "x,y",
			onPress: function () { handleCardPress(this) },
			onDrag: function () { handleCardDrag(this) },
			onRelease: function () { handleCardRelease(this) },
		});
	}

	function handleCardPress(vars: Draggable.Vars) {
		isDragging = true;
		startingPos = savePos(vars);
		gsap.to(vars.target, {
			scale: 1.1,
			rotate: 5,
			ease: "elastic.out(1, 0.5)",
			duration: .6
		});
	}

	function savePos(vars: Draggable.Vars) {
		return {
			x: vars.x,
			y: vars.y,
			scale: vars.scale,
			rotation: gsap.getProperty(vars.target, "rotation") as number
		}
	}

	function handleCardDrag(vars: Draggable.Vars) {
		if (cardIsDraggedUp(vars) && vars.target && vars.target.id)
			selected = parseInt(vars.target.id);
		else selected = -1;
	}

	function cardIsDraggedUp(vars: Draggable.Vars) {
		return startingPos.y - vars.y > 100;
	}

	function handleCardRelease(vars: Draggable.Vars) {
		isDragging = false;
		putCardBack(vars)
		if (cardIsDraggedUp(vars)) {
			const cardIndex = parseInt(vars.target.id || "-1");
			changeCard(cards[cardIndex] || defaultCard, cardIndex);
		}
	}

	function putCardBack(vars: Draggable.Vars) {
		let cardId = vars.target.id
		let scale = selected == cardId ? 1.1 : 1;
		gsap.to(vars.target, {
			scale: scale,
			rotate: startingPos.rotation,
			x: Math.round(startingPos.x), 
			y: Math.round(startingPos.y),
			ease: "elastic.out(.5, 0.2)",
			duration: .6 
		});
	}
		

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
		justify-content: left;
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