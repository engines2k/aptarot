<script lang="ts">
	let { children } = $props();
	import "../app.css";
	import Header from './Header.svelte';
</script>

<div class="app">

	<Header />
	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			by <a href="https://github.com/engines2k" target="_blank">z b</a> / n a
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-bottom: 5px !important;
	}

	footer a {
		font-weight: bold;
		font-size: .8em;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
