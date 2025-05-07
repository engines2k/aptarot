<script lang="ts">
    let { card } = $props();
    import { gsap } from "gsap";
    import { onMount } from 'svelte';

    onMount(() => {
        gsap.to(".card-face", {
            scale: 1,
            rotate: 2,
            ease: "in-out",
            yoyo: true,
            repeat: -1,
            duration: 2
        })
    })

    $effect(() => {
        if (card.id != -1) {
            gsap.fromTo(".card-face",
            {
                scale: 1.1,
                rotate: 7,
                ease: "in-out",
                duration: 0.5
            }, {
                scale: 1,
                rotate: 0,
                ease: "in-out",
                duration: 0.5
            });
        }
    })
</script>

<div class="grid grid-cols-6 detail">
    <div class="col-span-2">
        <img
        class="card-face"
        src={card.image}
        alt="Tarot card"
        width=200
        />
    </div>
    <div class="col-span-4">
        <p class="tarot-title dark:text-gray-100">{card.name}</p>
        <div class="tarot-info">
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Symbol:</span>
                {card.symbol}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Qualities:</span>
                {card.qualities}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Letter:</span>
                {card.letter}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Letter association::</span>
                {card["letter association"] || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Archetype:</span>
                {card["achetype"] || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Correspondences:</span>
                {card["archetypal correspondences"] || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Tree of life:</span>
                {card["tree of life"] || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Alchemical:</span>
                {card["alchemical"] || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Colloquial / informal labels:</span>
                {card["colloquial/informal"] || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Meme associations:</span>
                {card.memes}
            </p>
        </div>
    </div>
</div>

<style>
    .tarot-title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .tarot-info {
        margin: auto;
        max-width: 500px;
        text-align: left;
    }

    .tarot-info-item {
        font-size: .8rem;
        margin-bottom: 7px;
    }

    .tarot-subheading {
        font-weight: bold;
        color: #ffc4b2;
    }

	.detail {
		min-height: 450px;
        margin:50px;
	}

    .card-face {
        width: 80%;
        image-rendering: pixelated;
    }

</style>