import { type Card } from "$/lib/types/Card";
import { type CarouselSettings, createCarouselSettings } from "$lib/types/CarouselSettings";
import { Draggable } from "gsap/Draggable";
import { CarouselState } from "$lib/types/CarouselState";
import { CarouselItem, DraggableCarouselItem, CarouselCardItem } from "$lib/types/CarouselItem";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(Observer);

export class Carousel {
    rootElement: HTMLElement;
    items: Array<CarouselItem> = [];
    state: CarouselState;
    settings: CarouselSettings;
    cardChangeFunc: (card: Card, index: number) => void;
    updatePositionFunc: (pos: number) => void;

    constructor(targetId: string, cardChangeFunc: (card: Card, index: number) => void, updatePositionFunc: (pos: number) => void) {
        this.rootElement = document.getElementById(targetId)!;
        this.state = new CarouselState(window, this.items.length);
        this.cardChangeFunc = cardChangeFunc;
        this.updatePositionFunc = updatePositionFunc;
        this.setItems();
        this.settings = createCarouselSettings(this.state);
        this.initialize();
    }

    private setItems() {
        this.items = [];
        let rootElements = Array.from(this.rootElement.children)
        for (let i = 0; i < rootElements.length; i++) {
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


    private initialize() {
        this.initializeAllItemDraggables();
        this.initializeAllScrollObservers();
        this.initializeResizeObserver();
        this.fadeInUI();
        this.updateAllItemPositions();
    }

    private initializeAllItemDraggables() {
        this.items.forEach(item => {
            if (item instanceof DraggableCarouselItem)
                this.initializeItemDraggable(item)
        });
    }

    private initializeItemDraggable(item: CarouselItem) {
        let self = this;
        Draggable.create(item.element, {
            type: "x,y",
            onPress: function () { self.handleItemPress(item, this) },
            onDrag: function () { self.handleItemDrag(item, this) },
            onRelease: function () { self.handleItemDragRelease(item, this) },
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

    private handleCardRelease(item: CarouselCardItem, dragEvent: Draggable.Vars) {
        if (item.isDraggedUp(dragEvent))
            this.makeActiveItem(item)
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
        this.updateScrollPos(delta);
        this.updateAllItemPositions();
    }

    private updateAllItemPositions() {
        this.items.forEach(item => this.updateItemPosition(item));
        this.updatePositionFunc(Number(this.getNormalizedScrollPos()));
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

    
    private getNormalizedScrollPos() {
        let leftBoundary = this.getLeftScrollBoundary();
        let rightBoundary = this.getRightScrollBoundary();
        let totalScrollableDistance = rightBoundary - leftBoundary;
        let currentScrollFromLeft = this.state.scrollPos - leftBoundary;
        return (currentScrollFromLeft / totalScrollableDistance).toFixed(2);
    }

    private updateScrollPos(delta: number) {
        this.state.scrollPos += delta;
        if (this.state.scrollPos > this.getLeftScrollBoundary())
            this.state.scrollPos = this.getLeftScrollBoundary();
        if (this.state.scrollPos < this.getRightScrollBoundary())
            this.state.scrollPos = this.getRightScrollBoundary();
    }

    private getLeftScrollBoundary() {
        let firstItemXPos = this.items[0].getOriginalPos().x;
        return (this.state.viewportWidth / 2) - firstItemXPos;
    }

    private getRightScrollBoundary() {
        let lastItemXPos = this.items[this.items.length - 1].getOriginalPos().x;
        return -(lastItemXPos - (this.state.viewportWidth / 2));
    }

    private ignoringScrollEvent() {
        if (this.state.userDraggingItem || this.cursorHoveringInteractive())
            return true;
        return false;
    }

    private cursorHoveringInteractive() {
        const valueEls = document.querySelectorAll('.carousel-ignore-scroll');
        for (const el of valueEls)
            if (el instanceof HTMLElement && el.matches(':hover'))
                return true;
        return false;
    }


    private initializeResizeObserver() {
        const mediaQuery = window.matchMedia("(max-width: 40rem)");
        mediaQuery.addEventListener("change", this.handleWindowResize.bind(this));
    }

    private handleWindowResize(e: MediaQueryListEvent) {
        if (e.matches) {
            this.setItems();
        }
    }


    private fadeInUI() {
        gsap.fromTo(this.rootElement, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });
        this.rootElement.classList.remove("hide-until-loaded");
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


    goToRandom() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.length);
        } while (!this.isSelectableIndex(randomIndex));
        this.goToIndex(randomIndex);
    }

    goToPrevious() {
        let prev = 1;
        while (!this.isSelectableIndex(this.state.activeIndex - prev)
            && this.state.activeIndex - prev >= 0)
            prev++;
        this.goToIndex(this.state.activeIndex - prev);
    }

    goToNext() {
        let next = 1;
        while (!this.isSelectableIndex(this.state.activeIndex + next)
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

    goToPosition(normalizedPos: number) {
        if (isNaN(normalizedPos) || normalizedPos < 0 || normalizedPos > 1)
            throw new Error("Position must be a number between 0 and 1");
        let leftBoundary = this.getLeftScrollBoundary();
        let rightBoundary = this.getRightScrollBoundary();
        let totalScrollableDistance = rightBoundary - leftBoundary;
        this.state.scrollPos = leftBoundary + (totalScrollableDistance * normalizedPos);
        this.updateAllItemPositions();
    }

    get length() {
        return this.items.length;
    }
}