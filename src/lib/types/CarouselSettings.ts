import { CarouselState } from '$lib/types/CarouselState';
import { gsap } from 'gsap';

export interface CarouselSettings {
    scrollAfterActiveChange: boolean;
    spreadFactor: number;
    leftBound: () => number;
    rightBound: () => number;
    angleMapper: (x: number, state: CarouselState) => number;
    heightMapper: (x: number, state: CarouselState) => number;
}

export function createCarouselSettings(state: CarouselState): CarouselSettings {
    return {
        scrollAfterActiveChange: true,
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