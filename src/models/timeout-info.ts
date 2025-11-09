/**
 * Timeout information data structure
 * Tracks remaining timeouts for both teams in the current game phase
 */
export interface TimeoutInfo {
	/** Number of timeouts remaining for home team in current phase */
	homeRemaining: number;
	/** Number of timeouts remaining for away team in current phase */
	awayRemaining: number;
	/** Total timeouts available in current phase (3 for regulation, 2 for OT) */
	totalAvailable: number;
	/** Current game phase: 'first-half' | 'second-half' | 'overtime' */
	phase: 'first-half' | 'second-half' | 'overtime';
}
