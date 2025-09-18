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
            scale: "1.1",
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

function hover(target: GSAPTweenTarget) {
    gsap.to(
        target,
        {
            rotate: .1,
            // scale: 1.1,
            ease: "in-out",
            yoyo: true,
            repeat: -1,
            duration: 2,
            y: -50,
        }
    );
}

function fadeIn(target: GSAPTweenTarget) {
    gsap.fromTo(
        target,
        {
            opacity: 0,
            y: 20,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
        }
    );
}

export default { jiggle, popIn, hover, fadeIn };

