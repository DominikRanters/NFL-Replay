import type { Schedule } from '../../models/schedule';

export const load = async ({ fetch }: any): Promise<{ schedule: Schedule }> => {
	const url = 'https://nfl-api1.p.rapidapi.com/nflschedule?year=2019&month=11&day=17';
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'c0cff608d4mshf487afae5bf6c44p1ac229jsnc5e33d6f770f',
			'X-RapidAPI-Host': 'nfl-api1.p.rapidapi.com'
		}
	};

	try {
		const response = await fetch(url, options);
		const result = (await response.json()) as Schedule;

		return { schedule: result };
	} catch (error) {
		console.error(error);
		throw new Error('Fetch failed');
	}

	// return { schedule: ScheduleJson } as unknown as { schedule: Schedule };
};
