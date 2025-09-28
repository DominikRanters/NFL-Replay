import type { GameSummary, PlayType } from '../../../models/game-summary';
import GameSummaryJson from '$lib/49ers_vs_Raiders.json';
import { PlayTypes } from '../../../models/play-types';

interface LoadParam {
	fetch: any;
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
		const summary = (await response.json()) as GameSummary;

		// const summary = GameSummaryJson as unknown as GameSummary;

		if (summary.drives && summary.drives.previous) {
			summary.drives.previous = summary.drives.previous.map((drive) => {
				const newPlays = drive.plays.filter(
					(play) => Number(play.type.id) != PlayTypes.OfficalTimeout
				);

				return {
					...drive,
					plays: newPlays
				};
			});

			const playTypes: PlayType[] = [];
			summary.drives.previous.map((drive) => {
				drive.plays.map((play) => {
					if (!playTypes.some((pt) => pt.id == play.type.id)) {
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
