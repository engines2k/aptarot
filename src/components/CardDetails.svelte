<script lang="ts">
    import CardDetail from "$/components/CardDetail.svelte";
    import BirthdayExamples from "./BirthdayExamples.svelte";
    let { card } = $props();
</script>
<div class="tarot-details grid grid-cols-2 gap-4">
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