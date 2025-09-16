import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";
import { type Card } from "$/lib/types/Card";
import { CarouselState } from "$lib/types/CarouselState";
import { CarouselItem, DraggableCarouselItem, CarouselCardItem } from "$lib/types/CarouselItem";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(Observer);


export class Carousel {
    rootElement: HTMLElement;
    items: Array<CarouselItem> = [];
    cards: Array<Card> = [];
    state: CarouselState;
    settings: CarouselSettings;
    emitFunc: (card: Card, index: number) => void;

    constructor(targetId: string, changeCard: (card: Card, index: number) => void) {
        this.rootElement = document.getElementById(targetId)!;
        this.state = new CarouselState(window, this.items.length);
        this.setItems();
        this.settings = createDefaultCarouselSettings(this.state);
        this.emitFunc = changeCard;
        this.initializeItemDraggables();
        this.initializeScrollObserver();
    }
    
    setItems() {
        let rootElements = Array.from(this.rootElement.children)
        for (let i=0; i < rootElements.length; i++) {
            this.push(rootElements[i], i);
        }
    }
    
    push(element: Element, index: number) {
        let item: CarouselItem;
        let itemType = element.attributes.getNamedItem("data-carousel-item-type")?.value;
        if (itemType == "card")
            item = new CarouselCardItem(element, index, this.state);
        else
            item = new CarouselItem(element, index, this.state);
        this.items.push(item);
    }

    initializeItemDraggables() {
        this.items.forEach(item => {
            if (item instanceof DraggableCarouselItem)
                this.initializeItemDraggable(item)
        });
    }

    initializeItemDraggable(item: CarouselItem) {
        let self = this;
        Draggable.create(item.element, {
            type: "x,y",
            onPress: function() { self.handleItemPress(item, this) },
            onDrag: function() { self.handleItemDrag(item, this) },
            onRelease: function() { self.handleItemDragRelease(item, this) },
        });
        const draggable = Draggable.get(item.element);
        item.startPos = item.savePos(draggable);
    }

    private handleItemDrag(item: CarouselItem, dragEvent: Draggable.Vars) {
        item.handleDrag(dragEvent);
    }
    
    private handleItemPress(item: CarouselItem, dragEvent: Draggable.Vars) {
        item.handlePress(dragEvent);
    }
    
    private handleItemDragRelease(item: CarouselItem, dragEvent: Draggable.Vars) {
        item.handleDragRelease(dragEvent);
        if (item instanceof CarouselCardItem)
            this.handleCardRelease(item, dragEvent);
    }

    handleCardRelease(item: CarouselCardItem, dragEvent: Draggable.Vars) {
        if (item.isDraggedUp(dragEvent))
            item.makeActive();
        this.emitFunc(item.cardData, item.index);
    }
    
    private initializeScrollObserver() {
        Observer.create({
            type: "wheel, touch, scroll",
            onChangeX: ({ deltaX }) => this.handleScrollEvent(deltaX),
            onChangeY: ({ deltaY }) => this.handleScrollEvent(deltaY)
        });
    }
    
    private handleScrollEvent(delta: number) {
        if (this.state.dragging) return;
        this.state.scrollPos += delta;
        this.updateAllItemPositions();
    }
    
    private updateAllItemPositions() {
        this.items.forEach(item => this.updateItemPosition(item));
    }

    private updateItemPosition(item: CarouselItem) {
        let newX = this.calculateXTranslation(item);
        if (this.itemOutOfView(item))
            return;
        gsap.to(item.element, {
            x: newX,
            y: this.calculateItemHeight(item),
            rotation: this.calculateItemAngle(item),
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    private calculateXTranslation(item: CarouselItem) {
        const spread = (item.index - ((this.length - 1) / 2)) * this.settings.spreadFactor;
        return this.state.scrollPos + spread;
    }
    
    private itemOutOfView(item: CarouselItem) {
        let leftBound = -125;
        let rightBound = this.state.viewportWidth + 125;
        let magicIntendedX = item.index * 70 + this.calculateXTranslation(item);
        return (item.x < leftBound && magicIntendedX < leftBound) ||
        (item.x > rightBound && magicIntendedX > rightBound);
    }

    private calculateItemHeight(item: CarouselItem) {
        let position = item.element.getBoundingClientRect();
        return this.settings.heightMapper(item, this.state);
    }

    private calculateItemAngle(item: CarouselItem) {
        let position = item.element.getBoundingClientRect();
        return this.settings.angleMapper(item, this.state);
    }

    get length() {
        return this.items.length;
    }
}



interface CarouselSettings {
    spreadFactor: number;
    angleMapper: (item: CarouselItem, state: CarouselState) => number;
    heightMapper: (item: CarouselItem, state: CarouselState) => number;
}

function createDefaultCarouselSettings(state: CarouselState): CarouselSettings {
    return {
        spreadFactor: 20,
        angleMapper(item: CarouselItem, state: CarouselState) {
            return gsap.utils.mapRange(0, state.viewportWidth, -this.spreadFactor / 2, this.spreadFactor / 2)(item.x);
        },
        //TODO Adjust height factor for different screen sizes instead of using a magic number lolol
        heightMapper(item: CarouselItem, state: CarouselState) {
            const heightMult = this.spreadFactor * state.viewportHeight / 300;
            let normalizedX = gsap.utils.normalize(0, state.viewportWidth, item.x);
            let y = (4 * normalizedX ** 2 - 4 * normalizedX) * heightMult; // Create an arc using a parabolic formula 4x^2 - 4x.
            return y;
        }
    }
}