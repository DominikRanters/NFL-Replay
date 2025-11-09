import type { Drive, Play, TeamSummary } from '../../models/game-summary';
import type { QuarterScores } from '../../models/quarter-scores';
import { getQuarterNumber, getHighestQuarter, hasQuarterStarted } from './gameHelpers';

/**
 * Calculates the score change for a team between two plays
 * @param previousPlay - The previous play (null if this is the first play)
 * @param currentPlay - The current play
 * @param teamType - 'home' or 'away'
 * @returns The point difference (0 if no change or invalid data)
 */
function getScoreChange(
	previousPlay: Play | null,
	currentPlay: Play,
	teamType: 'home' | 'away'
): number {
	if (!currentPlay) {
		return 0;
	}

	const currentScore = teamType === 'home' ? currentPlay.homeScore : currentPlay.awayScore;

	if (typeof currentScore !== 'number') {
		return 0;
	}

	if (!previousPlay) {
		// First play in quarter - score is the starting score (should be 0, but handle edge cases)
		return currentScore;
	}

	const previousScore = teamType === 'home' ? previousPlay.homeScore : previousPlay.awayScore;

	if (typeof previousScore !== 'number') {
		return currentScore;
	}

	return currentScore - previousScore;
}

/**
 * Processes a single play and updates quarter scores
 * @param play - The play to process
 * @param quarterScores - The quarter scores object to update
 * @param lastPlayPerQuarter - Map of last play seen per quarter
 * @param scoreAtEndOfQuarter - Map of scores at end of each quarter
 */
function processPlay(
	play: Play,
	quarterScores: QuarterScores,
	lastPlayPerQuarter: Map<number, Play>,
	scoreAtEndOfQuarter: Map<number, { home: number; away: number }>
): void {
	const quarter = getQuarterNumber(play);

	if (quarter === 0) {
		return; // Skip invalid quarters
	}

	// Get the score at the start of this quarter (end of previous quarter, or 0 for Q1)
	const quarterStartScore = scoreAtEndOfQuarter.get(quarter - 1) || { home: 0, away: 0 };

	// Get the previous play in this quarter (if any)
	const previousPlay = lastPlayPerQuarter.get(quarter) || null;

	// Calculate score changes
	let homeScoreChange: number;
	let awayScoreChange: number;

	if (!previousPlay) {
		// First play in this quarter - compare to quarter start score
		const currentHomeScore = play.homeScore || 0;
		const currentAwayScore = play.awayScore || 0;
		homeScoreChange = currentHomeScore - quarterStartScore.home;
		awayScoreChange = currentAwayScore - quarterStartScore.away;
	} else {
		// Subsequent play in same quarter - compare to previous play
		homeScoreChange = getScoreChange(previousPlay, play, 'home');
		awayScoreChange = getScoreChange(previousPlay, play, 'away');
	}

	// Add score changes to the appropriate totals
	updateScoreTotals(quarter, homeScoreChange, awayScoreChange, quarterScores);

	// Update the last play seen in this quarter
	lastPlayPerQuarter.set(quarter, play);

	// Update the score at the end of this quarter
	const currentHomeScore = play.homeScore || 0;
	const currentAwayScore = play.awayScore || 0;
	scoreAtEndOfQuarter.set(quarter, { home: currentHomeScore, away: currentAwayScore });
}

/**
 * Updates score totals for a specific quarter
 * @param quarter - Quarter number
 * @param homeScoreChange - Points scored by home team
 * @param awayScoreChange - Points scored by away team
 * @param quarterScores - The quarter scores object to update
 */
function updateScoreTotals(
	quarter: number,
	homeScoreChange: number,
	awayScoreChange: number,
	quarterScores: QuarterScores
): void {
	if (quarter >= 1 && quarter <= 4) {
		// Regular quarter (Q1-Q4)
		const quarterIndex = quarter - 1;
		quarterScores.home[quarterIndex] += homeScoreChange;
		quarterScores.away[quarterIndex] += awayScoreChange;
	} else if (quarter >= 5) {
		// Overtime (period 5+)
		quarterScores.homeOT += homeScoreChange;
		quarterScores.awayOT += awayScoreChange;
	}
}

/**
 * Processes all drives and calculates scores chronologically
 * @param finishedDrives - Array of finished drives
 * @param quarterScores - The quarter scores object to update
 */
function processAllDrivesForScores(finishedDrives: Drive[], quarterScores: QuarterScores): void {
	// Track the score at the end of each quarter (used as starting score for next quarter)
	const scoreAtEndOfQuarter: Map<number, { home: number; away: number }> = new Map();
	// Track the last play seen per quarter for score change calculation within the same quarter
	const lastPlayPerQuarter: Map<number, Play> = new Map();

	// Process drives in chronological order (oldest first)
	// Since drives array is reversed (newest first), we reverse it for processing
	const chronologicalDrives = [...finishedDrives].reverse();

	// Process each drive chronologically
	for (const drive of chronologicalDrives) {
		if (!drive.plays || drive.plays.length === 0) {
			continue;
		}

		// Process plays in chronological order (oldest first)
		// Plays are stored in reverse order (newest first), so reverse for processing
		const chronologicalPlays = [...drive.plays].reverse();

		// Process each play
		for (const play of chronologicalPlays) {
			processPlay(play, quarterScores, lastPlayPerQuarter, scoreAtEndOfQuarter);
		}
	}
}

/**
 * Determines which quarters have started
 * @param finishedDrives - Array of finished drives
 * @returns Array of quarter numbers that have started
 */
function determineStartedQuarters(finishedDrives: Drive[]): number[] {
	const quartersStarted: number[] = [];

	for (let quarter = 1; quarter <= 4; quarter++) {
		if (hasQuarterStarted(quarter, finishedDrives)) {
			quartersStarted.push(quarter);
		}
	}

	return quartersStarted;
}

/**
 * Calculates quarter-by-quarter scores from finished drives
 * Scores are calculated per quarter (not cumulative)
 * @param drives - Array of drives (may include unfinished drives)
 * @param teams - Array of team summaries to identify home/away
 * @returns Quarter scores with home/away points per quarter, OT scores, and quarters started
 */
export function calculateQuarterScores(drives: Drive[], teams: TeamSummary[]): QuarterScores {
	// Initialize quarter scores (Q1-Q4, index 0-3)
	const quarterScores: QuarterScores = {
		home: [0, 0, 0, 0],
		away: [0, 0, 0, 0],
		quartersStarted: [],
		homeOT: 0,
		awayOT: 0,
		hasOvertime: false,
		currentQuarter: 0
	};

	if (!drives || !teams || teams.length < 2) {
		return quarterScores;
	}

	// Filter to only finished drives
	const finishedDrives = drives.filter((drive) => drive.finished === true);

	if (finishedDrives.length === 0) {
		return quarterScores;
	}

	// Determine current quarter and if overtime exists
	const highestQuarter = getHighestQuarter(finishedDrives);
	quarterScores.currentQuarter = highestQuarter;
	quarterScores.hasOvertime = highestQuarter >= 5;

	// Identify home and away teams
	const homeTeam = teams.find((t) => t.homeAway === 'home');
	const awayTeam = teams.find((t) => t.homeAway === 'away');

	if (!homeTeam || !awayTeam) {
		return quarterScores;
	}

	// Process all drives and calculate scores
	processAllDrivesForScores(finishedDrives, quarterScores);

	// Determine which quarters have started
	quarterScores.quartersStarted = determineStartedQuarters(finishedDrives);

	return quarterScores;
}
