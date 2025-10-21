<script lang="ts">
	export let size: number | string = 300;
	export let color: string = "currentColor";
	export let strokeWidth: number = 2;
	export let showLabels: boolean = true;

	/*
	y: 20 |60  120  180
	   60
	   110
	   170
	   220
	*/
	export let sephira: Record<string, number[]> = {
		Keter: [120, 20],
		Binah: [60, 60],
		Chokhmah: [180, 60],
		Gevurah: [60, 110],
		Hod: [60, 160],
		Tiferet: [120, 140],
		Netzach: [180, 160],
		Chesed: [180, 110],
		Yesod: [120, 190],
		Malkuth: [120, 240],
	};

	const links = [
		["Keter", "Binah"],
		["Keter", "Chokhmah"],
		["Keter", "Tiferet"],
		["Binah", "Chokhmah"],
		["Binah", "Gevurah"],
		["Binah", "Tiferet"],
		["Chokhmah", "Tiferet"],
		["Chokhmah", "Chesed"],
		["Gevurah", "Chesed"],
		["Gevurah", "Tiferet"],
		["Gevurah", "Hod"],
		["Chesed", "Tiferet"],
		["Chesed", "Netzach"],
		["Tiferet", "Hod"],
		["Tiferet", "Netzach"],
		["Hod", "Netzach"],
		["Hod", "Yesod"],
		["Netzach", "Yesod"],
		["Yesod", "Malkuth"],
	];
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
			}
			.link {
				fill: none;
			}
			.label {
				font: 10px sans-serif;
				text-anchor: middle;
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
		<g>
			<circle
				class="node"
				stroke={color}
				stroke-width={strokeWidth}
				cx={sephira[label][0]}
				cy={sephira[label][1]}
				r="12"
				filter="url(#sofGlow)"
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

	<line
		class="link"
		stroke={color}
		stroke-width={strokeWidth}
		x1="120"
		y1="32"
		x2="120"
		y2="200"
		stroke-dasharray="3 4"
	/>
</svg>
