<script lang="ts">
	import PlayListItem from '$lib/components/PlayListItem.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Drive } from '../../../models/game-summary';
	import DriveComponent from '../drive.svelte';
	import { headerText } from '$lib/stores';
	import ControlButtons from '$lib/components/ControlButtons.svelte';
	import FootballField from '$lib/components/FootballField.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { checkGameAccess } from '$lib/utils/gameAccessTimer';

	export let data;
	const { gameSummary } = data;
	const originalDrives = gameSummary.drives?.previous || [];

	let speedMultiplier = 1;

	$: isPause = false;
	$: drives = [] as Drive[];

	let interval: ReturnType<typeof setInterval>;

	/**
	 * Checks if the current game access is still valid on the client side
	 * Redirects to overview if access has expired
	 */
	const checkClientAccess = (): void => {
		const gameId = $page.params.id;
		if (gameId) {
			const accessCheck = checkGameAccess(gameId);
			if (!accessCheck.isValid) {
				goto('/overview');
			}
		}
	};

	const togglePause = () => {
		isPause = !isPause;

		if (isPause) {
			clearInterval(interval);
		} else {
			intervalNextPlay();
		}
	};

	const adjustSpeed = () => {
		if (speedMultiplier === 1) {
			speedMultiplier = 1.5;
		} else if (speedMultiplier === 1.5) {
			speedMultiplier = 2;
		} else {
			speedMultiplier = 1;
		}

		// Restart interval with new speed if not paused
		if (!isPause) {
			clearInterval(interval);
			intervalNextPlay();
		}
	};

	const jumpToNextDrive = () => {
		clearInterval(interval);

		if (drives.length === 0) {
			return;
		}

		const tempDrives = [...drives];
		const currentDriveIndex = tempDrives.length - 1;
		const currentDrive = tempDrives[0];
		const originalDrive = originalDrives[currentDriveIndex];

		// Complete current drive by adding all remaining plays
		if (currentDrive.plays.length < originalDrive.plays.length) {
			const remainingPlays = originalDrive.plays.slice(currentDrive.plays.length);
			currentDrive.plays = [...remainingPlays.reverse(), ...currentDrive.plays];
			currentDrive.finished = true;
			tempDrives[0] = currentDrive;
		}

		// Start next drive if available
		if (tempDrives.length < originalDrives.length) {
			const nextDriveIndex = tempDrives.length;
			const nextDrive = { ...originalDrives[nextDriveIndex] };
			const nextDriveWithOutPlays: Drive = {
				...nextDrive,
				plays: []
			};
			drives = [nextDriveWithOutPlays, ...tempDrives];
		} else {
			drives = tempDrives;
		}

		// Resume playback if not paused
		if (!isPause) {
			intervalNextPlay();
		}
	};

	const intervalNextPlay = () => {
		// Calculate delay directly from speedMultiplier to avoid timing issues with reactive statements
		const delayToUse = 2000 / speedMultiplier;

		interval = setInterval(() => {
			if (
				drives.length > 0 &&
				drives[0].plays.length < originalDrives[drives.length - 1].plays.length
			) {
				// Add next play to current drive
				const tempDrives = [...drives];

				const lastDrive = tempDrives[0];
				const indexThisDrive = tempDrives.length - 1;
				const indexLastPlay = lastDrive.plays.length;

				// set finished
				const isLastPlay = indexLastPlay === originalDrives[indexThisDrive].plays.length - 1;
				lastDrive.finished = isLastPlay;

				// create and add next play
				const nextPlay = originalDrives[indexThisDrive].plays[indexLastPlay];
				lastDrive.plays = [nextPlay, ...lastDrive.plays];

				drives = tempDrives;
			} else if (drives.length < originalDrives.length) {
				// Add next drive
				const tempDrives = [...drives];
				const indexLastDrive = tempDrives.length - 1;

				// create and add next drive
				const nextDrive = { ...originalDrives[indexLastDrive + 1] };
				const nextDriveWithOutPlays: Drive = {
					...nextDrive,
					plays: []
				};

				drives = [nextDriveWithOutPlays, ...tempDrives];
			} else {
				clearInterval(interval);
			}
		}, delayToUse);
	};

	onMount(() => {
		// Check access as a safety measure on client side
		checkClientAccess();

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
		<DriveComponent {drive} teams={gameSummary.teams} />
		{#if drive.plays.length > 0}
			<FootballField {drive} teams={gameSummary.teams} />
		{/if}
		{#each drive.plays as play (play.id)}
			<div class="m-2">
				<PlayListItem {play} />
			</div>
		{/each}
	</div>
{/each}
<ControlButtons
	{isPause}
	{togglePause}
	currentSpeed={speedMultiplier}
	onSpeedChange={adjustSpeed}
	onNextDrive={jumpToNextDrive}
/>

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
