<script lang="ts">
	import FootballField from '$lib/fottbal-field.png';
	import type { Drive, Play } from '../../models/game-summary';

	export let drive: Drive | null = null;

	// Calculate arrow position and direction
	$: arrowPosition = calculateArrowPosition();
	$: arrowDirection = calculateArrowDirection();

	function calculateArrowPosition() {
		if (!drive) {
			return { startX: 50, endX: 260, visible: false };
		}

		if (!drive.start) {
			return { startX: 50, endX: 260, visible: false };
		}

		// Find the last non-punt play
		const lastNonPuntPlay = findLastNonPuntPlay(drive.plays);

		if (!lastNonPuntPlay) {
			return { startX: 50, endX: 260, visible: false };
		}

		const fieldWidth = 300; // Approximate field width in pixels
		const startYardLine = drive.start.yardLine;
		const endYardLine = lastNonPuntPlay.end.yardLine;

		// Convert yard lines to pixel positions with bounds checking
		const startX = Math.max(10, Math.min(290, (startYardLine / 100) * fieldWidth));
		const endX = Math.max(10, Math.min(290, (endYardLine / 100) * fieldWidth));

		return { startX, endX, visible: true };
	}

	function findLastNonPuntPlay(plays: Play[]): Play | null {
		// Filter out punts and find the last non-punt play
		const nonPuntPlays = plays.filter(
			(play) => play.type?.text && !play.type.text.toLowerCase().includes('punt')
		);

		return nonPuntPlays.length > 0 ? nonPuntPlays[nonPuntPlays.length - 1] : null;
	}

	function calculateArrowDirection() {
		if (!drive) {
			return 'right';
		}

		// Determine direction based on team possession
		// LV = left direction, SF = right direction
		const isHomeTeam = drive.team.abbreviation === 'LV';
		const direction = isHomeTeam ? 'left' : 'right';

		return direction;
	}
</script>

<div class="relative">
	<img src={FootballField} alt="field" />
	{#if arrowPosition.visible}
		<div
			class="arrow"
			style="left: {arrowPosition.startX}px; width: {Math.abs(
				arrowPosition.endX - arrowPosition.startX
			)}px;"
		>
			<div class="line" />
			<div class="point {arrowDirection === 'left' ? 'point-left' : 'point-right'}" />
		</div>
	{:else}
		<!-- Fallback arrow for debugging -->
		<div class="arrow debug-arrow" style="left: 50px; width: 200px;">
			<div class="line" />
			<div class="point point-right" />
		</div>
	{/if}
</div>

<style>
	.arrow {
		position: absolute;
		top: 45%;
	}

	.line {
		margin-top: 8px;
		width: calc(100% - 30px);
		background: white;
		height: 8px;
		float: left;
		border-radius: 4px;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
	}

	.point {
		width: 0;
		height: 0;
		border-top: 12px solid transparent;
		border-bottom: 12px solid transparent;
		float: right;
		margin-top: 2px;
	}

	.point-right {
		border-left: 25px solid white;
		filter: drop-shadow(2px 0 2px rgba(0, 0, 0, 0.3));
	}

	.point-left {
		border-right: 25px solid white;
		filter: drop-shadow(-2px 0 2px rgba(0, 0, 0, 0.3));
	}

	.debug-arrow .line {
		background: red;
		height: 12px;
	}

	.debug-arrow .point {
		border-left: 25px solid red;
	}
</style>
