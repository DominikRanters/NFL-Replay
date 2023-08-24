export interface Schedule {
	[key: string]: { games: GameSchedule[] };
}

export interface GameSchedule {
	id: number;
	date: string;
	week: { number: number };
	name: string;
	shortName: string;
	season: Season;
	competitions: Competitions[];
}

interface Season {
	year: string;
	type: number;
	slug: string; // e.x. "preseason"
}

interface Competitions {
	competitors: Competitors[];
}

interface Competitors {
	homeAway: 'home' | 'away';
	team: CompetitorsTeam;
}

interface CompetitorsTeam {
	shortDisplayName: string;
	displayName: string;
	name: string;
	abbreviation: string;
	logo: string; // https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/atl.png
}
