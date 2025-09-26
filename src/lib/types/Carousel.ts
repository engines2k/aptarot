import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";
import { type Card } from "$/lib/types/Card";
import { CarouselState } from "$lib/types/CarouselState";
import { CarouselItem, DraggableCarouselItem, CarouselCardItem } from "$lib/types/CarouselItem";
import { type CarouselSettings, createCarouselSettings } from "$lib/types/CarouselSettings";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(Observer);

export class Carousel {
    rootElement: HTMLElement;
    items: Array<CarouselItem> = [];
    state: CarouselState;
    settings: CarouselSettings;
    cardChangeFunc: (card: Card, index: number) => void;
    updatePositionFunc: (pos: string) => void;

    constructor(targetId: string, cardChangeFunc: (card: Card, index: number) => void, updatePositionFunc: (pos: string) => void) {
        this.rootElement = document.getElementById(targetId)!;
        this.state = new CarouselState(window, this.items.length);
        this.cardChangeFunc = cardChangeFunc;
        this.updatePositionFunc = updatePositionFunc;
        this.setItems();
        this.settings = createCarouselSettings(this.state);
        this.initialize();
    }
    
    private initialize() {
        this.initializeAllItemDraggables();
        this.initializeAllScrollObservers();
        this.initializeResizeObserver();
        this.fadeInUI();
    }

    private fadeInUI() {
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
        if (this.settings.scrollAfterActiveChange)
            window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    initializeAllItemDraggables() {
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

    private initializeAllScrollObservers() {
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
        if (this.ignoringScrollEvent())
            return;
        let boundedDelta = this.bindScrollDeltaToBounds(delta);
        this.state.scrollPos += boundedDelta;
        this.updateAllItemPositions();
        this.updatePositionFunc(this.scrollPosAsPercentageStr());
    }

    private ignoringScrollEvent() {
        if (this.state.userDraggingItem || this.cursorHoveringInteractive())
            return true;
        return false;
    }
    
    private cursorHoveringInteractive() {
        const valueEls = document.querySelectorAll('.ignore-scroll');
        for (const el of valueEls)
            if (el instanceof HTMLElement && el.matches(':hover'))
                return true;
        return false;
    }
    
    private bindScrollDeltaToBounds(delta: number) {
        if ((this.leftScrollBoundaryReached() && delta > 0) ||
            (this.rightScrollBoundaryReached() && delta < 0))
            return 0;
        return delta;
    }

    private leftScrollBoundaryReached() {
        if (this.state.scrollPos > this.getLeftScrollBoundary())
            return true;
        return false;
    }

    private rightScrollBoundaryReached() {
        if (this.state.scrollPos < this.getRightScrollBoundary())
            return true;
        return false;
    }

    private getLeftScrollBoundary() {
        let firstItemXPos = this.items[0].getOriginalPos().x;
        return (this.state.viewportWidth / 2) - firstItemXPos;
    }
    
    private getRightScrollBoundary() {
        let lastItemXPos = this.items[this.items.length - 1].getOriginalPos().x;
        return -(lastItemXPos - (this.state.viewportWidth / 2)) + 20;
    }

    updateAllItemPositions() {
        this.items.forEach(item => this.updateItemPosition(item));
    }

    scrollPosAsPercentageStr() {
        let leftBoundary = this.getLeftScrollBoundary();
        let rightBoundary = this.getRightScrollBoundary();
        let totalScrollableDistance = rightBoundary - leftBoundary;
        let currentScrollFromLeft = this.state.scrollPos - leftBoundary;
        return (currentScrollFromLeft / totalScrollableDistance).toFixed(2);
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