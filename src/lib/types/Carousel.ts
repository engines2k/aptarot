import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";
import { createCard, type Card } from "$/lib/types/Card";

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



class CarouselItem {
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

class DraggableCarouselItem extends CarouselItem {
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

class CarouselCardItem extends DraggableCarouselItem {
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

class CarouselState {
    dragging: boolean;
    scrollPos: number;
    selected: number;
    window: Window;
    numItems: number;
    get viewportWidth() { return this.window.innerWidth; }
    get viewportHeight() { return this.window.innerHeight; }

    constructor(window: Window, numItems: number) {
        this.window = window;
        this.dragging = false;
        this.scrollPos = 0;
        this.selected = -1;
        this.numItems = numItems;
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