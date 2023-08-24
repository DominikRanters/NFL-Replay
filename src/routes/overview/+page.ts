import ScheduleJson from '$lib/schedule.json';
import type { Schedule } from '../../models/schedule';

export const load = async ({ fetch }: any): Promise<{ schedule: Schedule }> => {
	return { schedule: ScheduleJson } as unknown as { schedule: Schedule };
	// import root level object as a named import
};
