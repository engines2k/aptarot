<script lang="ts">
</script>

<div class="loading-container">
	<div class="loading-content">
		<div class="loading-img">
			<img src="/cards/regular/aptarot-card.webp" alt="Loading" />
		</div>
		<div class="loading-text">Loading...</div>
	</div>
</div>

<style>
	.loading-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.loading-img {
		max-width: 200px;
	}

	.loading-img img {
		box-shadow: 0px 0px 15px 0px palegoldenrod;
		width: 100%;
		height: auto;
		display: block;
	}

	.loading-text {
		font-size: 1.25rem;
		text-align: center;
	}
</style>
