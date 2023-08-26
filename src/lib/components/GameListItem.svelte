<script lang="ts">
	import type { GameSchedule } from '../../models/schedule';

	export let game: GameSchedule;

	$: disableGame = !game.status.type.completed ? 'game-disbaled' : '';

	const homeTeam = game.competitions[0].competitors.find((c) => c.homeAway === 'home')?.team;
	const awayTeam = game.competitions[0].competitors.find((c) => c.homeAway === 'away')?.team;
</script>

<a
	class="flex card p-2 text-center items-center justify-center {disableGame}"
	href="/game/{game.id}"
>
	<div class="p-2 h-14 w-14">
		<img src={homeTeam?.logo} alt="homeTeam" />
	</div>
	<div class="text-xl mx-6">VS.</div>

	<div class="p-2 h-14 w-14">
		<img src={awayTeam?.logo} alt="awayTeam" />
	</div>
</a>

<style>
	a {
		text-decoration: none !important;
	}

	.game-disbaled {
		pointer-events: none;
		background-color: #303135 !important;
		opacity: 0.3;
	}
</style>
