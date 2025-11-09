/**
 * Quarter score data structure
 * Each array contains 4 elements representing Q1, Q2, Q3, Q4
 */
export interface QuarterScores {
	/** Points scored by home team per quarter [Q1, Q2, Q3, Q4] */
	home: number[];
	/** Points scored by away team per quarter [Q1, Q2, Q3, Q4] */
	away: number[];
	/** Array of quarter numbers that have started (1-4) */
	quartersStarted: number[];
	/** Points scored by home team in overtime (0 if no OT) */
	homeOT: number;
	/** Points scored by away team in overtime (0 if no OT) */
	awayOT: number;
	/** Whether the game went to overtime */
	hasOvertime: boolean;
	/** Current quarter number (1-4 for regulation, 5+ for OT) */
	currentQuarter: number;
}
