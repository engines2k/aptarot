<script lang="ts">
    let { label, value } = $props();
</script>
<div class="detail-item dark:text-gray-100 mb-4">
    <div class="detail-label text-sm lg:text-base">{label}</div>
    {#if value }
    <div class="detail-value text-sm lg:text-base">
        {value}
    </div>
    {/if}
</div>

<style>
    .detail-item {
        /* font-size: 1.2rem; */
        /* margin-bottom: 20px; */
        color: #e5e7eb;
    }

    .detail-label {
        /* font-size:.8rem; */
        /* text-align: center; */
        font-weight: bold;
        color: var(--color-theme-1);
    }

    .detail-value {
        /* text-align:center; */
        /* font-size: 1.2rem; */
        /* margin-bottom: 2px; */
        color: #e5e7eb;
    }
</style>