<script lang="ts">
	import { ListBox } from '@skeletonlabs/skeleton';
	import ListItem from '$lib/components/ListItem.svelte';
	import type { Drive } from '../../models/game-summary.js';

	export let data;

	const { gameSummary } = data;
	console.log(gameSummary);
	$: demoData = [] as Drive[];
	const interval = setInterval(() => {
		console.log(demoData.length, gameSummary.drives.previous.length);
		if (demoData.length < gameSummary.drives.previous.length) {
			demoData = [...demoData, gameSummary.drives.previous[demoData.length]];
		} else {
			clearInterval(interval);
		}
	}, 2000);
</script>

{#each demoData as drive}
	<div class="m-4">
		<ListItem {drive} />
	</div>
{/each}
