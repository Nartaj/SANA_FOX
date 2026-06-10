/**
 * Core Data Models for SANA Cybersecurity Learning App
 */

export enum Topic {
  PHISHING = 'phishing',
  MALWARE = 'malware',
  HABITS = 'habits',
  SOCIAL_ENGINEERING = 'socialEngineering',
  RISK_MANAGEMENT = 'riskManagement'
}

export enum AchievementCriteria {
  STREAK = 'streak',
  ACCURACY = 'accuracy',
  LESSONS_COMPLETED = 'lessonsCompleted',
  XP = 'xp'
}

export interface User {
  id: string;
  displayName: string;
  createdAt: number;
  xp: number;
  level: number;
}

export interface LessonModule {
  id: string;
  title: string;
  lessonCount: number;
}

export interface LessonProgress {
  userId: string;
  moduleId: string;
  completedLessonIds: string[];
  completionPercent: number;
  updatedAt: number;
}

export interface DailyChallengeCard {
  id: string;
  topic: Topic;
  prompt: string;
  correctAnswer: boolean; // true = safe/true, false = unsafe/false
  explanation: string;
}

export interface ChallengeAnswer {
  cardId: string;
  userAnswer: boolean;
  isCorrect: boolean;
}

export interface DailyChallengeRun {
  id: string;
  userId: string;
  dateKey: string; // YYYY-MM-DD
  cardIds: string[];
  answers: ChallengeAnswer[];
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  completedAt: number | null;
}

export interface CheckResult {
  id: string;
  userId: string;
  dateKey: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  weakTopics: Topic[];
  recommendedModuleIds: string[];
  completedAt: number;
}

export interface StreakData {
  userId: string;
  currentStreak: number;
  lastCompletedDateKey: string | null;
  nextAvailableAt: number;
  updatedAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  criteriaType: AchievementCriteria;
  criteriaValue: number;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  topic: Topic;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: number | null;
  progressValue: number;
}
