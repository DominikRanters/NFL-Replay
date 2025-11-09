<script lang="ts">
	import type { Drive, TeamSummary } from '../../models/game-summary';
	import { calculateQuarterScores } from '../utils/quarterScores';

	export let drives: Drive[] = [];
	export let teams: TeamSummary[] = [];

	$: quarterScores = calculateQuarterScores(drives, teams);
	$: homeTeam = teams.find((team) => team.homeAway === 'home');
	$: awayTeam = teams.find((team) => team.homeAway === 'away');

	/**
	 * Gets the display score for a quarter
	 * Q1 defaults to "0", others default to empty string until they start
	 */
	function getQuarterDisplay(
		quarterNumber: number,
		teamScores: number[],
		quartersStarted: number[]
	): string {
		const quarterIndex = quarterNumber - 1;
		const hasStarted = quartersStarted.includes(quarterNumber);
		const defaultDisplay = quarterNumber === 1 ? '0' : '';

		return hasStarted ? teamScores[quarterIndex].toString() : defaultDisplay;
	}

	// Reactive displays for each quarter
	$: homeQ1 = getQuarterDisplay(1, quarterScores.home, quarterScores.quartersStarted);
	$: homeQ2 = getQuarterDisplay(2, quarterScores.home, quarterScores.quartersStarted);
	$: homeQ3 = getQuarterDisplay(3, quarterScores.home, quarterScores.quartersStarted);
	$: homeQ4 = getQuarterDisplay(4, quarterScores.home, quarterScores.quartersStarted);

	$: awayQ1 = getQuarterDisplay(1, quarterScores.away, quarterScores.quartersStarted);
	$: awayQ2 = getQuarterDisplay(2, quarterScores.away, quarterScores.quartersStarted);
	$: awayQ3 = getQuarterDisplay(3, quarterScores.away, quarterScores.quartersStarted);
	$: awayQ4 = getQuarterDisplay(4, quarterScores.away, quarterScores.quartersStarted);
</script>

{#if homeTeam && awayTeam}
	<div class="card rounded-none mb-4 quarter-score-display">
		<table class="w-full h-full">
			<thead>
				<tr>
					<th class="text-left p-1" />
					<th class="text-center p-1">Q1</th>
					<th class="text-center p-1">Q2</th>
					<th class="text-center p-1">Q3</th>
					<th class="text-center p-1">Q4</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="p-1 font-medium">{homeTeam.team.abbreviation}</td>
					<td class="text-center p-1">{homeQ1}</td>
					<td class="text-center p-1">{homeQ2}</td>
					<td class="text-center p-1">{homeQ3}</td>
					<td class="text-center p-1">{homeQ4}</td>
				</tr>
				<tr>
					<td class="p-1 font-medium">{awayTeam.team.abbreviation}</td>
					<td class="text-center p-1">{awayQ1}</td>
					<td class="text-center p-1">{awayQ2}</td>
					<td class="text-center p-1">{awayQ3}</td>
					<td class="text-center p-1">{awayQ4}</td>
				</tr>
			</tbody>
		</table>
	</div>
{/if}

<style>
	.quarter-score-display {
		height: 12vh;
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
	}

	.quarter-score-display table {
		height: auto;
	}
</style>
