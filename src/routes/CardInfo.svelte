<script lang="ts">
    import { Motion, useAnimation } from 'svelte-motion';
    import { onMount } from 'svelte';

    const controls = useAnimation();
    
    let { card } = $props();
    let first = true;
    let hasMounted = false;

    onMount(() => {
        hasMounted = true;
        // controls.start(idleAnim);
    });

    const idleAnim = {
        rotate: [ -2, 2, -2 ],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };
    const newAnim = {
        scale: [ 1.1, 1 ],
        rotate: [ -2, 2 ],
        transition: {
            duration: .5,
            ease: "easeInOut"
        }
    };
    
    let currentAnim = $state(idleAnim);

</script>

<div class="grid grid-cols-6 detail">
    <div class="col-span-2">
        <Motion
        let:motion
        animate={idleAnim}
        >    
            <img
            use:motion
            class="card-face"
            src={card.image}
            alt="Tarot card"
            width=200
            />
        </Motion>
    </div>
    <div class="col-span-4">
        <p>{card.name}</p>
    </div>
</div>

<style>
	.detail {
		min-height: 200px;
        margin:50px;
	}

    .card-face {
        width: 100%;
        image-rendering: pixelated;
    }

</style>