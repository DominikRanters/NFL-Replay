import type { GameSummary, PlayType } from '../../../models/game-summary';
import GameSummaryJson from '$lib/49ers_vs_Raiders.json';
import { PlayTypes } from '../../../models/play-types';

export const load = async ({ fetch }: any): Promise<{ gameSummary: GameSummary }> => {
	const summary: GameSummary = GameSummaryJson as unknown as GameSummary;
	summary.drives.previous = summary.drives.previous.map((drive) => {
		const newPlays = drive.plays.filter((play) => Number(play.type.id) != PlayTypes.OfficalTimeout);

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

	console.log('playTypes', playTypes);

	return { gameSummary: summary } as unknown as { gameSummary: GameSummary };
};
