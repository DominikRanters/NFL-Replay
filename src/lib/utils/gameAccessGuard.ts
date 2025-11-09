import { redirect } from '@sveltejs/kit';
import { checkGameAccess, setGameAccess } from './gameAccessTimer';

/**
 * Result of game access validation
 */
export interface GameAccessValidation {
	/** Whether the access is currently valid */
	isValid: boolean;
	/** Whether the user should be redirected */
	shouldRedirect: boolean;
}

/**
 * Validates game access and updates the timestamp if valid
 * Only checks on client side (browser). On server, allows access.
 * @param gameId - The game ID to validate
 * @returns Validation result with access status
 */
export function validateGameAccess(gameId: string): GameAccessValidation {
	// Only check access in browser (localStorage not available on server)
	if (typeof window === 'undefined') {
		return { isValid: true, shouldRedirect: false };
	}

	const accessCheck = checkGameAccess(gameId);

	if (accessCheck.isValid) {
		// Set or reset timer on valid access (first access or still within time limit)
		setGameAccess(gameId);
		return { isValid: true, shouldRedirect: false };
	}

	// Access expired - redirect
	return { isValid: false, shouldRedirect: true };
}

/**
 * Handles expired access by redirecting to overview page
 * This function never returns (throws redirect)
 * @throws {Redirect} Always throws a redirect to /overview
 */
export function handleExpiredAccess(): never {
	throw redirect(302, '/overview');
}

