<script lang="ts">
	import type { Card } from "$/lib/types/Card";

	let { card, index } = $props<{ card: Card; index: number }>();
</script>

<div
	class="carousel-item carousel-card mx-1 lg:mx-2"
	data-carousel-item-type="card"
	data-card={JSON.stringify(card)}
	id={String(index)}
>
	<img
		src={`/cards/small/${card.image}`}
		alt="Playing card"
		width="100"
		draggable="false"
	/>
</div>

<style>
	.carousel-card img {
		width: 70px;
		height: auto;
		display: block;
		image-rendering: pixelated;
	}

	.carousel-card {
		width: 70px;
	}

	@media (max-width: 40rem) {
		.carousel-card {
			width: 50px;
		}
	}
</style>
