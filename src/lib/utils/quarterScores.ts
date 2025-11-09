import type { Drive, Play, TeamSummary } from '../../models/game-summary';
import type { QuarterScores } from '../../models/quarter-scores';

/**
 * Gets the quarter number from a play
 * @param play - The play to extract quarter from
 * @returns Quarter number (1-4) or 0 if invalid
 */
function getQuarterNumber(play: Play): number {
	if (!play || !play.period || typeof play.period.number !== 'number') {
		return 0;
	}
	const quarter = play.period.number;
	return quarter >= 1 && quarter <= 4 ? quarter : 0;
}

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
 * Checks if a quarter has started by examining all finished drives
 * @param quarter - Quarter number (1-4)
 * @param finishedDrives - Array of finished drives
 * @returns True if the quarter has any plays
 */
function hasQuarterStarted(quarter: number, finishedDrives: Drive[]): boolean {
	if (quarter < 1 || quarter > 4) {
		return false;
	}

	for (const drive of finishedDrives) {
		if (!drive.plays || drive.plays.length === 0) {
			continue;
		}

		// Check if any play in this drive is in the specified quarter
		for (const play of drive.plays) {
			if (getQuarterNumber(play) === quarter) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Calculates quarter-by-quarter scores from finished drives
 * Scores are calculated per quarter (not cumulative)
 * @param drives - Array of drives (may include unfinished drives)
 * @param teams - Array of team summaries to identify home/away
 * @returns Quarter scores with home/away points per quarter and quarters started
 */
export function calculateQuarterScores(drives: Drive[], teams: TeamSummary[]): QuarterScores {
	// Initialize quarter scores (Q1-Q4, index 0-3)
	const quarterScores: QuarterScores = {
		home: [0, 0, 0, 0],
		away: [0, 0, 0, 0],
		quartersStarted: []
	};

	if (!drives || !teams || teams.length < 2) {
		return quarterScores;
	}

	// Filter to only finished drives
	const finishedDrives = drives.filter((drive) => drive.finished === true);

	if (finishedDrives.length === 0) {
		return quarterScores;
	}

	// Identify home and away teams
	const homeTeam = teams.find((t) => t.homeAway === 'home');
	const awayTeam = teams.find((t) => t.homeAway === 'away');

	if (!homeTeam || !awayTeam) {
		return quarterScores;
	}

	// Process drives in chronological order (oldest first)
	// Since drives array is reversed (newest first), we reverse it for processing
	const chronologicalDrives = [...finishedDrives].reverse();

	// Track the score at the end of each quarter (used as starting score for next quarter)
	const scoreAtEndOfQuarter: Map<number, { home: number; away: number }> = new Map();
	// Track the last play seen per quarter for score change calculation within the same quarter
	const lastPlayPerQuarter: Map<number, Play> = new Map();

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
			const quarter = getQuarterNumber(play);

			if (quarter === 0) {
				continue; // Skip invalid quarters
			}

			const quarterIndex = quarter - 1; // Convert to 0-based index

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

			// Add score changes to the quarter totals
			quarterScores.home[quarterIndex] += homeScoreChange;
			quarterScores.away[quarterIndex] += awayScoreChange;

			// Update the last play seen in this quarter
			lastPlayPerQuarter.set(quarter, play);

			// Update the score at the end of this quarter
			const currentHomeScore = play.homeScore || 0;
			const currentAwayScore = play.awayScore || 0;
			scoreAtEndOfQuarter.set(quarter, { home: currentHomeScore, away: currentAwayScore });
		}
	}

	// Determine which quarters have started
	for (let quarter = 1; quarter <= 4; quarter++) {
		if (hasQuarterStarted(quarter, finishedDrives)) {
			quarterScores.quartersStarted.push(quarter);
		}
	}

	return quarterScores;
}
