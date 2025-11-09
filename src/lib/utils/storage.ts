/**
 * Safe localStorage utility functions with error handling
 */

/**
 * Safely retrieves an item from localStorage
 * @param key - The storage key
 * @returns The stored value or null if not found or error occurs
 */
export function getStorageItem(key: string): string | null {
	try {
		if (typeof window === 'undefined') {
			return null;
		}
		return window.localStorage.getItem(key);
	} catch (error) {
		console.error(`Error getting storage item "${key}":`, error);
		return null;
	}
}

/**
 * Safely sets an item in localStorage
 * @param key - The storage key
 * @param value - The value to store
 */
export function setStorageItem(key: string, value: string): void {
	try {
		if (typeof window === 'undefined') {
			return;
		}
		window.localStorage.setItem(key, value);
	} catch (error) {
		console.error(`Error setting storage item "${key}":`, error);
	}
}

/**
 * Safely removes an item from localStorage
 * @param key - The storage key
 */
export function removeStorageItem(key: string): void {
	try {
		if (typeof window === 'undefined') {
			return;
		}
		window.localStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing storage item "${key}":`, error);
	}
}

/**
 * Clears all localStorage items that start with the given prefix
 * @param prefix - The prefix to match against storage keys
 */
export function clearStorageByPrefix(prefix: string): void {
	try {
		if (typeof window === 'undefined') {
			return;
		}

		const keysToRemove: string[] = [];
		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (key && key.startsWith(prefix)) {
				keysToRemove.push(key);
			}
		}

		keysToRemove.forEach((key) => {
			window.localStorage.removeItem(key);
		});
	} catch (error) {
		console.error(`Error clearing storage with prefix "${prefix}":`, error);
	}
}

