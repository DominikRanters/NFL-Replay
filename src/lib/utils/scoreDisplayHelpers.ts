/**
 * Display helper utilities for quarter score display
 * These functions handle the presentation logic for scores
 */

/**
 * Gets the display score for a quarter
 * Q1 defaults to "0", others default to empty string until they start
 * @param quarterNumber - The quarter number (1-4)
 * @param teamScores - Array of scores for each quarter
 * @param quartersStarted - Array of quarters that have started
 * @returns Display string for the quarter
 */
export function getQuarterDisplay(
	quarterNumber: number,
	teamScores: number[],
	quartersStarted: number[]
): string {
	const quarterIndex = quarterNumber - 1;
	const hasStarted = quartersStarted.includes(quarterNumber);
	const defaultDisplay = quarterNumber === 1 ? '0' : '';

	return hasStarted ? teamScores[quarterIndex].toString() : defaultDisplay;
}

/**
 * Gets all quarter displays for a team
 * @param teamScores - Array of scores for each quarter [Q1, Q2, Q3, Q4]
 * @param quartersStarted - Array of quarters that have started
 * @returns Object with display strings for all quarters
 */
export function getQuarterDisplays(teamScores: number[], quartersStarted: number[]) {
	return {
		q1: getQuarterDisplay(1, teamScores, quartersStarted),
		q2: getQuarterDisplay(2, teamScores, quartersStarted),
		q3: getQuarterDisplay(3, teamScores, quartersStarted),
		q4: getQuarterDisplay(4, teamScores, quartersStarted)
	};
}

/**
 * Calculates total points for a team
 * @param teamScores - Array of scores for each quarter [Q1, Q2, Q3, Q4]
 * @param overtimeScore - Overtime score (0 if no OT)
 * @returns Total points scored
 */
export function calculateTotal(teamScores: number[], overtimeScore: number): number {
	return teamScores.reduce((sum, score) => sum + score, 0) + overtimeScore;
}
