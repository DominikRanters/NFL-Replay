import type { Drive } from '../../models/game-summary';

/**
 * Playback controller for managing game replay functionality
 * Handles play-by-play progression, speed control, and pause/resume
 */
export class PlaybackController {
	private originalDrives: Drive[];
	private currentDrives: Drive[] = [];
	private interval: ReturnType<typeof setInterval> | null = null;
	private isPausedState = false;
	private speedMultiplier = 1;
	private onUpdateCallback: (drives: Drive[]) => void;

	constructor(originalDrives: Drive[], onUpdate: (drives: Drive[]) => void) {
		this.originalDrives = originalDrives;
		this.onUpdateCallback = onUpdate;
	}

	/**
	 * Starts the playback
	 */
	start(): void {
		this.isPausedState = false;
		this.startInterval();
	}

	/**
	 * Stops and cleans up the playback
	 */
	stop(): void {
		this.clearCurrentInterval();
	}

	/**
	 * Toggles pause state
	 */
	togglePause(): void {
		this.isPausedState = !this.isPausedState;

		if (this.isPausedState) {
			this.clearCurrentInterval();
		} else {
			this.startInterval();
		}
	}

	/**
	 * Cycles through speed multipliers (1x -> 1.5x -> 2x -> 1x)
	 */
	adjustSpeed(): void {
		if (this.speedMultiplier === 1) {
			this.speedMultiplier = 1.5;
		} else if (this.speedMultiplier === 1.5) {
			this.speedMultiplier = 2;
		} else {
			this.speedMultiplier = 1;
		}

		// Restart interval with new speed if not paused
		if (!this.isPausedState) {
			this.clearCurrentInterval();
			this.startInterval();
		}
	}

	/**
	 * Jumps to the next drive
	 */
	jumpToNextDrive(): void {
		this.clearCurrentInterval();

		if (this.currentDrives.length === 0) {
			return;
		}

		const tempDrives = [...this.currentDrives];
		const currentDriveIndex = tempDrives.length - 1;
		const currentDrive = tempDrives[0];
		const originalDrive = this.originalDrives[currentDriveIndex];

		// Complete current drive by adding all remaining plays
		if (currentDrive.plays.length < originalDrive.plays.length) {
			const remainingPlays = originalDrive.plays.slice(currentDrive.plays.length);
			currentDrive.plays = [...remainingPlays.reverse(), ...currentDrive.plays];
			currentDrive.finished = true;
			tempDrives[0] = currentDrive;
		}

		// Start next drive if available
		if (tempDrives.length < this.originalDrives.length) {
			const nextDriveIndex = tempDrives.length;
			const nextDrive = { ...this.originalDrives[nextDriveIndex] };
			const nextDriveWithOutPlays: Drive = {
				...nextDrive,
				plays: []
			};
			this.currentDrives = [nextDriveWithOutPlays, ...tempDrives];
		} else {
			this.currentDrives = tempDrives;
		}

		this.onUpdateCallback(this.currentDrives);

		// Resume playback if not paused
		if (!this.isPausedState) {
			this.startInterval();
		}
	}

	/**
	 * Gets current pause state
	 */
	isPaused(): boolean {
		return this.isPausedState;
	}

	/**
	 * Gets current speed multiplier
	 */
	getSpeed(): number {
		return this.speedMultiplier;
	}

	/**
	 * Gets current drives state
	 */
	getCurrentDrives(): Drive[] {
		return this.currentDrives;
	}

	/**
	 * Sets the current drives (used for external updates)
	 */
	setCurrentDrives(drives: Drive[]): void {
		this.currentDrives = drives;
	}

	/**
	 * Starts the interval for automatic play progression
	 */
	private startInterval(): void {
		const delay = 2000 / this.speedMultiplier;

		this.interval = setInterval(() => {
			this.progressToNextPlay();
		}, delay);
	}

	/**
	 * Clears the current interval
	 */
	private clearCurrentInterval(): void {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}

	/**
	 * Progresses to the next play or drive
	 */
	private progressToNextPlay(): void {
		if (
			this.currentDrives.length > 0 &&
			this.currentDrives[0].plays.length <
				this.originalDrives[this.currentDrives.length - 1].plays.length
		) {
			// Add next play to current drive
			this.addNextPlayToCurrentDrive();
		} else if (this.currentDrives.length < this.originalDrives.length) {
			// Add next drive
			this.addNextDrive();
		} else {
			// Playback complete
			this.clearCurrentInterval();
		}
	}

	/**
	 * Adds the next play to the current drive
	 */
	private addNextPlayToCurrentDrive(): void {
		const tempDrives = [...this.currentDrives];
		const lastDrive = tempDrives[0];
		const indexThisDrive = tempDrives.length - 1;
		const indexLastPlay = lastDrive.plays.length;

		// Check if this is the last play
		const isLastPlay = indexLastPlay === this.originalDrives[indexThisDrive].plays.length - 1;
		lastDrive.finished = isLastPlay;

		// Add the next play
		const nextPlay = this.originalDrives[indexThisDrive].plays[indexLastPlay];
		lastDrive.plays = [nextPlay, ...lastDrive.plays];

		this.currentDrives = tempDrives;
		this.onUpdateCallback(this.currentDrives);
	}

	/**
	 * Adds the next drive to the drives list
	 */
	private addNextDrive(): void {
		const tempDrives = [...this.currentDrives];
		const indexLastDrive = tempDrives.length - 1;

		// Create next drive without plays
		const nextDrive = { ...this.originalDrives[indexLastDrive + 1] };
		const nextDriveWithOutPlays: Drive = {
			...nextDrive,
			plays: []
		};

		this.currentDrives = [nextDriveWithOutPlays, ...tempDrives];
		this.onUpdateCallback(this.currentDrives);
	}
}
