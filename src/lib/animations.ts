import { gsap } from "gsap/dist/gsap";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
import { MotionPathHelper } from "gsap/dist/MotionPathHelper";

gsap.registerPlugin(MotionPathPlugin, MotionPathHelper);

export default { jiggle, popIn, hover, fadeIn, introSwirl, swirlFromScreenCenter };

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


function introSwirl(target: GSAPTweenTarget) {
	// Get the window width and element's bounding rect
	const el = typeof target === "string" ? document.querySelector(target) : target as Element;
	if (!el) return;
	const rect = el.getBoundingClientRect();
	const fromX = rect.left < window.innerWidth / 2 ? -window.innerWidth : window.innerWidth;

	gsap.fromTo(
		el,
		{
			x: fromX,
			scale: 0.5,
			rotation: 60,
			opacity: 0.7,
		},
		{
			x: 0,
			scale: 1,
			rotation: 0,
			opacity: 1,
			duration: 1.5,
			ease: "power2.out",
			onComplete: () => {
				// Optionally, add a little swirl at the end
				gsap.to(el, {
					rotation: 3,
					duration: 0.3,
					yoyo: true,
					repeat: 1,
					ease: "power1.inOut"
				});
			}
		}
	);

}



function popIn(target: GSAPTweenTarget) {
	gsap.fromTo(
		target,
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
			// scale: 1.1,
			ease: "power1.inOut",
			yoyo: true,
			repeat: -1,
			duration: 3,
			y: "-2vh",
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

function swirlFromScreenCenter(target: GSAPTweenTarget) {
	if (!target || !(target instanceof HTMLElement))
		throw Error(`Target ${target} invalid for swirlFromScreenCenter function`);

	const box = target.getBoundingClientRect();
	const currentRotation = gsap.getProperty(target, "rotation") as number;

	gsap.fromTo(
		target,
		{
			x: (window.innerWidth / 2) - (box.x - box.width / 2),
			y: (window.innerHeight / 2) - (box.y - box.height / 2),
			rotation: currentRotation - 50,
		},
		{
			x: 0,
			y: 0,
			rotation: currentRotation,
			duration: 0.7,
			ease: "power2.out",
		}
	);
}


