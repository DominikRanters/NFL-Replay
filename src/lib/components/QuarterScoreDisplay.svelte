<script lang="ts">
	import type { Drive, TeamSummary } from '../../models/game-summary';
	import { calculateQuarterScores } from '../utils/quarterScores';
	import { calculateTimeoutInfo } from '../utils/timeoutTracker';
	import { getQuarterDisplays, calculateTotal } from '../utils/scoreDisplayHelpers';

	export let drives: Drive[] = [];
	export let teams: TeamSummary[] = [];

	$: quarterScores = calculateQuarterScores(drives, teams);
	$: timeoutInfo = calculateTimeoutInfo(drives, teams);
	$: homeTeam = teams.find((team) => team.homeAway === 'home');
	$: awayTeam = teams.find((team) => team.homeAway === 'away');

	// Reactive displays for each team
	$: homeQuarters = getQuarterDisplays(quarterScores.home, quarterScores.quartersStarted);
	$: awayQuarters = getQuarterDisplays(quarterScores.away, quarterScores.quartersStarted);

	$: homeOT = quarterScores.hasOvertime ? quarterScores.homeOT.toString() : '';
	$: awayOT = quarterScores.hasOvertime ? quarterScores.awayOT.toString() : '';

	$: homeTotal = calculateTotal(quarterScores.home, quarterScores.homeOT);
	$: awayTotal = calculateTotal(quarterScores.away, quarterScores.awayOT);
</script>

{#if homeTeam && awayTeam}
	<div class="card rounded-none mb-4 quarter-score-display">
		<table class="w-full h-full">
			<colgroup>
				<col style="width: 25%;" />
				<col class="spacer-col-left" />
				<col style="width: 11%;" />
				<col style="width: 11%;" />
				<col style="width: 11%;" />
				<col style="width: 11%;" />
				<col class="spacer-col-right" />
				{#if quarterScores.hasOvertime}
					<col style="width: 8%;" />
				{/if}
				<col style="width: auto;" />
			</colgroup>
			<thead>
				<tr>
					<th class="text-left p-1" />
					<th class="spacer-col">&nbsp;</th>
					<th class="text-center quarter-col">Q1</th>
					<th class="text-center quarter-col">Q2</th>
					<th class="text-center quarter-col">Q3</th>
					<th class="text-center quarter-col">Q4</th>
					<th class="spacer-col">&nbsp;</th>
					{#if quarterScores.hasOvertime}
						<th class="text-center p-1 ot-col">OT</th>
					{/if}
					<th class="text-center p-1 total-col">Total</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="p-1 font-medium team-with-timeouts">
						<span class="team-abbr">{homeTeam.team.abbreviation}</span>
						<span class="timeout-dots">
							{#each Array(timeoutInfo.totalAvailable) as _, index}
								<span class="timeout-dot" class:active={index < timeoutInfo.homeRemaining} />
							{/each}
						</span>
					</td>
					<td class="spacer-col">&nbsp;</td>
					<td class="text-center quarter-col">{homeQuarters.q1}</td>
					<td class="text-center quarter-col">{homeQuarters.q2}</td>
					<td class="text-center quarter-col">{homeQuarters.q3}</td>
					<td class="text-center quarter-col">{homeQuarters.q4}</td>
					<td class="spacer-col">&nbsp;</td>
					{#if quarterScores.hasOvertime}
						<td class="text-center p-1 ot-col">{homeOT}</td>
					{/if}
					<td class="text-center p-1 total-col">{homeTotal}</td>
				</tr>
				<tr>
					<td class="p-1 font-medium team-with-timeouts">
						<span class="team-abbr">{awayTeam.team.abbreviation}</span>
						<span class="timeout-dots">
							{#each Array(timeoutInfo.totalAvailable) as _, index}
								<span class="timeout-dot" class:active={index < timeoutInfo.awayRemaining} />
							{/each}
						</span>
					</td>
					<td class="spacer-col">&nbsp;</td>
					<td class="text-center quarter-col">{awayQuarters.q1}</td>
					<td class="text-center quarter-col">{awayQuarters.q2}</td>
					<td class="text-center quarter-col">{awayQuarters.q3}</td>
					<td class="text-center quarter-col">{awayQuarters.q4}</td>
					<td class="spacer-col">&nbsp;</td>
					{#if quarterScores.hasOvertime}
						<td class="text-center p-1 ot-col">{awayOT}</td>
					{/if}
					<td class="text-center p-1 total-col">{awayTotal}</td>
				</tr>
			</tbody>
		</table>
	</div>
{/if}

<style>
	.quarter-score-display {
		--spacer-left-width: 2.9rem; /* Adjust left spacer (between Team and Q1) */
		--spacer-right-width: 1.3rem; /* Adjust right spacer (between Q4 and OT/Total) */

		height: 12vh;
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
	}

	/* Apply spacer widths to colgroup */
	.quarter-score-display .spacer-col-left {
		width: var(--spacer-left-width);
	}

	.quarter-score-display .spacer-col-right {
		width: var(--spacer-right-width);
	}

	.quarter-score-display table {
		height: auto;
		table-layout: fixed;
		border-collapse: collapse;
	}

	.quarter-score-display thead th {
		opacity: 0.87;
		font-size: 0.87rem;
	}

	/* Spacer columns - create visual separation between quarter group and other columns */
	.spacer-col {
		padding: 0;
		border: none;
		overflow: hidden;
	}

	/* Quarter columns - Q1-Q4 grouped together with minimal spacing */
	.quarter-col {
		padding: 0.25rem 0.15rem;
		text-align: center;
	}

	.team-with-timeouts {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 0.25rem;
		min-width: 0;
	}

	.team-abbr {
		font-weight: 600;
		letter-spacing: 0.3px;
		width: 3.5ch;
		display: inline-block;
		flex-shrink: 0;
	}

	.timeout-dots {
		display: inline-flex;
		gap: 0.25rem;
		align-items: center;
		justify-content: flex-start;
		padding-left: 1.2rem;
		padding-right: 1.2rem;
	}

	.timeout-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
		background-color: rgba(255, 255, 255, 0.2);
		transition: background-color 0.2s ease;
	}

	.timeout-dot.active {
		background-color: rgba(255, 255, 255, 0.8);
	}
</style>
