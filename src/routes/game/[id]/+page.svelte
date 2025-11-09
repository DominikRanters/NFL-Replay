<script lang="ts">
	import PlayListItem from '$lib/components/PlayListItem.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Drive } from '../../../models/game-summary';
	import DriveComponent from '../drive.svelte';
	import { headerText } from '$lib/stores';
	import ControlButtons from '$lib/components/ControlButtons.svelte';
	import FootballField from '$lib/components/FootballField.svelte';
	import QuarterScoreDisplay from '$lib/components/QuarterScoreDisplay.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { checkGameAccess } from '$lib/utils/gameAccessTimer';
	import { PlaybackController } from '$lib/utils/playbackController';

	export let data;
	const { gameSummary } = data;
	const originalDrives = gameSummary.drives?.previous || [];

	let drives: Drive[] = [];
	let playbackController: PlaybackController;
	let isPaused = false;
	let currentSpeed = 1;

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

	/**
	 * Callback function for playback updates
	 */
	const handlePlaybackUpdate = (updatedDrives: Drive[]): void => {
		drives = updatedDrives;
	};

	const togglePause = () => {
		playbackController.togglePause();
		isPaused = playbackController.isPaused();
	};

	const adjustSpeed = () => {
		playbackController.adjustSpeed();
		currentSpeed = playbackController.getSpeed();
	};

	const jumpToNextDrive = () => {
		playbackController.jumpToNextDrive();
	};

	onMount(() => {
		// Check access as a safety measure on client side
		checkClientAccess();

		headerText.set('');

		// Initialize playback controller
		playbackController = new PlaybackController(originalDrives, handlePlaybackUpdate);
		playbackController.start();

		// Initialize reactive state variables
		isPaused = playbackController.isPaused();
		currentSpeed = playbackController.getSpeed();
	});

	onDestroy(() => {
		if (playbackController) {
			playbackController.stop();
		}
	});
</script>

<QuarterScoreDisplay {drives} teams={gameSummary.teams} />

{#each drives as drive, index (drive.id)}
	<div class="pb-10">
		<DriveComponent {drive} teams={gameSummary.teams} />
		{#if drive.plays.length > 0}
			<FootballField {drive} teams={gameSummary.teams} />
		{/if}
		{#each drive.plays as play (play.id)}
			<div class="m-2">
				<PlayListItem {play} {drive} />
			</div>
		{/each}
	</div>
{/each}
<ControlButtons
	isPause={isPaused}
	{togglePause}
	{currentSpeed}
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
