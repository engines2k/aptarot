<script lang="ts">
  let { pos } = $props();
  
  let clampedPos = $derived(Math.max(0, Math.min(1, pos)));

</script>

<div class="progress-container carousel-ignore-scroll">
  <svg 
    class="progress-svg" 
    viewBox="0 0 200 20" 
    xmlns="http://www.w3.org/2000/svg"
    role="slider"
    aria-label="Progress indicator"
    aria-valuenow={Math.round(clampedPos * 100)}
    aria-valuemin="0"
    aria-valuemax="100"
    tabindex="0"
  >
    <line
      x1="20"
      y1="10"
      x2="180"
      y2="10"
      stroke="rgba(255, 255, 255, 0.2)"
      stroke-width="4"
      stroke-linecap="round"
      class="background-path"
    />
    
    <line
      x1="20"
      y1="10"
      x2="180"
      y2="10"
      stroke="rgba(255, 255, 255, 0.8)"
      stroke-width="4"
      stroke-linecap="round"
      class="progress-path"
      style="stroke-dasharray: {160 * clampedPos} 160; stroke-dashoffset: 0;"
    />

  </svg>
</div>

<style>
  .progress-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  
  .progress-svg {
    width: 100%;
    max-width: 200px;
    cursor: pointer;
  }
  
  .progress-path {
    transition: stroke-dasharray 0.3s ease-out;
  }
  
  .progress-svg:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
</style>