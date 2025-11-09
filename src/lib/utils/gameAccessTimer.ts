import { ACCESS_DURATION_MS, STORAGE_KEY_PREFIX } from '../constants/gameAccess';
import { getStorageItem, setStorageItem, clearStorageByPrefix } from './storage';

/**
 * Generates the storage key for a specific game
 * @param gameId - The game ID
 * @returns The storage key for the game
 */
export function getGameAccessKey(gameId: string): string {
	return `${STORAGE_KEY_PREFIX}${gameId}`;
}

/**
 * Retrieves the stored access timestamp for a game
 * @param gameId - The game ID
 * @returns The timestamp in milliseconds or null if not found
 */
export function getGameAccessTimestamp(gameId: string): number | null {
	const key = getGameAccessKey(gameId);
	const storedValue = getStorageItem(key);

	if (!storedValue) {
		return null;
	}

	const timestamp = parseInt(storedValue, 10);
	return isNaN(timestamp) ? null : timestamp;
}

/**
 * Checks if an access timestamp has expired
 * @param timestamp - The timestamp to check
 * @returns True if the timestamp is older than the access duration
 */
export function isAccessExpired(timestamp: number): boolean {
	const now = Date.now();
	const elapsed = now - timestamp;
	return elapsed >= ACCESS_DURATION_MS;
}

/**
 * Checks if a game access is still valid
 * @param gameId - The game ID to check
 * @returns Object with isValid flag and whether timestamp exists
 */
export function checkGameAccess(gameId: string): { isValid: boolean; hasTimestamp: boolean } {
	const timestamp = getGameAccessTimestamp(gameId);

	if (timestamp === null) {
		// No timestamp means first access - allow it
		return { isValid: true, hasTimestamp: false };
	}

	return { isValid: !isAccessExpired(timestamp), hasTimestamp: true };
}

/**
 * Stores the current timestamp for a game access
 * @param gameId - The game ID
 */
export function setGameAccess(gameId: string): void {
	const key = getGameAccessKey(gameId);
	const timestamp = Date.now().toString();
	setStorageItem(key, timestamp);
}

/**
 * Clears all game access timestamps from storage
 */
export function clearAllGameAccess(): void {
	clearStorageByPrefix(STORAGE_KEY_PREFIX);
}

