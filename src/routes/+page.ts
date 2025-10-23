export const prerender = true;

import type { PageLoad } from './$types';

function loadImage(src: string) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve({ src, img });
		img.onerror = reject;
		img.src = src;
	});
}

async function loadAllImagesFromCards(cards) {
	try {
		const results = await Promise.all(imageSrcs.map(loadImage));

		// Store in dictionary with src as key
		results.forEach(({ src, img }) => {
			images[src] = img;
		});

		images = images; // Trigger reactivity
		loading = false;
	} catch (error) {
		console.error('Failed to load images:', error);
		loading = false;
	}
}
