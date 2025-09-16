export class CarouselState {
    dragging: boolean;
    scrollPos: number;
    selectedIndex: number;
    activeIndex: number;
    window: Window;
    numItems: number;
    get viewportWidth() { return this.window.innerWidth; }
    get viewportHeight() { return this.window.innerHeight; }

    constructor(window: Window, numItems: number) {
        this.window = window;
        this.dragging = false;
        this.scrollPos = 0;
        this.selectedIndex = -1;
        this.activeIndex = -1
        this.numItems = numItems;
    }
}