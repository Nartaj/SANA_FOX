import React, { useState, useEffect } from 'react';
import { useNavigation } from '../navigation/NavigationState';
import { ShieldCheck, ArrowLeft, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { repository } from '../data/repository';
import { SEED_QUIZ_QUESTIONS } from '../data/seedData';
import { AchievementService } from '../services/AchievementService';
import { AchievementCriteria, User } from '../types/models';

export const CheckHome: React.FC = () => {
  const { push } = useNavigation();

  return (
    <div className="flex flex-col p-6 gap-6">
      <header className="mt-8">
        <h1 className="text-3xl font-bold">Quick Check</h1>
        <p className="text-white/60">Assess your cybersecurity knowledge.</p>
      </header>
      
      <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 bg-[#FF6A00]/20 rounded-3xl flex items-center justify-center text-[#FF6A00]">
          <ShieldCheck size={40} />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">Ready for a Check?</h3>
          <p className="text-white/40 text-sm">10 quick questions to test your awareness and earn badges.</p>
        </div>
        <button 
          onClick={() => push('CheckRun')}
          className="w-full bg-[#FF6A00] py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#FF6A00]/20"
        >
          Start Quick Assessment
        </button>
      </div>
    </div>
  );
};

export const CheckRun: React.FC = () => {
  const { push, pop } = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [weakTopics, setWeakTopics] = useState<any[]>([]);

  const currentQuestion = SEED_QUIZ_QUESTIONS[currentIndex];

  const handleOptionSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      if (!weakTopics.includes(currentQuestion.topic)) {
        setWeakTopics([...weakTopics, currentQuestion.topic]);
      }
    }

    setShowFeedback(true);

    setTimeout(() => {
      if (currentIndex < SEED_QUIZ_QUESTIONS.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // Complete!
        const finalScore = isCorrect ? score + 1 : score;
        const accuracy = (finalScore / SEED_QUIZ_QUESTIONS.length) * 100;
        const xpEarned = Math.round(accuracy * 2.5);
        
        const user = repository.getUser();
        if (user) {
          // Update User XP
          const updatedUser: User = {
            ...user,
            xp: user.xp + xpEarned,
            level: Math.floor((user.xp + xpEarned) / 500) + 1,
          };
          repository.upsertUser(updatedUser);

          // Trigger Achievements
          AchievementService.updateProgress(user.id, AchievementCriteria.XP, updatedUser.xp);
          AchievementService.updateProgress(user.id, AchievementCriteria.ACCURACY, accuracy);
          
          if (weakTopics.length === 0 && isCorrect && finalScore === SEED_QUIZ_QUESTIONS.length) {
            AchievementService.triggerManualUnlock(user.id, 'a10');
          }
        }

        push('CheckResults', { score: finalScore, total: SEED_QUIZ_QUESTIONS.length, xpEarned });
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col p-6 gap-6 h-full overflow-hidden">
      <button onClick={pop} className="mt-8 flex items-center gap-2 text-[#FF6A00] font-bold">
        <ArrowLeft size={20} />
        Back
      </button>
      
      <header>
        <div className="flex justify-between items-end mb-2">
          <h1 className="text-2xl font-bold">Question {currentIndex + 1}</h1>
          <span className="text-xs font-bold text-[#FF6A00]">{currentIndex + 1}/{SEED_QUIZ_QUESTIONS.length}</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / SEED_QUIZ_QUESTIONS.length) * 100}%` }}
            className="h-full bg-[#FF6A00] rounded-full" 
          />
        </div>
      </header>
      
      <div className="flex-1 flex flex-col gap-4 justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
            
            {currentQuestion.options.map((option, idx) => {
              let bgColor = 'bg-white/5';
              let borderColor = 'border-white/10';
              
              if (selectedOption === idx) {
                if (showFeedback) {
                  const isCorrect = idx === currentQuestion.correctOptionIndex;
                  bgColor = isCorrect ? 'bg-green-500/20' : 'bg-red-500/20';
                  borderColor = isCorrect ? 'border-green-500/50' : 'border-red-500/50';
                } else {
                  bgColor = 'bg-[#FF6A00]/10';
                  borderColor = 'border-[#FF6A00]/50';
                }
              } else if (showFeedback && idx === currentQuestion.correctOptionIndex) {
                bgColor = 'bg-green-500/20';
                borderColor = 'border-green-500/50';
              }

              return (
                <button 
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-6 rounded-2xl text-left border transition-all flex items-center gap-4 ${bgColor} ${borderColor}`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    selectedOption === idx ? 'bg-[#FF6A00] text-white' : 'bg-white/5 text-white/40'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 font-medium">{option}</span>
                  {showFeedback && idx === currentQuestion.correctOptionIndex && (
                    <CheckCircle2 size={20} className="text-green-500" />
                  )}
                  {showFeedback && selectedOption === idx && idx !== currentQuestion.correctOptionIndex && (
                    <XCircle size={20} className="text-red-500" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <button 
        onClick={handleNext}
        disabled={selectedOption === null || showFeedback}
        className={`w-full py-4 rounded-2xl font-bold text-lg border transition-all ${
          selectedOption !== null && !showFeedback
            ? 'bg-[#FF6A00] border-[#FF6A00] text-white shadow-lg shadow-[#FF6A00]/20'
            : 'bg-white/5 border-white/10 text-white/20'
        }`}
      >
        {currentIndex === SEED_QUIZ_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'}
      </button>
    </div>
  );
};

export const CheckResults: React.FC = ({ params }: { params?: any }) => {
  const { navigate } = useNavigation();
  const score = params?.score || 0;
  const total = params?.total || 5;
  const xpEarned = params?.xpEarned || 0;
  const accuracy = Math.round((score / total) * 100);
  
  return (
    <div className="flex flex-col p-6 gap-6 items-center justify-center h-full text-center">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6"
      >
        <CheckCircle2 size={48} />
      </motion.div>
      
      <h1 className="text-4xl font-bold mb-2">Great Job!</h1>
      <p className="text-white/60 mb-10">You scored {score}/{total} on your assessment.</p>
      
      <div className="grid grid-cols-2 gap-4 w-full mb-10">
        <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Accuracy</p>
          <p className="text-2xl font-bold">{accuracy}%</p>
        </div>
        <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">XP Earned</p>
          <p className="text-2xl font-bold">+{xpEarned}</p>
        </div>
      </div>
      
      <button 
        onClick={() => navigate('profile', 'ProfileHome')}
        className="w-full bg-[#FF6A00] py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#FF6A00]/20"
      >
        View Progress
      </button>
    </div>
  );
};
