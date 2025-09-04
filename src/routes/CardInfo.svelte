<script lang="ts">
    import { gsap } from "gsap";
    import { onMount } from 'svelte';
    import CardSymbols from './CardSymbols.svelte';
    
    let { card } = $props();
    
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
            <div class="tarot-info-item dark:text-gray-100">
                <CardSymbols {card} />
            </div>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Letter:</span>
                <span class="text-2xl">
                    {card.letter}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Sphere:</span>
                {card.letter_association || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Archetype:</span>
                {card.archetype || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Correspondences:</span>
                {card.archetypal_correspondences || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Tree of life:</span>
                {card.tree_of_life || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Alchemical:</span>
                {card.alchemical || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Colloquial / informal labels:</span>
                {card.colloquial_informal || "None found"}
            </p>
            <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Qualities:</span>
                {card.qualities}
            </p>
            <!-- <p class="tarot-info-item dark:text-gray-100">
                <span class="tarot-subheading">Meme associations:</span>
                {card.memes}
            </p> -->
        </div>
    </div>
</div>

