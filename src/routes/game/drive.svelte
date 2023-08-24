<script lang="ts">
	import { headerText } from '$lib/stores';
	import type { Drive, TeamSummary } from '../../models/game-summary';

	export let drive: Drive;
	export let teams: TeamSummary[];

	const homeTeam = teams[0];
	const awayTeam = teams[1];

	$: homeScore = drive.plays[0]?.homeScore;
	$: awayScore = drive.plays[0]?.awayScore;
</script>

{#if drive.plays.length > 0}
	<div class="card rounded-none flex items-center sticky top-0">
		<div class="p-2 h-16 w-16">
			<img class="center" src={drive.team.logos[0]?.href} alt="Team_Img" />
		</div>
		<div class="flex-1 p-2">
			{#if drive.finished}
				<div>{drive?.displayResult}</div>
				<div>{drive.description}</div>
			{/if}
		</div>
		<div class="flex">
			<div class="p-2">
				<div>{homeTeam?.team.abbreviation}</div>
				<div class="text-center">{homeScore || 0}</div>
			</div>
			<div class="p-2">
				<div>{awayTeam?.team.abbreviation}</div>
				<div class="text-center">{awayScore || 0}</div>
			</div>
		</div>
	</div>
{/if}
