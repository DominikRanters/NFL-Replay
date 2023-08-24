import { PlayTypes } from './play-types';

export interface GameSummary {
	id: number;
	teams: TeamSummary[];
	drives: { previous: Drive[] };
}

export interface TeamSummary {
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
	abbreviation: string;
	logos: Logo[];
}

interface Linescores {
	displayValue: number;
}

export interface Drive {
	id: number;
	displayResult: string;
	shortDisplayResult: string;
	isScore: boolean;
	description: string;
	team: DriveTeam;
	start: DriveStart;
	plays: Play[];
	finished: boolean;
}

interface DriveTeam {
	shortDisplayName: string;
	displayName: string;
	name: string;
	abbreviation: string;
	logos: Logo[];
}

interface Logo {
	href: string; // https://a.espncdn.com/i/teamlogos/nfl/500/sf.png
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
	id: number;
	sequenceNumber: string;
	homeScore: number;
	awayScore: number;
	scoringPlay: boolean;
	priority: boolean;
	statYardage: number;
	start: PlayStart;
	clock: { displayValue: string };
	period: { number: number };
	text: string;
	type: PlayType;
}

interface PlayStart {
	shortDownDistanceText?: string;
	possessionText?: string;
}

export interface PlayType {
	id: PlayTypes;
	text: string;
	abbreviation: string;
}
