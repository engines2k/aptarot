<script lang="ts">
    import { onMount } from "svelte";
    import CardAttribution from "$/components/CardAttribution.svelte";
    import BirthdayExamples from "./BirthdayExamples.svelte";
    import CardDetail from "$/components/CardDetail.svelte";
    import animations from "$/lib/animations";
    import { createCard,
        type MajorArcanaCard,
        type MinorArcanaCard,
        type CourtCard 
    } from "$/lib/types/Card";

    let { card } = $props();
    card = card || createCard();

    onMount(() => {
       animations.hover(".card-face");
    });

    $effect(() => {
        if (card.id != -1)
            animations.popIn(".card-face");
    });

</script>

<div id="tarot-info" class="tarot-info grid grid-cols-12 detail">
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
        <div class="grid grid-cols-2 tarot-detail">
            <div class="col-span-1 pr-4">
                <CardDetail label="Meaning" value={card.meaning} />
                {#if card.type === "Minor Arcana" || card.type === "Court Cards"}
                    <CardDetail label="Tree of life (Sephira)" value={card.tree_of_life_sefira} />
                {/if}
                {#if card.type === "Minor Arcana" || card.type === "Court Cards"}
                    <CardDetail label="Suit Element" value={card.suit_element} />
                {/if}
                {#if card.type === "Major Arcana"}
                    <CardDetail label="Tree of life (Path)" value={card.tree_of_life_path} />
                {#if card.type === "Court Card"}
                    <BirthdayExamples value={card.birthday_examples} />
                {/if}
                {/if}
            </div>
            <div class="col-span-1">
                {#if card.type === "Minor Arcana" || card.type === "Court Cards"}
                <CardDetail label="Division of Creation" value={card.division_of_creation} />
                {/if}
                {#if card.type === "Minor Arcana" || card.type === "Court Cards"}
                <CardDetail label="Part of Soul" value={card.part_of_soul} />
                {/if}
                {#if card.type === "Major Arcana"}
                    <CardDetail label="Hebrew Letter" value={card.hebrew_letter} />
                {/if}
                {#if card.type === "Major Arcana" || card.type === "Court Cards"}
                    <CardDetail label="Letter Association" value={card.letter_association} />
                {/if}
                {#if card.type === "Court Card"}
                    <CardDetail label="Dates" value={card.dates} />
                {/if}
            </div>
        </div>
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
}

.divider {
    max-width:50px;
    border-bottom: 1px solid #ccc;
    margin: 3px 0 3px 0;
}
</style>