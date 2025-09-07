<script lang="ts">
    import { gsap } from "gsap";
    import { onMount } from "svelte";
    import CardAttribution from "./CardAttribution.svelte";
    import CardDetail from "./CardDetail.svelte";

    let { card } = $props();

    onMount(() => {
        gsap.to(".card-face", {
            scale: 1,
            rotate: 2,
            ease: "in-out",
            yoyo: true,
            repeat: -1,
            duration: 2,
        });
    });

    $effect(() => {
        if (card.id != -1) {
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
    });
</script>

<div id="tarot-info" class="tarot-info grid grid-cols-12 detail">
    <div class="col-span-5">
        <div class="card-face-container">
            <img class="card-face" src={card.image} alt="Tarot card" width="200" />
        </div>
    </div>
    <div class="col-span-7">
        <div class="card-heading">
            <p class="tarot-card-name dark:text-gray-100">{card.name}</p>
            <p class="tarot-ti dark:text-gray-100">{card.original_title}</p>
            <CardAttribution attribution={card.attribution} />
        </div>
        <div class="grid grid-cols-2 tarot-detail">
            <div class="col-span-1 pr-4">
                <CardDetail label="Tree of life (Path)" value={card.tree_of_life_path} />
                <CardDetail label="Hebrew Letter" value={card.letter} />
                <CardDetail label="Part of Soul" value={card.part_of_soul} />
                <CardDetail label="Birthday Examples" value={card.birthday_examples} />
                <CardDetail label="Meaning" value={card.meaning} />
            </div>
            <div class="col-span-1">
                <CardDetail label="Tree of life (Sephira)" value={card.tree_of_life_sefira} />
                <CardDetail label="Suit Element" value={card.suit_element} />
                <CardDetail label="Division of Creation" value={card.division_of_creation} />
                <CardDetail label="Dates" value={card.dates} />
            </div>
        </div>
    </div>
</div>
