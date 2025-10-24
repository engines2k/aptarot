import { prepareCardData } from '$/lib/types/Card';
import cardData from '$/lib/data/card-data.json';
import { browser } from '$app/environment';

export const prerender = true;

export async function load() {
	const cards = prepareCardData(cardData);

	if (browser) {
		const imagePromises = cards.map((card) => {
			if (card.image) {
				return new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = () => resolve(card.image);
					img.onerror = reject;
					img.src = `/cards/regular/${card.image}`;
				});
			}
			return Promise.resolve();
		});

		await Promise.allSettled(imagePromises);
	}

	return {
		cards
	};
}
