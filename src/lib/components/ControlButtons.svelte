<script lang="ts">
	export let isPause: boolean;
	export let togglePause: () => void;
</script>

<button class="absolute bottom-5 right-5 card p-4" on:click={togglePause}>
	{#if isPause}
		<i class="fa-solid fa-play" />
	{:else}
		<i class="fa-solid fa-pause" />
	{/if}
</button>

<style>
	button {
		background: rgba(var(--color-control-buttons) / 1) !important;
	}
</style>
