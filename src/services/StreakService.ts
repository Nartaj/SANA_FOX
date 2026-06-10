import { repository } from '../data/repository';
import { StreakData, AchievementCriteria } from '../types/models';
import { TimeService } from './TimeService';
import { AchievementService } from './AchievementService';

/**
 * Service to handle user streaks and 24-hour lock logic
 */
export const StreakService = {
  /**
   * Gets the current streak data for a user
   */
  getStreak: (userId: string): StreakData => {
    let streak = repository.getStreak(userId);

    if (!streak) {
      streak = {
        userId,
        currentStreak: 0,
        lastCompletedDateKey: null,
        nextAvailableAt: 0,
        updatedAt: Date.now(),
      };
      repository.updateStreak(userId, streak);
    }

    // Check if streak is broken (last completed was before yesterday)
    if (streak.lastCompletedDateKey && TimeService.isOlderThanYesterday(streak.lastCompletedDateKey)) {
      streak.currentStreak = 0;
      streak.updatedAt = Date.now();
      repository.updateStreak(userId, streak);
    }

    return streak;
  },

  /**
   * Checks if the daily challenge is currently locked for a user
   */
  getLockStatus: (userId: string): { isLocked: boolean; remainingMs: number; formattedTime: string } => {
    const streak = StreakService.getStreak(userId);
    const now = Date.now();
    const isLocked = now < streak.nextAvailableAt;
    const remainingMs = Math.max(0, streak.nextAvailableAt - now);

    return {
      isLocked,
      remainingMs,
      formattedTime: TimeService.formatCountdown(remainingMs),
    };
  },

  /**
   * Updates the streak when a daily challenge is completed
   */
  completeDailyChallenge: (userId: string): StreakData => {
    const streak = StreakService.getStreak(userId);
    const today = TimeService.getDateKey();
    const yesterday = TimeService.getYesterdayDateKey();

    // If already completed today, don't update streak again
    if (streak.lastCompletedDateKey === today) {
      return streak;
    }

    if (streak.lastCompletedDateKey === yesterday) {
      streak.currentStreak += 1;
    } else {
      // Streak broken or first time
      streak.currentStreak = 1;
    }

    streak.lastCompletedDateKey = today;
    streak.updatedAt = Date.now();
    streak.nextAvailableAt = Date.now() + 24 * 60 * 60 * 1000; // 24-hour lock

    repository.updateStreak(userId, streak);

    // Track Streak achievement
    AchievementService.updateProgress(userId, AchievementCriteria.STREAK, streak.currentStreak);

    return streak;
  }
};
