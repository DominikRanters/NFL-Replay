<script lang="ts">
	import type { Play } from '../../models/game-summary';
	import { PlayTypes } from '../../models/play-types';

	export let play: Play;

	$: scoringPlayClass = (): string => {
		switch (Number(play.type.id)) {
			case PlayTypes.PassingTouchdown:
			case PlayTypes.RushingTouchdown:
				return 'touchdown';
			case PlayTypes.FieldGoalGood:
				return 'field-goal-good';
			case PlayTypes.FieldGoalMissed:
				return 'field-goal-missed';
			case PlayTypes.EndofGame:
			case PlayTypes.EndofHalf:
			case PlayTypes.Timeout:
			case PlayTypes.TwoMinuteWarning:
				return 'timeout';
			case PlayTypes.FumbleRecoveryOpponent:
			case PlayTypes.PassInterceptionReturn:
				return 'turnover';
			default:
				return '';
		}
	};

	$: downClass = (): string => {
		if (play.start?.shortDownDistanceText?.includes('1st')) {
			return 'firstDown';
		}
		if (play.start?.shortDownDistanceText?.includes('2nd')) {
			return 'secondDown';
		}
		if (play.start?.shortDownDistanceText?.includes('3rd')) {
			return 'thirdDown';
		}
		if (play.start?.shortDownDistanceText?.includes('4th')) {
			return 'fourthDown';
		}

		return '';
	};

	const buildPlayHeadline = (): string => {
		if (play.text.toUpperCase().includes('UNNECESSARY ROUGHBESS')) {
			return `${play.statYardage} Unnecessary Roughness`;
		}
		if (play.text.toUpperCase().includes('PASS INTERFERENCE')) {
			return `${play.statYardage} Yard Pass Interference`;
		}
		if (play.text.toUpperCase().includes('PENALTY')) {
			return `${play.statYardage} Yard Penalty`;
		}

		switch (Number(play.type.id)) {
			case PlayTypes.PassReception:
				return `${play.statYardage} Yard Pass`;
			case PlayTypes.Rush:
			case PlayTypes.Sack:
			case PlayTypes.KickoffReturn:
			case PlayTypes.PassInterceptionReturn: // Own case. Not no Gain Text
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

<div class="flex card rounded-none p-2 {scoringPlayClass()}">
	<div class="w-24 flex-none">
		<div class={downClass()}>{play.start?.shortDownDistanceText || ''}</div>
		<div class=" text-secondary-500">{play.start?.possessionText || ''}</div>
		<div class=" text-secondary-500">{startTimeText}</div>
	</div>
	<div>
		<h4 class="h4">{buildPlayHeadline()}</h4>
		<div class="text-secondary-500">{play.text}</div>
	</div>
</div>
