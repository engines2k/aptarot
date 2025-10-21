<script lang="ts">
	let { card } = $props();
	let size: number | string = 300;
	let color: string = "currentColor";
	let strokeWidth: number = 2;
	let showLabels: boolean = true;

	let sephira: Record<string, number[]> = {
		Kether: [120, 20],
		Binah: [60, 60],
		Chokmah: [180, 60],
		Geburah: [60, 110],
		Hod: [60, 160],
		Tiphareth: [120, 140],
		Netzach: [180, 160],
		Chesed: [180, 110],
		Yesod: [120, 190],
		Malkuth: [120, 240],
	};

	const links = [
		["Kether", "Binah"],
		["Kether", "Chokmah"],
		["Kether", "Tiphareth"],
		["Binah", "Chokmah"],
		["Binah", "Geburah"],
		["Binah", "Tiphareth"],
		["Chokmah", "Tiphareth"],
		["Chokmah", "Chesed"],
		["Geburah", "Chesed"],
		["Geburah", "Tiphareth"],
		["Geburah", "Hod"],
		["Chesed", "Tiphareth"],
		["Chesed", "Netzach"],
		["Tiphareth", "Hod"],
		["Tiphareth", "Netzach"],
		["Tiphareth", "Yesod"],
		["Hod", "Netzach"],
		["Hod", "Yesod"],
		["Hod", "Malkuth"],
		["Netzach", "Yesod"],
		["Netzach", "Malkuth"],
		["Yesod", "Malkuth"],
	];

	let activeSephira = $derived(card?.tree_of_life_sefira);
	
	// Debug: Log the activeSephira value
	$effect(() => {
		console.log("TreeOfLife - activeSephira:", activeSephira);
		console.log("TreeOfLife - card:", card);
	});
	
	// Test with hardcoded value for debugging
	let testSephira = "Kether"; // Uncomment to test
	
	function getSephiraFilter(sephira: string) {
		// Use testSephira for testing, fallback to activeSephira
		const currentSephira = testSephira; // Change to activeSephira for testing
		const filter = currentSephira && currentSephira !== "NA" && currentSephira === sephira ? "url(#sofGlow)" : "";
		console.log(`getSephiraFilter(${sephira}) - currentSephira: ${currentSephira}, filter: ${filter}`);
		return filter;
	}
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 {size} {size}"
	aria-label="Tree of Life"
	role="img"
>
	<defs>
		<style>
			.node {
				fill: white;
				text-anchor: middle;
				transition: all 0.3s ease;
			}
			.link {
				fill: none;
				transition: opacity 0.3s ease;
			}
			.label {
				font: 10px sans-serif;
				text-anchor: middle;
				transition: opacity 0.3s ease;
			}
		</style>
		<filter id="sofGlow" height="300%" width="300%" x="-75%" y="-75%">
			<feMorphology
				operator="dilate"
				radius="1"
				in="SourceAlpha"
				result="thicken"
			/>
			<feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />
			<feFlood flood-color="rgb(0,186,255)" result="glowColor" />
			<feComposite
				in="glowColor"
				in2="blurred"
				operator="in"
				result="softGlow_colored"
			/>
			<feMerge>
				<feMergeNode in="softGlow_colored" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>

	{#each links as [a, b]}
		<line
			class="link"
			stroke={color}
			stroke-width={strokeWidth}
			x1={sephira[a][0]}
			y1={sephira[a][1]}
			x2={sephira[b][0]}
			y2={sephira[b][1]}
		/>
	{/each}

	{#each Object.keys(sephira) as label}
		<g opacity={activeSephira && activeSephira !== label ? 0.5 : 1}>
			<circle
				class="node"
				stroke={color}
				stroke-width={strokeWidth}
				cx={sephira[label][0]}
				cy={sephira[label][1]}
				r="12"
				filter={getSephiraFilter(label)}
			/>
			{#if showLabels}
				<text
					class="label"
					fill={color}
					x={sephira[label][0]}
					y={sephira[label][1] + 30}>{label ?? ""}</text
				>
			{/if}
		</g>
	{/each}
</svg>
