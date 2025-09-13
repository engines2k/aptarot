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
    state: CarouselState;
    settings: CarouselSettings;
    changeCard: (card: Card, index: number) => void;

    constructor(targetId: string, changeCard: (card: Card, index: number) => void) {
        this.rootElement = document.getElementById(targetId)!;
        this.state = new CarouselState(window, this.items.length);
        this.setItems();
        this.settings = createDefaultCarouselSettings(this.state);
        this.changeCard = changeCard;
        this.initializeItemDraggables();
        this.initializeScrollObserver();
    }
    
    setItems() {
        this.items = Array.from(this.rootElement.children).map((el, i) => new CarouselItem(el, i, this.state));
       
    }
    
    initializeItemDraggables() {
        this.items.forEach(item => this.initializeItemDraggable(item));
    }

    initializeItemDraggable(item: CarouselItem) {
        let self = this;
        Draggable.create(item.element, {
            type: "x,y",
            onDrag: function() { self.handleItemDrag(item, this) },
            onPress: function() { self.handleItemPress(item, this) },
            onRelease: function() { self.handleItemRelease(item, this) },
        });
        const draggable = Draggable.get(item.element);
        item.startPos = item.savePos(draggable);

    }

    private handleItemDrag(item: CarouselItem, vars: Draggable.Vars) {
        item.handleDrag(vars);
    }
    
    private handleItemPress(item: CarouselItem, vars: Draggable.Vars) {
        item.handlePress(vars);
    }
    
    private handleItemRelease(item: CarouselItem, vars: Draggable.Vars) {
        item.handleRelease(vars);
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
        let translateX = this.calculateXTranslation(item);
        if (this.itemOutOfView(item)) return;
        return gsap.to(item.element, {
            x: translateX,
            y: this.calculateItemHeight(item),
            rotation: this.calculateItemAngle(item),
            scale: 1.1,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    private calculateItemHeight(item: CarouselItem) {
        let position = item.element.getBoundingClientRect();
        return this.settings.heightMapper(item, this.state);
    }

    private calculateItemAngle(item: CarouselItem) {
        let position = item.element.getBoundingClientRect();
        return this.settings.angleMapper(item, this.state);
    }

    private itemOutOfView(item: CarouselItem) {
        let leftBound = -100;
        let rightBound = this.state.viewportWidth + 100;
        let magicIntendedX = item.index * 70 + this.calculateXTranslation(item);
        return  (item.x < leftBound && magicIntendedX < leftBound) ||
        (item.x > rightBound && magicIntendedX > rightBound);
    }

    private calculateXTranslation(item: CarouselItem) {
        const spread = (item.index - ((this.length - 1) / 2)) * this.settings.spreadFactor;
        return this.state.scrollPos + spread;
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

    savePos(vars: Draggable.Vars) {
        return {
            x: vars.x,
            y: vars.y,
            scale: vars.scale,
            rotation: gsap.getProperty(vars.target, "rotation") as number
        }
    }
    
    handleDrag(vars: Draggable.Vars) {
        if (this.itemIsDraggedUp(vars) && vars.target && vars.target.id)
            this.state.selected = parseInt(vars.target.id);
        else this.state.selected = -1;
    }

    handlePress(vars: Draggable.Vars) {
        this.state.dragging = true;
        this.startPos = this.savePos(vars);
        gsap.to(vars.target, {
            scale: 1.1,
            rotate: 5,
            ease: "elastic.out(1, 0.5)",
            duration: .6
        });
    }

    itemIsDraggedUp(vars: Draggable.Vars) {
        return this.startPos.y - vars.y > 100;
    }

    handleRelease(vars: Draggable.Vars) {
        this.state.dragging = false;
        if (this.itemIsDraggedUp(vars)) {
            const itemIndex = parseInt(vars.target.id || "-1");
            this.state.selected = 1;
        }
        this.putMeBack(vars)
    }
    
    putMeBack(vars: Draggable.Vars) {
        let itemId = vars.target.id
        let scale = this.state.selected == itemId ? 1.1 : 1;
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