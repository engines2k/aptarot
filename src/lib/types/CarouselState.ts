export class CarouselState {
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