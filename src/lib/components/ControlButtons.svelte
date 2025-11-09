<script lang="ts">
	export let isPause: boolean;
	export let togglePause: () => void;
	export let currentSpeed: number = 1;
	export let onSpeedChange: () => void;
	export let onNextDrive: () => void;
</script>

<div class="absolute bottom-5 right-5 flex gap-2">
	<button class="card p-4" on:click={onNextDrive}>
		<i class="fa-solid fa-forward-step" />
	</button>
	<button class="card p-4" on:click={onSpeedChange}>
		<span class="speed-label">{currentSpeed}x</span>
	</button>
	<button class="card p-4" on:click={togglePause}>
		{#if isPause}
			<i class="fa-solid fa-play" />
		{:else}
			<i class="fa-solid fa-pause" />
		{/if}
	</button>
</div>

<style>
	button {
		background: rgba(var(--color-control-buttons) / 1) !important;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.speed-label {
		font-size: 14px;
		font-weight: bold;
	}
</style>
