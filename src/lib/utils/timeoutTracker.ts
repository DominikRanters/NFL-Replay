import type { Drive, TeamSummary } from '../../models/game-summary';
import type { TimeoutInfo } from '../../models/timeout-info';
import { PlayTypes } from '../../models/play-types';
import { getQuarterNumber, getHighestQuarter } from './gameHelpers';

/**
 * Determines the current game phase based on the highest quarter seen
 * @param highestQuarter - The highest quarter number seen in the game
 * @returns Game phase identifier
 */
function determinePhase(highestQuarter: number): 'first-half' | 'second-half' | 'overtime' {
	if (highestQuarter >= 5) {
		return 'overtime';
	} else if (highestQuarter >= 3) {
		return 'second-half';
	}
	return 'first-half';
}

/**
 * Gets total timeouts available based on the current phase
 * @param phase - The current game phase
 * @returns Number of timeouts (3 for regulation, 2 for overtime)
 */
function getTotalTimeouts(phase: 'first-half' | 'second-half' | 'overtime'): number {
	return phase === 'overtime' ? 2 : 3;
}

/**
 * Checks if a play is in the specified phase
 * @param quarter - Quarter number from play
 * @param targetPhase - The phase to check against
 * @returns True if the play is in the target phase
 */
function isPlayInPhase(
	quarter: number,
	targetPhase: 'first-half' | 'second-half' | 'overtime'
): boolean {
	if (targetPhase === 'first-half') {
		return quarter >= 1 && quarter <= 2;
	} else if (targetPhase === 'second-half') {
		return quarter >= 3 && quarter <= 4;
	} else {
		// overtime
		return quarter >= 5;
	}
}

/**
 * Extracts team abbreviation from timeout play text
 * @param playText - The play text (e.g., "Timeout #1 by DEN at 02:36.")
 * @returns Team abbreviation or null if not found
 */
function extractTeamFromTimeoutText(playText: string): string | null {
	if (!playText) {
		return null;
	}

	// Pattern: "Timeout #N by TEAM at TIME"
	const match = playText.match(/by\s+([A-Z]{2,3})\s+at/i);
	if (match && match[1]) {
		return match[1].toUpperCase();
	}

	return null;
}

/**
 * Counts timeouts used by a specific team in the current phase
 * @param drives - Array of drives to process
 * @param teamAbbr - Team abbreviation to count for
 * @param phase - The game phase to count in
 * @returns Number of timeouts used
 */
function countTimeoutsUsed(
	drives: Drive[],
	teamAbbr: string,
	phase: 'first-half' | 'second-half' | 'overtime'
): number {
	if (!teamAbbr || !drives) {
		return 0;
	}

	let count = 0;
	const upperTeamAbbr = teamAbbr.toUpperCase();

	// Process all drives (including unfinished ones to show real-time updates)
	for (const drive of drives) {
		if (!drive.plays || drive.plays.length === 0) {
			continue;
		}

		// Process plays in chronological order (reverse of stored order)
		const chronologicalPlays = [...drive.plays].reverse();

		for (const play of chronologicalPlays) {
			// Check if this is a timeout play
			if (!play || !play.type || Number(play.type.id) !== PlayTypes.Timeout) {
				continue;
			}

			// Get the quarter
			const quarter = getQuarterNumber(play);
			if (quarter === 0) {
				continue;
			}

			// Check if this timeout is in the current phase
			if (!isPlayInPhase(quarter, phase)) {
				continue;
			}

			// Extract team from play text
			const timeoutTeam = extractTeamFromTimeoutText(play.text);
			if (timeoutTeam === upperTeamAbbr) {
				count++;
			}
		}
	}

	return count;
}

/**
 * Calculates current timeout information for both teams
 * @param drives - Array of drives (may include unfinished drives for real-time updates)
 * @param teams - Array of team summaries to identify home/away
 * @returns TimeoutInfo with remaining timeouts for both teams
 */
export function calculateTimeoutInfo(drives: Drive[], teams: TeamSummary[]): TimeoutInfo {
	// Default state: first half, 3 timeouts each
	const defaultInfo: TimeoutInfo = {
		homeRemaining: 3,
		awayRemaining: 3,
		totalAvailable: 3,
		phase: 'first-half'
	};

	if (!drives || !teams || teams.length < 2) {
		return defaultInfo;
	}

	// Identify home and away teams
	const homeTeam = teams.find((t) => t.homeAway === 'home');
	const awayTeam = teams.find((t) => t.homeAway === 'away');

	if (!homeTeam || !awayTeam) {
		return defaultInfo;
	}

	const homeAbbr = homeTeam.team.abbreviation;
	const awayAbbr = awayTeam.team.abbreviation;

	if (!homeAbbr || !awayAbbr) {
		return defaultInfo;
	}

	// Determine current phase based on highest quarter seen
	const highestQuarter = getHighestQuarter(drives);
	const currentPhase = determinePhase(highestQuarter);
	const totalTimeouts = getTotalTimeouts(currentPhase);

	// Count timeouts used in current phase
	const homeUsed = countTimeoutsUsed(drives, homeAbbr, currentPhase);
	const awayUsed = countTimeoutsUsed(drives, awayAbbr, currentPhase);

	// Calculate remaining (ensure non-negative)
	const homeRemaining = Math.max(0, totalTimeouts - homeUsed);
	const awayRemaining = Math.max(0, totalTimeouts - awayUsed);

	return {
		homeRemaining,
		awayRemaining,
		totalAvailable: totalTimeouts,
		phase: currentPhase
	};
}
