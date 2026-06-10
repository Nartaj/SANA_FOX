import { 
  User, 
  LessonProgress, 
  DailyChallengeRun, 
  CheckResult, 
  StreakData, 
  Achievement, 
  UserAchievement 
} from '../types/models';
import { SEED_ACHIEVEMENTS } from './seedData';

const STORAGE_KEYS = {
  USER: 'sana_user',
  LESSON_PROGRESS: 'sana_lesson_progress',
  DAILY_RUNS: 'sana_daily_runs',
  CHECK_RESULTS: 'sana_check_results',
  STREAK: 'sana_streak',
  USER_ACHIEVEMENTS: 'sana_user_achievements',
};

/**
 * Repository for SANA Cybersecurity Learning App
 * Uses localStorage for persistence.
 */
export const repository = {
  // --- User ---
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  upsertUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // --- Lesson Progress ---
  getLessonProgress: (userId: string): LessonProgress[] => {
    const data = localStorage.getItem(`${STORAGE_KEYS.LESSON_PROGRESS}_${userId}`);
    return data ? JSON.parse(data) : [];
  },

  updateLessonProgress: (userId: string, progress: LessonProgress): void => {
    const allProgress = repository.getLessonProgress(userId);
    const index = allProgress.findIndex(p => p.moduleId === progress.moduleId);
    
    if (index > -1) {
      allProgress[index] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(`${STORAGE_KEYS.LESSON_PROGRESS}_${userId}`, JSON.stringify(allProgress));
  },

  // --- Daily Challenge Runs ---
  getDailyRun: (userId: string, dateKey: string): DailyChallengeRun | null => {
    const data = localStorage.getItem(`${STORAGE_KEYS.DAILY_RUNS}_${userId}_${dateKey}`);
    return data ? JSON.parse(data) : null;
  },

  saveDailyRun: (userId: string, run: DailyChallengeRun): void => {
    localStorage.setItem(`${STORAGE_KEYS.DAILY_RUNS}_${userId}_${run.dateKey}`, JSON.stringify(run));
  },

  // --- Check Results ---
  getCheckResults: (userId: string): CheckResult[] => {
    const data = localStorage.getItem(`${STORAGE_KEYS.CHECK_RESULTS}_${userId}`);
    return data ? JSON.parse(data) : [];
  },

  saveCheckResult: (userId: string, result: CheckResult): void => {
    const allResults = repository.getCheckResults(userId);
    allResults.push(result);
    localStorage.setItem(`${STORAGE_KEYS.CHECK_RESULTS}_${userId}`, JSON.stringify(allResults));
  },

  // --- Streak ---
  getStreak: (userId: string): StreakData | null => {
    const data = localStorage.getItem(`${STORAGE_KEYS.STREAK}_${userId}`);
    return data ? JSON.parse(data) : null;
  },

  updateStreak: (userId: string, streak: StreakData): void => {
    localStorage.setItem(`${STORAGE_KEYS.STREAK}_${userId}`, JSON.stringify(streak));
  },

  // --- Achievements ---
  listAchievements: (): Achievement[] => {
    return SEED_ACHIEVEMENTS;
  },

  getUserAchievements: (userId: string): UserAchievement[] => {
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_ACHIEVEMENTS}_${userId}`);
    return data ? JSON.parse(data) : [];
  },

  updateUserAchievement: (userId: string, achievement: UserAchievement): void => {
    const allAchievements = repository.getUserAchievements(userId);
    const index = allAchievements.findIndex(a => a.achievementId === achievement.achievementId);
    
    if (index > -1) {
      allAchievements[index] = achievement;
    } else {
      allAchievements.push(achievement);
    }
    
    localStorage.setItem(`${STORAGE_KEYS.USER_ACHIEVEMENTS}_${userId}`, JSON.stringify(allAchievements));
  }
};
