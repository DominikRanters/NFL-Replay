<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ListItem from '$lib/components/ListItem.svelte';
	import type { Drive } from '../../models/game-summary.js';
	import DrivComponent from './drive.svelte';

	export let data;
	const { gameSummary } = data;

	$: demoData = [] as Drive[];

	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			console.log(demoData.length, gameSummary.drives.previous.length);
			if (demoData.length < gameSummary.drives.previous.length) {
				demoData = [...demoData, gameSummary.drives.previous[demoData.length]];
			} else {
				clearInterval(interval);
			}
		}, 2000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<DrivComponent />
{#each demoData as drive}
	<div class="m-4">
		<ListItem {drive} />
	</div>
{/each}
