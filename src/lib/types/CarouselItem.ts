import { gsap } from "gsap";

import { createCard, type Card } from "$/lib/types/Card";
import { CarouselState } from "$lib/types/CarouselState";
import { Position, PositionFactory } from "$lib/types/Position";


export class CarouselItem {
	readonly index: number;
	readonly type: string;
	element: Element;
	state: CarouselState;
	originalPosition: Position;
	pos: Position;


	constructor(element: Element, index: number, state: CarouselState) {
		this.element = element;
		this.index = index;
		this.type = element.getAttribute("data-carousel-item-type") || "unknown";
		this.state = state;
		this.originalPosition = PositionFactory.fromElement(element);
		this.pos = new Position(0, 0, 1, 0);
	}

	get x() {
		return this.element.getBoundingClientRect().x;
	}

	getPos() {
		return this.pos;
	}

	setPos(pos: Position) {
		this.pos = pos;
	}

	getOriginalPos() {
		return this.originalPosition;
	}

	savePos(dragEvent: Draggable.Vars) {
		return {
			x: dragEvent.x,
			y: dragEvent.y,
			scale: dragEvent.scale,
			rotation: gsap.getProperty(dragEvent.target, "rotation") as number
		}
	}

	handleDrag(dragEvent: Draggable.Vars) { }

	handlePress(dragEvent: Draggable.Vars) { }

	handleDragRelease(dragEvent: Draggable.Vars) { }
}

export class CarouselSectionMarker extends CarouselItem {
	label: string;
	constructor(element: Element, index: number, state: CarouselState) {
		super(element, index, state);
		this.label = element.getAttribute("data-carousel-section-label") || "Untitled";
	}
}

export class DraggableCarouselItem extends CarouselItem {
	constructor(element: Element, index: number, state: CarouselState) {
		super(element, index, state);
	}

	handlePress(vars: Draggable.Vars): void {
		this.state.userDraggingItem = true;
		this.pos = this.savePos(vars);
		gsap.to(vars.target, {
			scale: 1.2,
			rotate: this.pos.rotation + 5,
			ease: "elastic.out(1, 0.5)",
			duration: .6
		});
	}

	handleDragRelease(dragEvent: Draggable.Vars) {
		this.state.userDraggingItem = false;
		this.putMeBack(dragEvent);
	}

	putMeBack(dragEvent: Draggable.Vars) {
		let itemId = dragEvent.target.id
		let scale = this.state.activeIndex == itemId ? 1.1 : 1;
		gsap.to(dragEvent.target, {
			scale: scale,
			rotate: this.pos.rotation,
			x: Math.round(this.pos.x),
			y: Math.round(this.pos.y),
			ease: "elastic.out(.5, 0.2)",
			duration: .6
		});
	}
}

export class CarouselCardItem extends DraggableCarouselItem {
	cardData: Card;
	constructor(element: Element, index: number, state: CarouselState) {
		super(element, index, state);
		let cardData = element.getAttribute("data-card");
		if (cardData)
			this.cardData = createCard(JSON.parse(cardData));
		else
			this.cardData = createCard(null);
	}

	handleDrag(dragEvent: Draggable.Vars) {
		if (this.isDraggedUp(dragEvent))
			this.makeSelected();
		else
			this.makeUnselected();
	}

	makeSelected() {
		this.element.classList.add("card-selected");
	}

	makeUnselected() {
		this.element.classList.remove("card-selected");
	}

	makeActive() {
		this.element.classList.add("card-active");
	}

	makeInactive() {
		this.element.classList.remove("card-active");
	}

	isDraggedUp(vars: Draggable.Vars) {
		return this.pos.y - vars.y > 100;
	}

	handleDragRelease(dragEvent: Draggable.Vars) {
		super.handleDragRelease(dragEvent);
		// Let the Carousel handle making this item active
		this.makeUnselected();
	}
}
