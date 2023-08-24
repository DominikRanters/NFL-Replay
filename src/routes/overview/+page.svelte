<script lang="ts">
	import GameListItem from '$lib/components/GameListItem.svelte';
	import { headerText } from '$lib/stores.js';

	export let data;

	const { schedule } = data;
	const days = Object.values(schedule);

	const formatDate = (date: Date | string) => {
		const dateTemp = new Date(date);
		return dateTemp.toLocaleDateString('de-DE');
	};

	const setHeaderText = (): string => {
		if (days.length > 0 && days[0].games.length > 0) {
			return `Week ${days[0].games[0].week.number}`;
		}

		return 'Overview';
	};
	headerText.set(setHeaderText());
</script>

{#each days as day}
	<h2 class="h2 p-4">{formatDate(day.games[0].date)}</h2>

	{#each day.games as game}
		<div class="p-2">
			<GameListItem {game} />
		</div>
	{/each}
{/each}
