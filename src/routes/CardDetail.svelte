<script lang="ts">
    let { label, value } = $props();
</script>
<div class="detail-item dark:text-gray-100">
    <div class="detail-label">{label}</div>
    {#if value }
    <div class="detail-value">
        {value}
    </div>
    {/if}
</div>