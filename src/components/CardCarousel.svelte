<script lang="ts">
	import { onMount } from 'svelte';
	// import { gsap } from "gsap";
	// import { Observer } from 'gsap/all';
	// import { Draggable } from "gsap/Draggable";
	import { createCard, type Card } from "$lib/Cards";
	import { CarouselController } from '$lib/carousel';
	
	// gsap.registerPlugin(Draggable);
	// gsap.registerPlugin(Observer);
	
    let { cards, activeCard, selected, changeCard } = $props();

	let isDragging = false;

	let defaultCard = createCard({ id: -1, name: "No card selected", image: "/cards/card.png" });

	// class CarouselController {
	// 	rootElement: HTMLElement;
	// 	items: Array<CarouselItem> = [];
	// 	scrollPos: number = 0;
	// 	window: Window;
	// 	viewportWidth: number;
	// 	viewportHeight: number;

	// 	constructor(targetId: string, window: Window) {
	// 		this.rootElement = document.getElementById(targetId)!;
	// 		this.refreshCards();
	// 		this.initializeCardDraggables();
	// 		this.initializeScrollObserver();
	// 		this.window = window;
	// 		this.viewportWidth = window.innerWidth;
	// 		this.viewportHeight = window.innerHeight;

	// 	}

	// 	get length() {
	// 		return this.items.length;
	// 	}

	// 	refreshCards() {
	// 		this.items = Array.from(this.rootElement.children).map((el, i) => new CarouselItem(el, i, this));
	// 	}

	// 	initializeScrollObserver() {
	// 		Observer.create({
	// 			type: "wheel, touch, scroll",
	// 			onChangeX: ({ deltaX }) => this.handleScroll(deltaX),
	// 			onChangeY: ({ deltaY }) => this.handleScroll(deltaY)
	// 		});
	// 	}

	// 	handleScroll(delta: number) {
	// 		if (isDragging) return;
	// 		this.scrollPos += delta;
	// 		this.updateAllCardPositions();
	// 	}

			
	// 	updateAllCardPositions() {
	// 		this.items.forEach(item => item.updateItemPosition());
	// 	}

	// 	getItemByIndex(index: number) {
	// 		return this.items[index];
	// 	}

	// 	initializeCardDraggables() {
	// 		this.items.forEach(item => item.initializeCardDraggable());
	// 	}
	// }

	// class CarouselItem {
	// 	type: string;
	// 	element: Element;
	// 	index: number;
	// 	controller: CarouselController;
	// 	spreadFactor: number = 20;
	// 	startPos: Position;
	// 	angleMapper: (value: number) => number;
	// 	isDragging: boolean = false;

	// 	constructor(element: Element, index: number, controller: CarouselController) {
	// 		this.element = element;
	// 		this.index = index;
	// 		this.type = element.getAttribute("data-carousel-item-type") || "unknown";
	// 		this.controller = controller;
	// 		this.angleMapper = gsap.utils.mapRange(0, this.controller.viewportWidth, -this.spreadFactor / 2, this.spreadFactor / 2);
	// 		this.updateItemPosition();
			
	// 		// Initialize with default position
	// 		this.startPos = new Position(0, 0, 1, 0);
	// 	}


	// 	savePos(vars: Draggable.Vars) {
	// 		return {
	// 			x: vars.x,
	// 			y: vars.y,
	// 			scale: vars.scale,
	// 			rotation: gsap.getProperty(vars.target, "rotation") as number
	// 		}
	// 	}
	

	// 	updateItemPosition() {
	// 		let position = this.element.getBoundingClientRect();
	// 		let translateX = this.calculateXTranslation();
	// 		// if (this.cardOutOfView()) return;
	// 		return gsap.to(this.element, {
	// 			x: translateX,
	// 			y: this.calculateHeight(position.x),
	// 			rotation: this.calculateAngle(position.x),
	// 			scale: 1.1,
	// 			duration: 0.5,
	// 			ease: "power2.out"
	// 		});
	// 	}

	// 	cardOutOfView() {
	// 		let position = this.element.getBoundingClientRect();
	// 		let leftBound = -100;
	// 		let rightBound = this.controller.viewportWidth + 100;
	// 		let magicIntendedX = this.index * 70 + this.calculateXTranslation();
	// 		return  (position.x < leftBound && magicIntendedX < leftBound) ||
	// 				(position.x > rightBound && magicIntendedX > rightBound);
	// 	}

	// 	calculateXTranslation() {
	// 		const spread = (this.index - ((this.controller.length - 1) / 2)) * this.spreadFactor;
	// 		return this.controller.scrollPos + spread;
	// 	}

	// 	calculateHeight(x: number) {
	// 		//TODO Adjust height factor for different screen sizes instead of using a magic number lolol
	// 		const height = this.spreadFactor * this.controller.viewportHeight / 300;
	// 		let normalizedX = gsap.utils.normalize(0, this.controller.viewportWidth, x);
	// 		// Create an arc using a parabolic formula 4x^2 - 4x.
	// 		let y = (4 * normalizedX ** 2 - 4 * normalizedX) * height;
	// 		return y;
	// 	};

	// 	calculateAngle(x: number) {
	// 		return this.angleMapper(x);
	// 	}


		

	// 	initializeCardDraggable() {
	// 		const self = this;
	// 		Draggable.create(this.element, {
	// 			type: "x,y",
	// 			onPress: function() { self.handleCardPress(this) },
	// 			onDrag: function() { self.handleCardDrag(this) },
	// 			onRelease: function() { self.handleCardRelease(this) },
	// 		});
			
	// 		const draggable = Draggable.get(this.element);
	// 		if (draggable) {
	// 			this.startPos = this.savePos(draggable);
	// 		}
	// 	}

	// 	handleCardPress(vars: Draggable.Vars) {
			
	// 		isDragging = true;
	// 		gsap.to(vars.target, {
	// 			scale: 1.1,
	// 			rotate: 5,
	// 			ease: "elastic.out(1, 0.5)",
	// 			duration: .6
	// 		});
	// 	}

	// 	handleCardDrag(vars: Draggable.Vars) {
	// 		if (this.cardIsDraggedUp(vars) && vars.target && vars.target.id)
	// 			selected = parseInt(vars.target.id);
	// 		else selected = -1;
	// 	}

	// 	cardIsDraggedUp(vars: Draggable.Vars) {
	// 		return this.startPos.y - vars.y > 100;
	// 	}

	// 	handleCardRelease(vars: Draggable.Vars) {
	// 		isDragging = false;
	// 		this.putCardBack(vars)
	// 		if (this.cardIsDraggedUp(vars)) {
	// 			const cardIndex = parseInt(vars.target.id || "-1");
	// 			changeCard(cards[cardIndex] || defaultCard, cardIndex);
	// 		}
	// 	}

	// 	putCardBack(vars: Draggable.Vars) {
	// 		let cardId = vars.target.id
	// 		let scale = selected == cardId ? 1.1 : 1;
	// 		gsap.to(vars.target, {
	// 			scale: scale,
	// 			rotate: this.startPos.rotation,
	// 			x: Math.round(this.startPos.x), 
	// 			y: Math.round(this.startPos.y),
	// 			ease: "elastic.out(.5, 0.2)",
	// 			duration: .6 
	// 		});
	// 	}

	// }

	// class Position {
	// 	x: number;
	// 	y: number;
	// 	scale: number;
	// 	rotation: number;

	// 	constructor(x: number, y: number, scale: number, rotation: number) {
	// 		this.x = x;
	// 		this.y = y;
	// 		this.scale = scale;
	// 		this.rotation = rotation;
	// 	}
	// }

	onMount(() => {
		const controller = new CarouselController("card-carousel", window, cards, selected, changeCard);
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