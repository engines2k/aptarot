<script lang="ts">
    import { onMount } from "svelte";
    import CardAttribution from "$/components/CardAttribution.svelte";
    import CardDetails from "$/components/CardDetails.svelte";
    import animations from "$/lib/animations";
    import { createCard } from "$/lib/types/Card";

    let { card } = $props();
    card = card || createCard();

    onMount(() => {
        animations.hover(".card-face");
    });

    $effect(() => {
        if (card.id != -1) animations.popIn(".card-face");
    });

    $effect(() => {
        if (card.id != -1) {
            animations.fadeIn("#tarot-info");
        }
    });
</script>

<div
    id="tarot-info"
    class="
    tarot-info
    grid
    grid-cols-5
    lg:grid-cols-12
    mt-4
    mx-2
    pb-22
    "
>
    <div class="col-span-2 lg:col-span-5">
        <div class="card-face-container justify-left md:justify-end">
            <img
                class="card-face"
                src={card.image}
                alt="Tarot card"
                width="200"
            />
        </div>
    </div>
    <div class="col-span-3 lg:col-span-7 ml-4 lg:ml-8 mt-2">
        <div class="card-heading">
            <p class="tarot-card-name dark:text-gray-100">{card.name}</p>
            <p class="tarot-ti dark:text-gray-100">{card.original_title}</p>
            <CardAttribution attribution={card.attribution} />
            <div class="divider"></div>
            <p class="tarot-ti dark:text-gray-100 text-sm">{card.type}</p>
            <div class="hidden lg:block">
                <CardDetails {card} />
            </div>
        </div>
    </div>
    <div class="col-span-5 mx-1 lg:hidden">
        <CardDetails {card} />
    </div>
</div>

<style scoped>
    @media (max-width: 40rem) {
        #tarot-info {
            position: absolute;
            top:10vh;
        }
    }

    #tarot-info {
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .card-heading, .card-heading p {
        line-height: 1.04em;
        margin-bottom:7px;
    }

    .tarot-card-name {
        font-size: clamp(1.5rem, 9vw, 2.5rem);
    }

    .card-face-container {
        /* padding-top:2.5vh; */
        max-width: 400px;
        width: 100%;
        display: flex;
        align-items: center;
    }

    .divider {
        max-width: 50px;
        border-bottom: 1px solid #2c2c2c;
        margin: 3px 0 3px 0;
    }
</style>
