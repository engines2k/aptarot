<script lang="ts">
	let { card } = $props();
	let canvasWidth: number = 40;
	let canvasHeight: number = 80;
	let nodeSize: number = 4;
	let color: string = "currentColor";
	let strokeWidth: number = 1;
	let showLabels: boolean = false;

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

	let cardSefira = $state(card?.tree_of_life_sefira);
	let cardPath = $state(card?.tree_of_life_path);

	$effect(() => {
		cardSefira = card?.tree_of_life_sefira?.name;
		cardPath = card?.tree_of_life_path;
		$inspect(cardPath);
	});

	function getElementFilter(element: string) {
		const filter =
			cardSefira && cardSefira !== "NA" && cardSefira === element;
		return filter;
	}

	function isActivePath(sefirot: string[]) {
		// Check if the card has a path and if both sefirot in the link match the card's path
		if (!cardPath || !cardPath.sefirot || cardPath.sefirot.length !== 2) {
			return false;
		}
		const [pathStart, pathEnd] = cardPath.sefirot;
		return (
			(sefirot[0] === pathStart && sefirot[1] === pathEnd) ||
			(sefirot[0] === pathEnd && sefirot[1] === pathStart)
		);
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
		<filter id="sofGlow" height="200%" width="200%" x="-50%" y="-50%">
			<feMorphology
				operator="dilate"
				radius="1"
				in="SourceAlpha"
				result="thicken"
			/>
			<feGaussianBlur in="thicken" stdDeviation="3" result="blurred" />
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
			opacity={isActivePath([a, b]) ? 1 : 0.5}
			filter={isActivePath([a, b]) ? "url(#sofGlow)" : ""}
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
		<g opacity={cardSefira && cardSefira === label ? 1 : 0.5}>
			<circle
				class="node"
				stroke={color}
				stroke-width={strokeWidth}
				cx={sephira[label][0]}
				cy={sephira[label][1]}
				r={nodeSize}
				filter={getElementFilter(label) ? "url(#sofGlow)" : ""}
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
