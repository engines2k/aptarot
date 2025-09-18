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
        if (card.id != -1)
            animations.popIn(".card-face");
    });

    $effect(() => {
        if (card.id != -1) {
            animations.fadeIn("#tarot-info");
        }
    });

</script>

<div id="tarot-info" class="tarot-info grid grid-cols-5 md:grid-cols-12 detail">
    <div class="col-span-4 lg:col-span-5">
        <div class="card-face-container">
            <img class="card-face" src={card.image} alt="Tarot card" width="200" />
        </div>
    </div>
    <div class="col-span-8 lg:col-span-7 ml-8">
        <div class="card-heading">
            <p class="tarot-card-name dark:text-gray-100">{card.name}</p>
            <p class="tarot-ti dark:text-gray-100">{card.original_title}</p>
            <CardAttribution attribution={card.attribution} />
            <div class="divider"></div>
            <p class="tarot-ti dark:text-gray-100 text-sm">{card.type}</p>
        </div>        
        <CardDetails {card} />
    </div>
</div>

<style scoped>
#tarot-info {
    margin: 50px;
}

.card-face-container {
    max-width:400px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 25px;
}

.divider {
    max-width:50px;
    border-bottom: 1px solid #ccc;
    margin: 3px 0 3px 0;
}
</style>