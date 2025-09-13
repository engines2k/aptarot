import { gsap } from "gsap";

function jiggle(target: GSAPTweenTarget) {
    gsap.to(
        target,
        {
            scale: 1,
            rotate: 2,
            ease: "in-out",
            yoyo: true,
            repeat: -1,
            duration: 2,
        }
    );
}

function popIn(target: GSAPTweenTarget) {
    gsap.fromTo(
        ".card-face",
        {
            scale: 1.1,
            rotate: 7,
            ease: "in-out",
            duration: 0.5,
        },
        {
            scale: 1,
            rotate: 0,
            ease: "in-out",
            duration: 0.5,
        },
    );
}

export default { jiggle, popIn };

