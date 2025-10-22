<script lang="ts">
	let { card } = $props();
	let canvasWidth: number = 100;
	let canvasHeight: number = 200;
	let nodeSize: number = 8;
	let color: string = "currentColor";
	let strokeWidth: number = 2;
	let showLabels: boolean = true;

	let sephira: Record<string, number[]> = {
		Kether: [canvasWidth * 0.5, canvasHeight * 0.1],
		Binah: [canvasWidth * 0.2, canvasHeight * 0.2],
		Chokmah: [canvasWidth * 0.8, canvasHeight * 0.2],
		Geburah: [canvasWidth * 0.2, canvasHeight * 0.4],
		Hod: [canvasWidth * 0.2, canvasHeight * 0.6],
		Tiphareth: [canvasWidth * 0.5, canvasHeight * 0.5],
		Netzach: [canvasWidth * 0.8, canvasHeight * 0.6],
		Chesed: [canvasWidth * 0.8, canvasHeight * 0.4],
		Yesod: [canvasWidth * 0.5, canvasHeight * 0.7],
		Malkuth: [canvasWidth * 0.5, canvasHeight * 0.85],
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

	let activeSephira = $state(card?.tree_of_life_sefira);

	$effect(() => {
		activeSephira = card?.tree_of_life_sefira;
	});

	function getSephiraFilter(sephira: string) {
		const filter =
			activeSephira && activeSephira !== "NA" && activeSephira === sephira
				? "url(#sofGlow)"
				: "";
		return filter;
	}
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={canvasWidth}
	height={canvasHeight}
	viewBox="0 0 {canvasWidth} {canvasHeight}"
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
				r={nodeSize}
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
