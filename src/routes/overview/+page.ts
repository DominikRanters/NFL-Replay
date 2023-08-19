import type { GameSummary } from "../../models/game-summary";
import GameSummaryJson from "$lib/49ers_vs_Raiders.json";

export const load = async ({ fetch }: any): Promise<{ gamesummary: GameSummary}> => {
    return { gameSummary: GameSummaryJson } as unknown as { gamesummary: GameSummary};
    // import root level object as a named import
}