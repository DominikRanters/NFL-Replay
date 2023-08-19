<script lang="ts">
	import { ListBox } from '@skeletonlabs/skeleton';
	import ListItem from '$lib/components/ListItem.svelte';

	export let data;

	const { gameSummary } = data;
	console.log(gameSummary);
</script>

{#each gameSummary.drives.previous as drive}
	<ListItem />
{/each}
