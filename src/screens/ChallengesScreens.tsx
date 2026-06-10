import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '../navigation/NavigationState';
import { Trophy, ArrowLeft, Flame, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyChallengeService } from '../services/DailyChallengeService';
import { StreakService } from '../services/StreakService';
import { TimeService } from '../services/TimeService';
import { repository } from '../data/repository';
import { SEED_CHALLENGE_CARDS } from '../data/seedData';
import { DailyChallengeRun, DailyChallengeCard } from '../types/models';

export const ChallengesHome: React.FC = () => {
  const { push } = useNavigation();

  return (
    <div className="flex flex-col p-6 gap-6">
      <header className="mt-8">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <p className="text-white/60">Test your cybersecurity skills.</p>
      </header>

      <div className="flex flex-col gap-4">
        <button onClick={() => push('DailyChallengeSwipe')}
          className="bg-[#FF6A00] p-8 rounded-3xl flex flex-col gap-2 items-start text-left shadow-lg shadow-[#FF6A00]/20"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
            <Flame size={24} />
          </div>
          <h3 className="font-bold text-2xl">Daily Challenge</h3>
          <p className="text-white/80 text-sm">Swipe to learn and earn XP.</p>
        </button>

        <button
          onClick={() => push('CyberArena')}
          className="bg-indigo-600/20 border border-indigo-500/30 p-8 rounded-3xl flex flex-col gap-2 items-start text-left shadow-lg"
        >
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
            <Trophy size={24} />
          </div>
          <h3 className="font-bold text-2xl">Cyber Arena</h3>
          <p className="text-white/80 text-sm">Карточная битва: Атака vs Защита</p>
        </button>
        {/* -------------------------- */}


        <button
          onClick={() => push('Leaderboard')}
          className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF6A00]/20 rounded-2xl flex items-center justify-center text-[#FF6A00]">
              <Trophy size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Leaderboard</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest">Top 10 Rankings</p>
            </div>
          </div>
          <ChevronRight className="text-white/20" />
        </button>
      </div>
    </div>
  );
};

export const CyberArena: React.FC = () => {
  const { pop } = useNavigation();

  // 1. Все стейты (HP, Score и т.д.)
  const [hp, setHp] = useState(100);
  const [score, setScore] = useState(0);
  const [currentAttackIndex, setCurrentAttackIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | null }>({
    msg: "Выберите карту защиты!",
    type: null
  });

  // 2. Данные атак и защиты
  const ATTACKS = [
    { id: 'phishing', title: 'Phishing Link', desc: 'Вам пришло письмо от "банка" с просьбой сменить пароль.', damage: 20 },
    { id: 'brute', title: 'Brute Force', desc: 'Хакер пытается подобрать пароль к вашей админ-панели.', damage: 30 },
    { id: 'sql', title: 'SQL Injection', desc: 'Злоумышленник вводит команды в поле логина.', damage: 40 },
  ];

  const DEFENSES = [
    { id: 'mfa', title: '2FA Auth', beats: 'phishing', icon: '🔑' },
    { id: 'pass', title: 'Strong Password', beats: 'brute', icon: '🛡️' },
    { id: 'sanitizer', title: 'Data Sanitizer', beats: 'sql', icon: '🧼' },
  ];

  const currentAttack = ATTACKS[currentAttackIndex];




  return (
    <div className="flex flex-col p-6 h-full bg-[#0A0A0A]">
      <button onClick={pop} className="mt-8 flex items-center gap-2 text-indigo-400 font-bold">
        <ArrowLeft size={20} /> Назад
      </button>

      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold text-white">Битва за данные</h1>
        <p className="text-white/40">Отразите атаку хакера!</p>
      </div>

      {/* Сюда мы потом вставим механику карт */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-indigo-500 animate-pulse">Здесь будет визуализация боя...</div>
      </div>
    </div>
  );
};

export const DailyChallengeSwipe: React.FC = () => {
  const { pop } = useNavigation();
  const [run, setRun] = useState<DailyChallengeRun | null>(null);
  const [lockStatus, setLockStatus] = useState<{ isLocked: boolean; remainingMs: number; formattedTime: string } | null>(null);
  const [feedback, setFeedback] = useState<'safe' | 'unsafe' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [user, setUser] = useState(repository.getUser());

  // Load or create run on mount
  useEffect(() => {
    const initialize = () => {
      let currentUser = user;
      if (!currentUser) {
        const newUser = {
          id: 'user_1',
          displayName: 'SANA Learner',
          createdAt: Date.now(),
          xp: 0,
          level: 1
        };
        repository.upsertUser(newUser);
        setUser(newUser);
        currentUser = newUser;
      }

      const result = DailyChallengeService.getOrCreateDailyRun(currentUser.id);
      if ('isLocked' in result) {
        setLockStatus(result);
        setRun(null);
      } else {
        setRun(result);
        setLockStatus(null);
      }
    };

    initialize();
  }, []);

  // Countdown timer for locked state
  useEffect(() => {
    if (!lockStatus?.isLocked) return;

    const timer = setInterval(() => {
      if (!user) return;
      const status = StreakService.getLockStatus(user.id);
      if (!status.isLocked) {
        // Unlock!
        const result = DailyChallengeService.getOrCreateDailyRun(user.id);
        if (!('isLocked' in result)) {
          setRun(result);
          setLockStatus(null);
        }
        clearInterval(timer);
      } else {
        setLockStatus(status);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockStatus?.isLocked, user]);

  const currentCardIndex = run?.answers.length || 0;
  const isCompleted = run?.completedAt !== null;

  const currentCard = useMemo(() => {
    if (!run || currentCardIndex >= run.cardIds.length) return null;
    const cardId = run.cardIds[currentCardIndex];
    return SEED_CHALLENGE_CARDS.find(c => c.id === cardId) || null;
  }, [run, currentCardIndex]);

  const handleSwipe = (userAnswer: boolean) => {
    if (!run || !currentCard || showExplanation) return;

    setFeedback(userAnswer ? 'safe' : 'unsafe');
    setShowExplanation(true);

    // Update run state
    setTimeout(() => {
      const updatedRun = DailyChallengeService.submitAnswer(run.userId, run, currentCard.id, userAnswer);
      setRun(updatedRun);
      setFeedback(null);
      setShowExplanation(false);
      // Refresh user data if completed
      if (updatedRun.completedAt) {
        setUser(repository.getUser());
      }
    }, 2000);
  };

  if (lockStatus?.isLocked) {
    return (
      <div className="flex flex-col p-6 gap-6 items-center justify-center h-full text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-6 border border-white/10">
          <Flame size={48} />
        </div>

        <h1 className="text-3xl font-bold mb-2">Challenge Locked</h1>
        <p className="text-white/60 mb-10 max-w-[250px]">You've already completed a challenge recently. Come back in:</p>

        <div className="bg-white/5 px-8 py-6 rounded-3xl border border-white/5 mb-10">
          <p className="text-4xl font-mono font-bold tracking-wider text-[#FF6A00]">
            {lockStatus.formattedTime}
          </p>
        </div>

        <button
          onClick={pop}
          className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!run) return <div className="p-6 text-center mt-20">Loading challenge...</div>;

  if (isCompleted) {
    return (
      <div className="flex flex-col p-6 gap-6 items-center justify-center h-full text-center">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6">
          <CheckCircle2 size={48} />
        </div>

        <h1 className="text-4xl font-bold mb-2">Challenge Complete!</h1>
        <p className="text-white/60 mb-10">You've finished today's cybersecurity training.</p>

        <div className="grid grid-cols-2 gap-4 w-full mb-10">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Correct</p>
            <p className="text-2xl font-bold">{run.correctCount} / {run.totalCount}</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">XP Earned</p>
            <p className="text-2xl font-bold">+{run.xpEarned}</p>
          </div>
        </div>

        <button
          onClick={pop}
          className="w-full bg-[#FF6A00] py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#FF6A00]/20"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 gap-6 h-full overflow-hidden">
      <button onClick={pop} className="mt-8 flex items-center gap-2 text-[#FF6A00] font-bold">
        <ArrowLeft size={20} />
        Back
      </button>

      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Daily Challenge</h1>
          <p className="text-white/60 text-sm">Question {currentCardIndex + 1} of {run.totalCount}</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <Flame size={16} className="text-[#FF6A00]" />
          <span className="text-sm font-bold">{repository.getStreak(run.userId)?.currentStreak || 0}</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center relative perspective-1000">
        <AnimatePresence mode="wait">
          {!showExplanation ? (
            <motion.div
              key={currentCard?.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) handleSwipe(true);
                else if (info.offset.x < -100) handleSwipe(false);
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={(custom) => ({
                x: custom === 'safe' ? 500 : -500,
                opacity: 0,
                rotate: custom === 'safe' ? 20 : -20,
                transition: { duration: 0.4 }
              })}
              whileDrag={{ scale: 1.05, rotate: 5 }}
              className="w-full max-w-sm aspect-[3/4] bg-[#1A1A1A] rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-2xl border border-white/5 relative cursor-grab active:cursor-grabbing"
            >
              <div className="w-16 h-16 bg-[#FF6A00]/20 rounded-full flex items-center justify-center text-[#FF6A00] mb-8">
                <Flame size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4">{currentCard?.prompt}</h2>
              <div className="mt-auto">
                <p className="text-white/30 uppercase tracking-widest text-[10px] font-bold">Swipe right if safe</p>
                <p className="text-white/30 uppercase tracking-widest text-[10px] font-bold mt-2">Swipe left if unsafe</p>
              </div>

              {/* Feedback Overlays */}
              <motion.div
                animate={{ opacity: feedback === 'safe' ? 1 : 0 }}
                className="absolute inset-0 bg-green-500/20 rounded-[40px] flex items-center justify-center pointer-events-none opacity-0"
              >
                <div className="bg-green-500 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest">SAFE</div>
              </motion.div>
              <motion.div
                animate={{ opacity: feedback === 'unsafe' ? 1 : 0 }}
                className="absolute inset-0 bg-red-500/20 rounded-[40px] flex items-center justify-center pointer-events-none opacity-0"
              >
                <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest">UNSAFE</div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm aspect-[3/4] bg-[#1A1A1A] rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-2xl border border-white/5"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${(feedback === 'safe' && currentCard?.correctAnswer) || (feedback === 'unsafe' && !currentCard?.correctAnswer)
                ? 'bg-green-500/20 text-green-500'
                : 'bg-red-500/20 text-red-500'
                }`}>
                {(feedback === 'safe' && currentCard?.correctAnswer) || (feedback === 'unsafe' && !currentCard?.correctAnswer)
                  ? <CheckCircle2 size={32} />
                  : <XCircle size={32} />
                }
              </div>

              <h3 className="text-xl font-bold mb-4">
                {(feedback === 'safe' && currentCard?.correctAnswer) || (feedback === 'unsafe' && !currentCard?.correctAnswer)
                  ? "Correct!"
                  : "Incorrect"
                }
              </h3>

              <p className="text-white/60 text-sm leading-relaxed">
                {currentCard?.explanation}
              </p>

              <div className="mt-8 text-[#FF6A00] font-bold">
                {(feedback === 'safe' && currentCard?.correctAnswer) || (feedback === 'unsafe' && !currentCard?.correctAnswer) ? '+10 XP' : '+0 XP'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Progress</span>
          <span className="text-[10px] font-bold text-[#FF6A00]">{Math.round((currentCardIndex / run.totalCount) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF6A00] transition-all duration-500"
            style={{ width: `${(currentCardIndex / run.totalCount) * 100}%` }}
          />
        </div>
      </footer>
    </div>
  );
};

export const Leaderboard: React.FC = () => {
  const { pop } = useNavigation();

  return (
    <div className="flex flex-col p-6 gap-6">
      <button onClick={pop} className="mt-8 flex items-center gap-2 text-[#FF6A00] font-bold">
        <ArrowLeft size={20} />
        Back
      </button>

      <header>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-white/60">Weekly XP Rankings</p>
      </header>

      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((rank) => (
          <div
            key={rank}
            className={`flex items-center gap-4 p-4 rounded-2xl border ${rank === 4 ? 'bg-[#FF6A00]/10 border-[#FF6A00]/30' : 'bg-white/5 border-white/5'
              }`}
          >
            <span className="w-6 text-center font-bold text-white/20">{rank}</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">👤</div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">User {rank}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-tighter">Level {6 - rank}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-sm">{5000 - rank * 500}</span>
              <p className="text-[8px] text-white/20 uppercase font-black">XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
