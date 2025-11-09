import type { Drive, Play } from '../../models/game-summary';

/**
 * Gets the quarter number from a play
 * @param play - The play to extract quarter from
 * @returns Quarter number (1-4 for regulation, 5+ for OT) or 0 if invalid
 */
export function getQuarterNumber(play: Play): number {
	if (!play || !play.period || typeof play.period.number !== 'number') {
		return 0;
	}
	return play.period.number >= 1 ? play.period.number : 0;
}

/**
 * Gets the highest quarter number seen in all drives
 * @param drives - Array of drives to analyze
 * @returns Highest quarter number (minimum 1 if no valid plays found)
 */
export function getHighestQuarter(drives: Drive[]): number {
	let highest = 1;

	for (const drive of drives) {
		if (!drive.plays || drive.plays.length === 0) {
			continue;
		}

		for (const play of drive.plays) {
			const quarter = getQuarterNumber(play);
			if (quarter > highest) {
				highest = quarter;
			}
		}
	}

	return highest;
}

/**
 * Checks if a quarter has started by examining all drives
 * @param quarter - Quarter number (1-4 for regulation)
 * @param drives - Array of drives to check
 * @returns True if the quarter has any plays
 */
export function hasQuarterStarted(quarter: number, drives: Drive[]): boolean {
	if (quarter < 1 || quarter > 4) {
		return false;
	}

	for (const drive of drives) {
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
