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
    state: CarouselState;
    settings: CarouselSettings;
    cardChangeFunc: (card: Card, index: number) => void;

    constructor(targetId: string, cardChangeFunc: (card: Card, index: number) => void) {
        this.rootElement = document.getElementById(targetId)!;
        this.state = new CarouselState(window, this.items.length);
        this.setItems();
        this.settings = createCarouselSettings(this.state);
        this.cardChangeFunc = cardChangeFunc;
        this.initializeItemDraggables();
        this.initializeScrollObservers();
        this.initializeResizeObserver();
        this.fadeIn();
    }

    private fadeIn() {
        gsap.fromTo(this.rootElement, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });
        this.rootElement.classList.remove("hide-until-loaded");
    }
    
    private initializeResizeObserver() {
        const mediaQuery = window.matchMedia("(max-width: 40rem)");
        mediaQuery.addEventListener("change", this.handleWindowResize.bind(this));
    }

    private handleWindowResize(e: MediaQueryListEvent) {
        if(e.matches) {
            this.setItems();
        }
    }

    private setItems() {
        this.items = [];
        let rootElements = Array.from(this.rootElement.children)
        for (let i=0; i < rootElements.length; i++) {
            this.push(rootElements[i], i);
        }
    }
    
    private push(element: Element, index: number) {
        let item: CarouselItem;
        let itemType = element.attributes.getNamedItem("data-carousel-item-type")?.value;
        if (itemType == "card")
            item = new CarouselCardItem(element, index, this.state);
        else
            item = new CarouselItem(element, index, this.state);
        this.items.push(item);
    }
    
    goToRandom() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.length);
        } while (!this.isSelectableIndex(randomIndex));
        this.goToIndex(randomIndex);
    }

    goToPrevious() {
        let prev = 1;
        while(!this.isSelectableIndex(this.state.activeIndex - prev)
            && this.state.activeIndex - prev >= 0)
            prev++;
        this.goToIndex(this.state.activeIndex - prev);
    }

    goToNext() {
        let next = 1;
        while(!this.isSelectableIndex(this.state.activeIndex + next)
            && this.state.activeIndex + next < this.length)
            next++;
        this.goToIndex(this.state.activeIndex + next);
    }

    isSelectableIndex(index: number) {
        return this.items[index] instanceof CarouselCardItem;
    }

    goToIndex(index: number) {
        if (index < 0 || index >= this.length) return;
        let targetItem = this.items[index];
        const spread = (targetItem.index - ((this.length - 1) / 2));
        this.state.scrollPos = (this.state.viewportWidth / 2) - targetItem.getOriginalPos().x - spread;
        this.updateAllItemPositions();
        if (targetItem instanceof CarouselCardItem) {
            this.makeActiveItem(targetItem);
        }
    }

    makeActiveItem(item: CarouselCardItem) {
        this.cardChangeFunc(item.cardData, item.index);
        const oldActive = this.items[this.state.activeIndex];
        if (oldActive instanceof CarouselCardItem)
            oldActive.makeInactive();
        item.makeActive();
        this.state.activeIndex = item.index;
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
        item.setPos(item.savePos(draggable));
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
            this.makeActiveItem(item)
    }

    private initializeScrollObservers() {
        Observer.create({
            type: "wheel, scroll",
            onChangeX: ({ deltaX }) => this.handleScrollEvent(deltaX),
            onChangeY: ({ deltaY }) => this.handleScrollEvent(deltaY)
        });
        Observer.create({
            type: "touch",
            onChangeX: ({ deltaX }) => this.handleScrollEvent(deltaX),
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
        let newXOffset = this.calculateXTranslation(item);
        if (this.itemOutOfView(item))
            return;
        let originalX = item.getOriginalPos().x;
        gsap.to(item.element, {
            x: newXOffset,
            y: this.calculateItemHeight(originalX + newXOffset),
            rotation: this.calculateItemAngle(originalX + newXOffset),
            scale: 1,
            duration: 0.4,
            ease: "expo.out"
        });
    }


    private calculateXTranslation(item: CarouselItem) {
        const spread = (item.index - ((this.length - 1) / 2));
        let x = this.state.scrollPos + spread;
        return x;
    }
    
    private itemOutOfView(item: CarouselItem) {
        let leftBound = this.settings.leftBound();
        let rightBound = this.settings.rightBound();
        let nextX = item.originalPosition.x + this.calculateXTranslation(item);
        return (item.x < leftBound && nextX < leftBound) ||
        (item.x > rightBound && nextX > rightBound);
    }

    private calculateItemHeight(x: number) {
        return this.settings.heightMapper(x, this.state);
    }

    private calculateItemAngle(x: number) {
        return this.settings.angleMapper(x, this.state);
    }

    get length() {
        return this.items.length;
    }
}


interface CarouselSettings {
    spreadFactor: number;
    leftBound: () => number;
    rightBound: () => number;
    angleMapper: (x: number, state: CarouselState) => number;
    heightMapper: (x: number, state: CarouselState) => number;
}

function createCarouselSettings(state: CarouselState): CarouselSettings {
    return {
        spreadFactor: 20,
        leftBound() {
            return -125;
        },
        rightBound() {
            return state.viewportWidth + 125;
        },
        angleMapper(x: number, state: CarouselState) {
            return gsap.utils.mapRange(0, state.viewportWidth, -this.spreadFactor / 1.25, this.spreadFactor / 1.25)(x);
        },
        //TODO Adjust height factor for different screen sizes instead of using a magic number lolol
        heightMapper(x: number, state: CarouselState) {
            const heightMult = this.spreadFactor * state.viewportHeight / 300;
            let normalizedX = gsap.utils.normalize(0, state.viewportWidth, x);
            let y = (4 * normalizedX ** 2 - 4 * normalizedX) * heightMult; // Create an arc using a parabolic formula 4x^2 - 4x.
            let floor = 15;
            if (y > floor)
                y = floor;
            return y;
        }
    }
}