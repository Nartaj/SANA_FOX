import { repository } from '../data/repository';
import { 
  Achievement, 
  UserAchievement, 
  AchievementCriteria, 
  User 
} from '../types/models';
import { SEED_ACHIEVEMENTS } from '../data/seedData';

/**
 * Service to handle achievement tracking and unlocking
 */
export const AchievementService = {
  /**
   * Updates progress for a specific criteria type
   */
  updateProgress: (userId: string, criteriaType: AchievementCriteria, newValue: number): void => {
    const achievements = SEED_ACHIEVEMENTS.filter(a => a.criteriaType === criteriaType);
    const userAchievements = repository.getUserAchievements(userId);

    achievements.forEach(achievement => {
      let userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);

      if (!userAchievement) {
        userAchievement = {
          userId,
          achievementId: achievement.id,
          unlockedAt: null,
          progressValue: 0
        };
      }

      // If already unlocked, skip
      if (userAchievement.unlockedAt) return;

      // Update progress
      // For some criteria, we want the max value (e.g., accuracy, streak, XP)
      // For others, we might want to increment (but here we pass the absolute new value)
      userAchievement.progressValue = Math.max(userAchievement.progressValue, newValue);

      // Check for unlock
      if (userAchievement.progressValue >= achievement.criteriaValue) {
        userAchievement.unlockedAt = Date.now();
        AchievementService.grantReward(userId, achievement);
      }

      repository.updateUserAchievement(userId, userAchievement);
    });
  },

  /**
   * Grants reward for unlocking an achievement
   */
  grantReward: (userId: string, achievement: Achievement): void => {
    const user = repository.getUser();
    if (user && user.id === userId) {
      const rewardXP = 50;
      const updatedUser: User = {
        ...user,
        xp: user.xp + rewardXP,
        level: Math.floor((user.xp + rewardXP) / 500) + 1,
      };
      repository.upsertUser(updatedUser);
      
      // In a real app, we'd trigger a toast here
      console.log(`Achievement Unlocked: ${achievement.title}! +${rewardXP} XP`);
    }
  },

  /**
   * Special case for "No Weak Spots" or specific one-time events
   */
  triggerManualUnlock: (userId: string, achievementId: string): void => {
    const achievement = SEED_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;

    const userAchievements = repository.getUserAchievements(userId);
    let userAchievement = userAchievements.find(ua => ua.achievementId === achievementId);

    if (!userAchievement) {
      userAchievement = {
        userId,
        achievementId,
        unlockedAt: null,
        progressValue: 0
      };
    }

    if (userAchievement.unlockedAt) return;

    userAchievement.progressValue = achievement.criteriaValue;
    userAchievement.unlockedAt = Date.now();
    AchievementService.grantReward(userId, achievement);
    
    repository.updateUserAchievement(userId, userAchievement);
  }
};
