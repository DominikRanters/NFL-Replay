import type { GameSummary, PlayType } from '../../../models/game-summary';
// import GameSummaryJson from '$lib/49ers_vs_Raiders.json'; // Fallback data if needed
import { PlayTypes } from '../../../models/play-types';

interface LoadParam {
	fetch: (url: string, options?: RequestInit) => Promise<Response>;
	params: {
		id: number;
	};
}

export const load = async ({ fetch, params }: LoadParam): Promise<{ gameSummary: GameSummary }> => {
	const url = `https://nfl-api1.p.rapidapi.com/nflsummary?id=${params.id}`;

	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'c0cff608d4mshf487afae5bf6c44p1ac229jsnc5e33d6f770f',
			'X-RapidAPI-Host': 'nfl-api1.p.rapidapi.com'
		}
	};

	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status} ${response.statusText}`);
		}

		const summary = (await response.json()) as GameSummary;

		if (summary.drives && summary.drives.previous) {
			summary.drives.previous = summary.drives.previous.map((drive) => {
				// Filter out plays with missing or invalid type data
				const newPlays = drive.plays.filter((play) => {
					// Check if play and type exist
					if (!play || !play.type || !play.type.id) {
						return false;
					}

					// Filter out official timeouts
					return Number(play.type.id) != PlayTypes.OfficalTimeout;
				});

				return {
					...drive,
					plays: newPlays
				};
			});

			const playTypes: PlayType[] = [];
			summary.drives.previous.map((drive) => {
				drive.plays.map((play) => {
					// Only add play types that have valid data
					if (play && play.type && play.type.id && !playTypes.some((pt) => pt.id == play.type.id)) {
						playTypes.push(play.type);
					}
				});
			});

			playTypes.sort(function (a, b) {
				return Number(a.id) - Number(b.id);
			});
		}

		return { gameSummary: summary };
	} catch (error) {
		console.error(error);
		throw new Error('Fetch game failed');
	}
};
