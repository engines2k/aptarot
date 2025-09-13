import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";
import { createCard, type Card } from "$lib/Cards";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(Observer);


export class Carousel {
    rootElement: HTMLElement;
    items: Array<CarouselItem> = [];
    cards: Array<Card> = [];
    state: CarouselState = createCarouselState();
    changeCard: (card: Card, index: number) => void;

    // Uses: rootElement, window, cards, viewportWidth, viewportHeight, selected, changeCard
    constructor(targetId: string, cards: Array<Card>, changeCard: (card: Card, index: number) => void) {
        this.rootElement = document.getElementById(targetId)!;
        this.refreshItems();
        this.initializeItemDraggables();
        this.initializeScrollObserver();
        this.cards = cards;
        this.changeCard = changeCard;
    }
    // Uses: items
    
    refreshItems() {
        this.items = Array.from(this.rootElement.children).map((el, i) => new CarouselItem(el, i, this));
    }
    
    initializeItemDraggables() {
        this.items.forEach(item => item.initializeItemDraggable());
    }
    
    initializeScrollObserver() {
        Observer.create({
            type: "wheel, touch, scroll",
            onChangeX: ({ deltaX }) => this.handleScroll(deltaX),
            onChangeY: ({ deltaY }) => this.handleScroll(deltaY)
        });
    }
    
    handleScroll(delta: number) {
        if (this.state.dragging) return;
        this.state.scrollPos += delta;
        this.updateAllCardPositions();
    }
    
    updateAllCardPositions() {
        this.items.forEach(item => item.updateItemPosition());
    }

    get length() {
        return this.items.length;
    }
}


class CarouselState {
    dragging: boolean;
    scrollPos: number;
    selected: number;
    window: Window;

    constructor(window: Window) {
        this.window = window;
        this.dragging = false;
        this.scrollPos = 0;
        this.selected = -1;
    }

    get viewportWidth() { return this.window.innerWidth; }
    get viewportHeight() { return this.window.innerHeight; }
}


class CarouselItem {
    type: string;
    element: Element;
    index: number;
    spreadFactor: number = 20;
    startPos: Position;
    angleMapper: (value: number) => number;

    // Uses: element, index, type, controller, angleMapper, spreadFactor, startPos
    constructor(element: Element, index: number, state: CarouselState) {
        this.element = element;
        this.index = index;
        this.type = element.getAttribute("data-carousel-item-type") || "unknown";
        this.angleMapper = gsap.utils.mapRange(0, state.viewportWidth, -this.spreadFactor / 2, this.spreadFactor / 2);
        this.updateItemPosition();
        
        // Initialize with default position
        this.startPos = new Position(0, 0, 1, 0);
    }

    // Uses: (no properties - static utility method)
    savePos(vars: Draggable.Vars) {
        return {
            x: vars.x,
            y: vars.y,
            scale: vars.scale,
            rotation: gsap.getProperty(vars.target, "rotation") as number
        }
    }

    // Uses: element, controller
    updateItemPosition() {
        let position = this.element.getBoundingClientRect();
        let translateX = this.calculateXTranslation();
        if (this.cardOutOfView()) return;
        return gsap.to(this.element, {
            x: translateX,
            y: this.calculateHeight(position.x),
            rotation: this.calculateAngle(position.x),
            scale: 1.1,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    // Uses: element, controller, index
    cardOutOfView() {
        let position = this.element.getBoundingClientRect();
        let leftBound = -100;
        let rightBound = this.controller.viewportWidth + 100;
        let magicIntendedX = this.index * 70 + this.calculateXTranslation();
        return  (position.x < leftBound && magicIntendedX < leftBound) ||
                (position.x > rightBound && magicIntendedX > rightBound);
    }

    
    
    
    // Uses: startPos, controller
    handleCardDrag(vars: Draggable.Vars) {
        if (this.cardIsDraggedUp(vars) && vars.target && vars.target.id)
            this.controller.selected = parseInt(vars.target.id);
        else this.controller.selected = -1;
    }

    // Uses: index, controller, spreadFactor
    calculateXTranslation() {
        const spread = (this.index - ((this.controller.length - 1) / 2)) * this.spreadFactor;
        return this.controller.scrollPos + spread;
    }

    // Uses: spreadFactor, controller
    calculateHeight(x: number) {
        //TODO Adjust height factor for different screen sizes instead of using a magic number lolol
        const height = this.spreadFactor * this.controller.viewportHeight / 300;
        let normalizedX = gsap.utils.normalize(0, this.controller.viewportWidth, x);
        // Create an arc using a parabolic formula 4x^2 - 4x.
        let y = (4 * normalizedX ** 2 - 4 * normalizedX) * height;
        return y;
    };

    // Uses: angleMapper
    calculateAngle(x: number) {
        return this.angleMapper(x);
    }
    // Uses: element, startPos
    initializeItemDraggable() {
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
    
    // Uses: controller
    handleCardPress(vars: Draggable.Vars) {
        
        this.controller.isDragging = true;
        gsap.to(vars.target, {
            scale: 1.1,
            rotate: 5,
            ease: "elastic.out(1, 0.5)",
            duration: .6
        });
    }
    // Uses: startPos
    cardIsDraggedUp(vars: Draggable.Vars) {
        return this.startPos.y - vars.y > 100;
    }

    // Uses: controller, startPos
    handleCardRelease(vars: Draggable.Vars) {
        this.controller.isDragging = false;
        this.putCardBack(vars)
        if (this.cardIsDraggedUp(vars)) {
            const cardIndex = parseInt(vars.target.id || "-1");
            this.controller.changeCard(this.controller.cards[cardIndex] || createCard({}), cardIndex);
        }
    }

    // Uses: controller, startPos
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

    // Uses: x, y, scale, rotation
    constructor(x: number, y: number, scale: number, rotation: number) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.rotation = rotation;
    }
}

