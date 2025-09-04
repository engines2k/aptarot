<script lang="ts">
    import elementSymbols from '$lib/element-symbols.json';

    let { card } = $props();
    let primarySymbol = $derived(card?.symbol?.primary);
    let secondarySymbol = $derived(card?.symbol?.secondary);

    function getElementSymbolIcon(symbolText: string) {
        if (!symbolText) return null;
        const symbolKey = symbolText.trim().toLowerCase() as keyof typeof elementSymbols;
        const symbol = elementSymbols[symbolKey];
        return symbol ? symbol : null;
    }

</script>
<div>
    {#if card?.symbol}
        <p class="tarot-info-item dark:text-gray-100">
            <span class="tarot-subheading">{!secondarySymbol ? "Symbol" : "Symbols" }: </span>
            {#if primarySymbol}
            <span class="tarot-info-item">
                {primarySymbol}
                {getElementSymbolIcon(primarySymbol)}
            </span>
            {/if}
            {#if secondarySymbol}
            <span class="tarot-info-item">
                {" / " + secondarySymbol}
                {getElementSymbolIcon(secondarySymbol)}
            </span>
            {/if}
        </p>
    {:else}
        <p class="tarot-info-item dark:text-gray-100">
            <span class="text-2xl">No symbol data</span>
        </p>
    {/if}
</div>