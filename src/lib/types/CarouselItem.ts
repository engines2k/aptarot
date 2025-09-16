import gsap from "gsap";

import { createCard, type Card } from "$/lib/types/Card";
import { CarouselState } from "$lib/types/CarouselState";

export class CarouselItem {
    type: string;
    element: Element;
    index: number;
    startPos: Position;
    state: CarouselState;
    
    constructor(element: Element, index: number, state: CarouselState) {
        this.element = element;
        this.index = index;
        this.type = element.getAttribute("data-carousel-item-type") || "unknown";
        this.state = state;
        this.startPos = new Position(0, 0, 1, 0);
    }

    get x() {
        return this.element.getBoundingClientRect().x;
    }

    savePos(dragEvent: Draggable.Vars) {
        return {
            x: dragEvent.x,
            y: dragEvent.y,
            scale: dragEvent.scale,
            rotation: gsap.getProperty(dragEvent.target, "rotation") as number
        }
    }
    
    handleDrag(dragEvent: Draggable.Vars) {}

    handlePress(dragEvent: Draggable.Vars) {}

    handleDragRelease(dragEvent: Draggable.Vars) {}
}

export class DraggableCarouselItem extends CarouselItem {
    constructor(element: Element, index: number, state: CarouselState) {
        super(element, index, state);
    }

    handlePress(vars: Draggable.Vars): void {
        this.state.dragging = true;
        this.startPos = this.savePos(vars);
        gsap.to(vars.target, {
            scale: 1.1,
            rotate: 5,
            ease: "elastic.out(1, 0.5)",
            duration: .6
        });
    }
    
    handleDragRelease(dragEvent: Draggable.Vars) {
        this.state.dragging = false;
        this.putMeBack(dragEvent);
    }
    
    putMeBack(dragEvent: Draggable.Vars) {
        let itemId = dragEvent.target.id
        let scale = this.state.selected == itemId ? 1.1 : 1;
        gsap.to(dragEvent.target, {
            scale: scale,
            rotate: this.startPos.rotation,
            x: Math.round(this.startPos.x), 
            y: Math.round(this.startPos.y),
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
        return this.startPos.y - vars.y > 100;
    }
    
    handleDragRelease(dragEvent: Draggable.Vars) {
        super.handleDragRelease(dragEvent);
        if (this.isDraggedUp(dragEvent)) 
            this.makeActive();
        this.makeUnselected();
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