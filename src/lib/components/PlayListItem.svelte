<script lang="ts">
	import type { Play, Drive } from '../../models/game-summary';
	import { PlayTypes } from '../../models/play-types';

	export let play: Play;
	export let drive: Drive;

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

	const parsePenalty = (text: string): { isAccepted: boolean; yards: number; team: string } | null => {
		if (!text.toUpperCase().includes('PENALTY')) {
			return null;
		}

		const isDeclined = text.toLowerCase().includes('declined');
		const isAccepted = !isDeclined && (text.includes('enforced') || text.includes('- No Play'));

		// Extract yards: look for pattern like "10 yards, enforced" or "5 yards, enforced"
		const yardsMatch = text.match(/(\d+)\s*yards?,\s*enforced/i);
		const yards = yardsMatch ? parseInt(yardsMatch[1]) : Math.abs(play.statYardage);

		// Extract team abbreviation: "PENALTY on LV-" or "PENALTY on DEN-"
		const teamMatch = text.match(/PENALTY on ([A-Z]{2,3})-/i);
		const team = teamMatch ? teamMatch[1] : '';

		return {
			isAccepted,
			yards,
			team
		};
	};

	const parseFumble = (text: string): { team: string } | null => {
		if (!text.toUpperCase().includes('FUMBLES')) {
			return null;
		}

		// Look for team abbreviation near FUMBLES or RECOVERED by
		// Pattern: "RECOVERED by LV-" or team info in context
		const recoveredMatch = text.match(/RECOVERED by ([A-Z]{2,3})-/i);
		if (recoveredMatch) {
			return { team: recoveredMatch[1] };
		}

		// Try to extract from FUMBLES context - look for pattern before FUMBLES
		// The team that fumbled is usually the offensive team
		const fumbleMatch = text.match(/([A-Z]{2,3})-\w+.*FUMBLES/i);
		if (fumbleMatch) {
			return { team: fumbleMatch[1] };
		}

		// Fallback: use drive team
		return { team: drive.team.abbreviation };
	};

	const parseFieldGoalYards = (text: string): number | null => {
		// Pattern: "32 yard field goal" or "59 yard field goal"
		const match = text.match(/(\d+)\s*yard\s*field\s*goal/i);
		return match ? parseInt(match[1]) : null;
	};

	const buildPlayHeadline = (): string => {
		// Priority 1: Check for accepted penalty
		const penalty = parsePenalty(play.text);
		if (penalty && penalty.isAccepted && penalty.team) {
			return `Penalty ${penalty.yards} Yards (${penalty.team})`;
		}

		// Priority 2: Check for fumble (combine with original play if applicable)
		const fumble = parseFumble(play.text);
		
		// Priority 3: Check for field goal with yardage
		const fieldGoalYards = parseFieldGoalYards(play.text);
		if (fieldGoalYards !== null) {
			if (Number(play.type.id) === PlayTypes.FieldGoalMissed) {
				return `${fieldGoalYards} Yard Field Goal Missed`;
			}
			if (Number(play.type.id) === PlayTypes.FieldGoalGood) {
				return `${fieldGoalYards} Yard Field Goal`;
			}
		}

		// Build base play headline for regular plays
		let baseHeadline = '';
		
		switch (Number(play.type.id)) {
			case PlayTypes.PassReception:
				baseHeadline = `${play.statYardage} Yard Pass`;
				break;
			case PlayTypes.Rush:
			case PlayTypes.Sack:
			case PlayTypes.KickoffReturn:
			case PlayTypes.PassInterceptionReturn:
			case PlayTypes.FumbleRecoveryOpponent:
			case PlayTypes.PassingTouchdown:
			case PlayTypes.RushingTouchdown:
				if (play.statYardage == 0) {
					baseHeadline = 'No Gain';
				} else {
					baseHeadline = `${play.statYardage} Yard ${play.type.text}`;
				}
				break;
			case PlayTypes.FieldGoalGood:
				baseHeadline = 'Field Goal';
				break;
			case PlayTypes.FieldGoalMissed:
				baseHeadline = 'Field Goal Missed';
				break;
			default:
				baseHeadline = play.type.text;
		}

		// Add fumble to base headline if present
		if (fumble && fumble.team) {
			return `${baseHeadline} + Fumble (${fumble.team})`;
		}

		return baseHeadline;
	};

	const getQuarterText = (quarter: number): string => {
		switch (quarter) {
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

	const startTimeText = `${play.clock.displayValue} ${getQuarterText(play.period.number)}`;
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
