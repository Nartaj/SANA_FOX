import { repository } from '../data/repository';
import { SEED_CHALLENGE_CARDS } from '../data/seedData';
import { DailyChallengeRun, ChallengeAnswer, User, StreakData, AchievementCriteria } from '../types/models';
import { TimeService } from './TimeService';
import { StreakService } from './StreakService';
import { AchievementService } from './AchievementService';

/**
 * Service to handle Daily Challenge logic
 */
export const DailyChallengeService = {
  /**
   * Loads or creates a daily challenge run for the user
   */
  getOrCreateDailyRun: (userId: string): DailyChallengeRun | { isLocked: boolean; remainingMs: number; formattedTime: string } => {
    const dateKey = TimeService.getDateKey();
    const lockStatus = StreakService.getLockStatus(userId);
    
    // Check if there's a run for today already
    let run = repository.getDailyRun(userId, dateKey);

    // If today's run exists, return it (even if completed, as it's the current run)
    if (run) {
      return run;
    }

    // If no run for today, check if locked (24h since last completion)
    if (lockStatus.isLocked) {
      return lockStatus;
    }

    // Generate new daily run
    const shuffled = [...SEED_CHALLENGE_CARDS].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 10);

    run = {
      id: `run_${userId}_${dateKey}`,
      userId,
      dateKey,
      cardIds: selectedCards.map(c => c.id),
      answers: [],
      correctCount: 0,
      totalCount: selectedCards.length,
      xpEarned: 0,
      completedAt: null,
    };

    repository.saveDailyRun(userId, run);
    return run;
  },

  /**
   * Submits an answer for a card in the current run
   */
  submitAnswer: (userId: string, run: DailyChallengeRun, cardId: string, userAnswer: boolean): DailyChallengeRun => {
    const card = SEED_CHALLENGE_CARDS.find(c => c.id === cardId);
    if (!card) return run;

    const isCorrect = card.correctAnswer === userAnswer;
    
    // Check if already answered (prevent duplicates)
    const existingAnswerIndex = run.answers.findIndex(a => a.cardId === cardId);
    if (existingAnswerIndex > -1) return run;

    const answer: ChallengeAnswer = {
      cardId,
      userAnswer,
      isCorrect,
    };

    const updatedRun: DailyChallengeRun = {
      ...run,
      answers: [...run.answers, answer],
      correctCount: isCorrect ? run.correctCount + 1 : run.correctCount,
    };

    // If this was the last card, calculate XP and complete the run
    if (updatedRun.answers.length === updatedRun.totalCount) {
      return DailyChallengeService.completeRun(userId, updatedRun);
    }

    repository.saveDailyRun(userId, updatedRun);
    return updatedRun;
  },

  /**
   * Completes the run, calculates XP, and updates user stats
   */
  completeRun: (userId: string, run: DailyChallengeRun): DailyChallengeRun => {
    const baseXPPerCorrect = 10;
    const bonusXPForPerfect = 20;
    
    let xpEarned = run.correctCount * baseXPPerCorrect;
    if (run.correctCount === run.totalCount) {
      xpEarned += bonusXPForPerfect;
    }

    const completedRun: DailyChallengeRun = {
      ...run,
      xpEarned,
      completedAt: Date.now(),
    };

    // Update User XP
    const user = repository.getUser();
    if (user && user.id === userId) {
      const updatedUser: User = {
        ...user,
        xp: user.xp + xpEarned,
        // Simple level up logic: every 500 XP is a level
        level: Math.floor((user.xp + xpEarned) / 500) + 1,
      };
      repository.upsertUser(updatedUser);
      
      // Track XP achievement
      AchievementService.updateProgress(userId, AchievementCriteria.XP, updatedUser.xp);
    }

    // Track Accuracy achievement
    AchievementService.updateProgress(userId, AchievementCriteria.ACCURACY, run.correctCount);

    // Update Streak and enforce 24h lock
    StreakService.completeDailyChallenge(userId);

    repository.saveDailyRun(userId, completedRun);
    return completedRun;
  }
};
