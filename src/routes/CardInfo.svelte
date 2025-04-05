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
        <p>{card.name}</p>
    </div>
</div>

<style>
	.detail {
		min-height: 200px;
        margin:50px;
	}

    .card-face {
        width: 100%;
        image-rendering: pixelated;
    }

</style>