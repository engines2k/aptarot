<script lang="ts">
    import attributionSymbols from '$lib/elemental-icons.json';

    let { attribution } = $props();
    let primaryAttribution = $derived(attribution?.primary);
    let secondaryAttribution = $derived(attribution?.secondary);

    function getElementAttributionIcon(attributionText: string) {
        if (!attributionText) return "";
        const attributionKey = attributionText.trim().toLowerCase() as keyof typeof attributionSymbols;
        const attribution = attributionSymbols[attributionKey];
        return attribution ? attribution : "";
    }

</script>
<div>
    {#if attribution }
        <div class="tarot-ti dark:text-gray-100">
            {#if primaryAttribution}
            <div class="">
                {primaryAttribution}
                {getElementAttributionIcon(primaryAttribution)}
                {#if secondaryAttribution}
                {" | " + secondaryAttribution}
                {getElementAttributionIcon(secondaryAttribution)}
                {/if}
            </div>
            {/if}
        </div>
    {:else}
        <div class="tarot-info-item dark:text-gray-100">
            <span class="text-2xl">No attribution data</span>
        </div>
    {/if}
</div>