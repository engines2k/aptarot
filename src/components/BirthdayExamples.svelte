<script lang="ts">
    let { card } = $props();
</script>
<div class="carousel-ignore-scroll birthday-item dark:text-gray-100">
    <div class="label">Birthday Examples</div>
    {#if card.birthday_examples }
    <div class="text-sm value">
        {#each card.birthday_examples as example}
            <div>{example}</div>
        {/each}
    </div>
    {/if}
</div>

<style>
    .birthday-item {
        font-size: 1.2rem;
        margin-bottom: 20px;
        color: #e5e7eb;
    }
    
    .label {
        font-size:.8rem;
        font-weight: bold;
        color: #ffc4b2;
    }
    
    .value {
        overscroll-behavior: contain;
        margin-bottom: 2px;
        color: #e5e7eb;
        max-height:100px;
        overflow-y:scroll;
    }
</style>
