import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";
import { createCard, type Card } from "./Cards";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(Observer);

export class CarouselController {
		rootElement: HTMLElement;
		items: Array<CarouselItem> = [];
		scrollPos: number = 0;
		window: Window;
		viewportWidth: number;
		viewportHeight: number;
        isDragging: boolean = false;
        cards: Array<Card> = [];
        selected: number;
        changeCard: (card: Card, index: number) => void;

		constructor(targetId: string, window: Window, cards: Array<Card>, selected: number, changeCard: (card: Card, index: number) => void) {
			this.rootElement = document.getElementById(targetId)!;
			this.refreshCards();
			this.initializeCardDraggables();
			this.initializeScrollObserver();
			this.window = window;
			this.cards = cards;
			this.viewportWidth = window.innerWidth;
			this.viewportHeight = window.innerHeight;
            this.selected = selected;
            this.changeCard = changeCard;
		}

		get length() {
			return this.items.length;
		}

		refreshCards() {
			this.items = Array.from(this.rootElement.children).map((el, i) => new CarouselItem(el, i, this));
		}

		initializeScrollObserver() {
			Observer.create({
				type: "wheel, touch, scroll",
				onChangeX: ({ deltaX }) => this.handleScroll(deltaX),
				onChangeY: ({ deltaY }) => this.handleScroll(deltaY)
			});
		}

		handleScroll(delta: number) {
			if (this.isDragging) return;
			this.scrollPos += delta;
			this.updateAllCardPositions();
		}

			
		updateAllCardPositions() {
			this.items.forEach(item => item.updateItemPosition());
		}

		getItemByIndex(index: number) {
			return this.items[index];
		}

		initializeCardDraggables() {
			this.items.forEach(item => item.initializeCardDraggable());
		}
	}

	class CarouselItem {
		type: string;
		element: Element;
		index: number;
		controller: CarouselController;
		spreadFactor: number = 20;
		startPos: Position;
		angleMapper: (value: number) => number;

		constructor(element: Element, index: number, controller: CarouselController) {
			this.element = element;
			this.index = index;
			this.type = element.getAttribute("data-carousel-item-type") || "unknown";
			this.controller = controller;
			this.angleMapper = gsap.utils.mapRange(0, this.controller.viewportWidth, -this.spreadFactor / 2, this.spreadFactor / 2);
			this.updateItemPosition();
			
			// Initialize with default position
			this.startPos = new Position(0, 0, 1, 0);
		}


		savePos(vars: Draggable.Vars) {
			return {
				x: vars.x,
				y: vars.y,
				scale: vars.scale,
				rotation: gsap.getProperty(vars.target, "rotation") as number
			}
		}
	

		updateItemPosition() {
			let position = this.element.getBoundingClientRect();
			let translateX = this.calculateXTranslation();
			// if (this.cardOutOfView()) return;
			return gsap.to(this.element, {
				x: translateX,
				y: this.calculateHeight(position.x),
				rotation: this.calculateAngle(position.x),
				scale: 1.1,
				duration: 0.5,
				ease: "power2.out"
			});
		}

		cardOutOfView() {
			let position = this.element.getBoundingClientRect();
			let leftBound = -100;
			let rightBound = this.controller.viewportWidth + 100;
			let magicIntendedX = this.index * 70 + this.calculateXTranslation();
			return  (position.x < leftBound && magicIntendedX < leftBound) ||
					(position.x > rightBound && magicIntendedX > rightBound);
		}

		calculateXTranslation() {
			const spread = (this.index - ((this.controller.length - 1) / 2)) * this.spreadFactor;
			return this.controller.scrollPos + spread;
		}

		calculateHeight(x: number) {
			//TODO Adjust height factor for different screen sizes instead of using a magic number lolol
			const height = this.spreadFactor * this.controller.viewportHeight / 300;
			let normalizedX = gsap.utils.normalize(0, this.controller.viewportWidth, x);
			// Create an arc using a parabolic formula 4x^2 - 4x.
			let y = (4 * normalizedX ** 2 - 4 * normalizedX) * height;
			return y;
		};

		calculateAngle(x: number) {
			return this.angleMapper(x);
		}


		

		initializeCardDraggable() {
			const self = this;
			Draggable.create(this.element, {
				type: "x,y",
				onPress: function() { self.handleCardPress(this) },
				onDrag: function() { self.handleCardDrag(this) },
				onRelease: function() { self.handleCardRelease(this) },
			});
			
			const draggable = Draggable.get(this.element);
			if (draggable) {
				this.startPos = this.savePos(draggable);
			}
		}

		handleCardPress(vars: Draggable.Vars) {
			
			this.controller.isDragging = true;
			gsap.to(vars.target, {
				scale: 1.1,
				rotate: 5,
				ease: "elastic.out(1, 0.5)",
				duration: .6
			});
		}

		handleCardDrag(vars: Draggable.Vars) {
			if (this.cardIsDraggedUp(vars) && vars.target && vars.target.id)
				this.controller.selected = parseInt(vars.target.id);
			else this.controller.selected = -1;
		}

		cardIsDraggedUp(vars: Draggable.Vars) {
			return this.startPos.y - vars.y > 100;
		}

		handleCardRelease(vars: Draggable.Vars) {
			this.controller.isDragging = false;
			this.putCardBack(vars)
			if (this.cardIsDraggedUp(vars)) {
				const cardIndex = parseInt(vars.target.id || "-1");
				this.controller.changeCard(this.controller.cards[cardIndex] || createCard({}), cardIndex);
			}
		}

		putCardBack(vars: Draggable.Vars) {
			let cardId = vars.target.id
			let scale = this.controller.selected == cardId ? 1.1 : 1;
			gsap.to(vars.target, {
				scale: scale,
				rotate: this.startPos.rotation,
				x: Math.round(this.startPos.x), 
				y: Math.round(this.startPos.y),
				ease: "elastic.out(.5, 0.2)",
				duration: .6 
			});
		}

	}

	class Position {
		x: number;
		y: number;
		scale: number;
		rotation: number;

		constructor(x: number, y: number, scale: number, rotation: number) {
			this.x = x;
			this.y = y;
			this.scale = scale;
			this.rotation = rotation;
		}
	}