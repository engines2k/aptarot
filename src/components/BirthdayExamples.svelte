<script lang="ts">
    let { value } = $props();
</script>
<div class="birthday-item dark:text-gray-100">
    <div class="label">Birthday Examples</div>
    {#if value }
    <div class="text-sm value">
        {value}
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
        margin-bottom: 2px;
        color: #e5e7eb;
    }
</style>