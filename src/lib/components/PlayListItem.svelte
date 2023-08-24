<script lang="ts">
	import type { Play } from '../../models/game-summary';
	import { PlayTypes } from '../../models/play-types';

	export let play: Play;

	$: scoringPlayClass = play.scoringPlay ? 'scoringPlay' : '';

	const buildPlayHeadline = (): string => {
		if (play.text.toUpperCase().includes('PENALTY')) {
			return `${play.statYardage} Yard Penalty`;
		}

		switch (Number(play.type.id)) {
			case PlayTypes.PassReception:
				return `${play.statYardage} Yard Pass`;
			case PlayTypes.Rush:
			case PlayTypes.Sack:
			case PlayTypes.KickoffReturn:
			case PlayTypes.PassInterceptionReturn:
			case PlayTypes.FumbleRecoveryOpponent:
			case PlayTypes.PassingTouchdown:
			case PlayTypes.RushingTouchdown:
				if (play.statYardage == 0) {
					return 'No Gain';
				}
				return `${play.statYardage} Yard ${play.type.text}`;

			default:
				return play.type.text;
		}
	};

	const getQauterText = (quater: number): string => {
		switch (quater) {
			case 1:
				return '1st';
			case 2:
				return '2nd';
			case 3:
				return '3rd';
			case 4:
				return '4th';
			default:
				return '';
		}
	};

	const startTimeText = `${play.clock.displayValue} ${getQauterText(play.period.number)}`;
</script>

<div class="flex card rounded-none p-2 {scoringPlayClass}">
	<div class="w-24 flex-none">
		<div>{play.start?.shortDownDistanceText || ''}</div>
		<div class=" text-secondary-500">{play.start?.possessionText || ''}</div>
		<div class=" text-secondary-500">{startTimeText}</div>
	</div>
	<div>
		<h4 class="h4">{buildPlayHeadline()}</h4>
		<div class="text-secondary-500">{play.text}</div>
	</div>
</div>

<style>
	.scoringPlay {
		background: rgba(var(--color-scoring) / 1) !important;
	}
</style>
