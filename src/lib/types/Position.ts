export class Position {
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

export class PositionFactory {
    static fromElement(element: Element): Position {
        let rect = element.getBoundingClientRect();
        return new Position(rect.x, rect.y, 1, 0);
    }
}