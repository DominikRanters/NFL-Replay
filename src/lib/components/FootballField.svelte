<script lang="ts">
	import type { Drive, Play } from '../../models/game-summary';
	import { PlayTypes } from '../../models/play-types';

	// Play types that should be ignored for arrow calculation
	const IgnoredPlayTypes = [PlayTypes.Punt, PlayTypes.FieldGoalGood, PlayTypes.Kickoff];

	export let drive: Drive | null = null;
	export let teams: any[] = [];

	// Calculate arrow position and direction
	$: arrowPosition = calculateArrowPosition();
	$: arrowDirection = calculateArrowDirection();

	// Force recalculation when plays array changes
	$: playsLength = drive?.plays?.length || 0;
	$: if (drive && drive.plays && playsLength > 0) {
		arrowPosition = calculateArrowPosition();
	}

	function calculateArrowPosition() {
		if (!drive) {
			return { startX: 50, endX: 260, visible: false };
		}

		if (!drive.plays || drive.plays.length === 0) {
			return { startX: 50, endX: 260, visible: false };
		}

		// Filter out ignored play types for arrow calculation
		const validPlays = drive.plays.filter(
			(play) => !IgnoredPlayTypes.includes(Number(play.type?.id))
		);

		if (validPlays.length === 0) {
			return { startX: 50, endX: 260, visible: false };
		}

		// Arrow starts at the last valid play's start yard line (chronologically first)
		const firstPlayStartYardLine = validPlays[validPlays.length - 1].start.yardLine;
		// Arrow ends at the first valid play's end yard line (chronologically last)
		const firstPlayEndYardLine = validPlays[0].end.yardLine;

		// Convert yard lines to positions between the two "0" yard lines (x=8.33 to x=91.67)
		// Map 0-100 yard lines to 8.33-91.67 SVG coordinates (10 field sections)
		const startX = Math.max(8.33, Math.min(91.67, 8.33 + (firstPlayStartYardLine / 100) * 83.34));
		const endX = Math.max(8.33, Math.min(91.67, 8.33 + (firstPlayEndYardLine / 100) * 83.34));

		return { startX, endX, visible: true };
	}

	function calculateArrowDirection() {
		if (!drive) {
			return 'right';
		}

		// Determine direction based on home/away team
		// Home team drives: arrow points right (toward away team's end zone)
		// Away team drives: arrow points left (toward home team's end zone)
		const homeTeam = teams.find((team) => team.homeAway === 'home');
		const isHomeTeamDrive = drive.team.abbreviation === homeTeam?.team?.abbreviation;
		const direction = isHomeTeamDrive ? 'right' : 'left';

		return direction;
	}
</script>

<div class="football-field-container">
	<svg class="football-field" viewBox="0 2 100 16" preserveAspectRatio="xMidYMid meet">
		<!-- Field background -->
		<rect x="0" y="0" width="100" height="16" fill="#2d5016" />

		<!-- End zones (8.33% each) -->
		<rect x="0" y="0" width="8.33" height="16" fill="#1a3009" />
		<rect x="91.67" y="0" width="8.33" height="16" fill="#1a3009" />

		<!-- Yard lines (every 8.33%) -->
		<line x1="8.33" y1="0" x2="8.33" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />
		<line x1="16.67" y1="0" x2="16.67" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />
		<line x1="25" y1="0" x2="25" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />
		<line x1="33.33" y1="0" x2="33.33" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />
		<line x1="41.67" y1="0" x2="41.67" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />
		<line x1="50" y1="0" x2="50" y2="16" stroke="white" stroke-width="0.3" opacity="0.9" />
		<line x1="58.33" y1="0" x2="58.33" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />
		<line x1="66.67" y1="0" x2="66.67" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />
		<line x1="75" y1="0" x2="75" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />
		<line x1="83.33" y1="0" x2="83.33" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />
		<line x1="91.67" y1="0" x2="91.67" y2="16" stroke="white" stroke-width="0.2" opacity="0.8" />

		<!-- Yard line numbers - Top -->
		<text
			x="8.33"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">0</text
		>
		<text
			x="16.67"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">10</text
		>
		<text
			x="25"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">20</text
		>
		<text
			x="33.33"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">30</text
		>
		<text
			x="41.67"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">40</text
		>
		<text
			x="50"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">50</text
		>
		<text
			x="58.33"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">40</text
		>
		<text
			x="66.67"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">30</text
		>
		<text
			x="75"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">20</text
		>
		<text
			x="75"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">20</text
		>
		<text
			x="83.33"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">10</text
		>
		<text
			x="91.67"
			y="3"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">0</text
		>

		<!-- Yard line numbers - Bottom -->
		<text
			x="8.33"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">0</text
		>
		<text
			x="16.67"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">10</text
		>
		<text
			x="25"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">20</text
		>
		<text
			x="33.33"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">30</text
		>
		<text
			x="41.67"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">40</text
		>
		<text
			x="50"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">50</text
		>
		<text
			x="58.33"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">40</text
		>
		<text
			x="66.67"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">30</text
		>
		<text
			x="75"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">20</text
		>
		<text
			x="83.33"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">10</text
		>
		<text
			x="91.67"
			y="16"
			text-anchor="middle"
			fill="white"
			font-size="3"
			font-weight="bold"
			opacity="1">0</text
		>

		<!-- Arrow -->
		{#if arrowPosition.visible}
			<g class="arrow-group">
				<!-- Arrow line - full line from start to end -->
				<line
					x1={arrowPosition.startX}
					y1="8"
					x2={arrowPosition.endX}
					y2="8"
					stroke="white"
					stroke-width="1.2"
					opacity="0.9"
				/>
				<!-- Arrow head - always ends at arrowEnd mark -->
				{#if arrowDirection === 'right'}
					<polygon
						points="{arrowPosition.endX - 2},6 {arrowPosition.endX},8 {arrowPosition.endX - 2},10"
						fill="white"
						opacity="0.9"
					/>
				{:else}
					<polygon
						points="{arrowPosition.endX + 2},6 {arrowPosition.endX},8 {arrowPosition.endX + 2},10"
						fill="white"
						opacity="0.9"
					/>
				{/if}
			</g>
		{/if}
	</svg>
</div>

<style>
	.football-field-container {
		width: 100%;
		height: 12vh;
		background: #1a1a1a;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: -25px;
	}

	.football-field {
		width: 100%;
		height: 100%;
	}

	.arrow-group {
		transition: all 0.3s ease;
	}
</style>
