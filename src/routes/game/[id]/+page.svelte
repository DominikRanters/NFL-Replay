<script lang="ts">
	import PlayListItem from '$lib/components/PlayListItem.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Drive } from '../../../models/game-summary';
	import DrivComponent from '../drive.svelte';
	import { headerText } from '$lib/stores';
	import ControlButtons from '$lib/components/ControlButtons.svelte';

	export let data;
	const { gameSummary } = data;
	const orginalDrives = gameSummary.drives?.previous || [];

	const intervallDelay = 2000;

	$: isPause = false;
	$: drives = [] as Drive[];

	let interval: ReturnType<typeof setInterval>;

	const togglePause = () => {
		isPause = !isPause;

		if (isPause) {
			clearInterval(interval);
		} else {
			intervalNextPlay();
		}
	};

	const intervalNextPlay = () => {
		interval = setInterval(() => {
			if (
				drives.length > 0 &&
				drives[0].plays.length < orginalDrives[drives.length - 1].plays.length
			) {
				// Add next play to current drive
				const tempDrives = [...drives];

				const lastDrive = tempDrives[0];
				const indexThisDrive = tempDrives.length - 1;
				const indexLastPlay = lastDrive.plays.length;

				// set finished
				const isLastPlay = indexLastPlay === orginalDrives[indexThisDrive].plays.length - 1;
				lastDrive.finished = isLastPlay;

				// create and add next play
				const nextPlay = orginalDrives[indexThisDrive].plays[indexLastPlay];
				lastDrive.plays = [nextPlay, ...lastDrive.plays];

				drives = tempDrives;
			} else if (drives.length < orginalDrives.length) {
				// Add next drive
				const tempDrives = [...drives];
				const indexLastDrive = tempDrives.length - 1;

				// create and add next drive
				const nextDrive = { ...orginalDrives[indexLastDrive + 1] };
				const nextDriveWithOutPlays: Drive = {
					...nextDrive,
					plays: []
				};

				drives = [nextDriveWithOutPlays, ...tempDrives];
			} else {
				clearInterval(interval);
			}
		}, intervallDelay);
	};

	onMount(() => {
		const homeTeam = gameSummary.teams.find((t) => t.homeAway === 'home')?.team;
		const awayTeam = gameSummary.teams.find((t) => t.homeAway === 'away')?.team;
		headerText.set(`${homeTeam?.abbreviation} vs. ${awayTeam?.abbreviation}`);

		intervalNextPlay();
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

{#each drives as drive (drive.id)}
	<div class="pb-10">
		<DrivComponent {drive} teams={gameSummary.teams} />
		{#each drive.plays as play (play.id)}
			<div class="m-2">
				<PlayListItem {play} />
			</div>
		{/each}
	</div>
{/each}
<ControlButtons {isPause} {togglePause} />

<style>
	/* Background colors */
	:global(.touchdown) {
		background: rgba(var(--color-scoring) / 1) !important;
	}
	:global(.field-goal-good) {
		background: rgba(var(--color-fiedl-foal-good) / 1) !important;
	}
	:global(.field-goal-missed) {
		background: rgba(var(--color-field-goal-missed) / 1) !important;
	}
	:global(.timeout) {
		background: rgba(var(--color-timeout) / 1) !important;
	}
	:global(.turnover) {
		background: rgba(var(--color-turnover) / 1) !important;
	}

	/* Colors  */
	:global(.firstDown) {
		color: rgba(120, 200, 30, 0.7) !important;
	}
	:global(.secondDown) {
		color: rgba(255, 235, 0, 0.75) !important;
	}
	:global(.thirdDown) {
		color: rgba(255, 145, 0, 0.75) !important;
	}
	:global(.fourthDown) {
		color: rgba(255, 48, 29, 0.8) !important;
	}
</style>
