export interface GameSummary {
	id: number;
	teams: TeamSummary[];
	drives: { previous: Drive[] };
}

interface TeamSummary {
	record: TeamRecord;
	homeAway: 'home' | 'away';
	score: number;
	team: Team;
	linescores: Linescores[];
}

interface TeamRecord {
	displayValue: string;
	type: 'total' | 'home' | 'vsconf';
}

interface Team {
	displayName: string;
	name: string;
	nickname: string;
	logos: any[]; // TODO need to add interface
}

interface Linescores {
	displayValue: number;
}

export interface Drive {
	displayResult: string;
	shortDisplayResult: string;
	isScore: boolean;
	description: string;
	team: DriveTeam;
	start: DriveStart;
	plays: Play[];
}

interface DriveTeam {
	shortDisplayName: string;
	displayName: string;
	name: string;
	abbreviation: string;
	logos: any[]; // TODO need to add interface
}

interface DriveStart {
	period: Period;
	yardLine: number;
	clock: { displayValue: string };
	text: string;
}

interface Period {
	number: number;
	type: string;
}

export interface Play {
	sequenceNumber: string;
	scoringPlay: boolean;
	priority: boolean;
	statYardage: number;
	text: string;
	type: PlayType;
}

interface PlayType {
	id: number;
	text: string;
	abbreviation: string;
}
