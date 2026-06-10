import React, { useState, useMemo } from 'react';
import { useNavigation } from '../navigation/NavigationState';
import { Trophy, ArrowLeft, CheckCircle2, Lock, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { repository } from '../data/repository';
import { Achievement, UserAchievement } from '../types/models';
import { SEED_ACHIEVEMENTS } from '../data/seedData';

type FilterType = 'All' | 'Unlocked' | 'Locked';

export const Achievements: React.FC = () => {
  const { pop } = useNavigation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const user = repository.getUser();
  const userAchievements = repository.getUserAchievements(user?.id || 'user_1');

  const categories = ['All', 'Streak', 'Accuracy', 'Lessons', 'XP', 'Safety Skills'];

  const filteredAchievements = useMemo(() => {
    return SEED_ACHIEVEMENTS.filter(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      const isUnlocked = !!userAchievement?.unlockedAt;

      const matchesFilter = 
        activeFilter === 'All' || 
        (activeFilter === 'Unlocked' && isUnlocked) || 
        (activeFilter === 'Locked' && !isUnlocked);

      const matchesCategory = 
        activeCategory === 'All' || 
        achievement.category === activeCategory;

      return matchesFilter && matchesCategory;
    });
  }, [activeFilter, activeCategory, userAchievements]);

  const unlockedCount = userAchievements.filter(ua => ua.unlockedAt).length;
  const totalCount = SEED_ACHIEVEMENTS.length;

  const isNew = (unlockedAt: number | null) => {
    if (!unlockedAt) return false;
    const today = new Date().setHours(0, 0, 0, 0);
    const unlockDate = new Date(unlockedAt).setHours(0, 0, 0, 0);
    return today === unlockDate;
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="p-6 pt-12">
        <button onClick={pop} className="mb-6 flex items-center gap-2 text-[#FF6A00] font-bold">
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-3xl font-bold">Trophies</h1>
            <p className="text-white/60 text-sm">Earn rewards by learning cyber safety</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Unlocked</p>
            <p className="text-xl font-bold text-[#FF6A00]">{unlockedCount} / {totalCount}</p>
          </div>
        </div>
      </div>

      {/* Segmented Filter */}
      <div className="px-6 mb-6">
        <div className="bg-white/5 p-1 rounded-2xl flex border border-white/5">
          {(['All', 'Unlocked', 'Locked'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === filter ? 'bg-white/10 text-white shadow-lg' : 'text-white/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Category Chips */}
      <div className="px-6 mb-6 overflow-x-auto flex gap-2 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
              activeCategory === category 
                ? 'bg-[#FF6A00] border-[#FF6A00] text-white' 
                : 'bg-white/5 border-white/10 text-white/60'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Achievement List */}
      <div className="flex-1 px-6 pb-12 overflow-y-auto space-y-4">
        {filteredAchievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-4">
              <Trophy size={32} />
            </div>
            <p className="text-white/40 text-sm max-w-[200px]">
              {activeFilter === 'Unlocked' 
                ? "No trophies yet. Complete a lesson to earn your first one." 
                : "No achievements found in this category."}
            </p>
          </div>
        ) : (
          filteredAchievements.map((achievement) => {
            const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
            const isUnlocked = !!userAchievement?.unlockedAt;
            const progress = userAchievement?.progressValue || 0;
            const isToday = isNew(userAchievement?.unlockedAt || null);

            return (
              <motion.button
                key={achievement.id}
                layoutId={`achievement-${achievement.id}`}
                onClick={() => setSelectedAchievement(achievement)}
                className={`w-full bg-white/5 border rounded-3xl p-4 flex items-center gap-4 text-left transition-all hover:bg-white/10 ${
                  isToday ? 'border-[#FF6A00]/50 shadow-[0_0_15px_rgba(255,106,0,0.1)]' : 'border-white/5'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  isUnlocked ? 'bg-[#FF6A00]/20 text-[#FF6A00]' : 'bg-white/5 text-white/20'
                }`}>
                  {isUnlocked ? '🏆' : <Lock size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm truncate">{achievement.title}</h3>
                    {isToday && (
                      <span className="bg-[#FF6A00] text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase">New</span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/40 line-clamp-1 mb-2">{achievement.description}</p>
                  
                  {!isUnlocked && (
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF6A00] transition-all duration-500"
                        style={{ width: `${Math.min(100, (progress / achievement.criteriaValue) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  {isUnlocked ? (
                    <>
                      <CheckCircle2 size={16} className="text-[#FF6A00]" />
                      <span className="text-[8px] text-white/20 font-bold">
                        {new Date(userAchievement!.unlockedAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-white/20">
                      {progress}/{achievement.criteriaValue}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })
        )}
      </div>

      {/* Achievement Details Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              layoutId={`achievement-${selectedAchievement.id}`}
              className="w-full max-w-sm bg-[#111] border border-white/10 rounded-[40px] p-8 relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className={`w-32 h-32 rounded-[40px] flex items-center justify-center text-6xl mb-8 ${
                  userAchievements.find(ua => ua.achievementId === selectedAchievement.id)?.unlockedAt 
                    ? 'bg-[#FF6A00]/20 text-[#FF6A00]' 
                    : 'bg-white/5 text-white/10'
                }`}>
                  {userAchievements.find(ua => ua.achievementId === selectedAchievement.id)?.unlockedAt ? '🏆' : <Lock size={48} />}
                </div>

                <h2 className="text-2xl font-bold mb-2">{selectedAchievement.title}</h2>
                <p className="text-white/60 mb-6">{selectedAchievement.description}</p>

                <div className="w-full bg-white/5 rounded-3xl p-6 border border-white/5 mb-8">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">Requirement</p>
                  <p className="text-sm font-medium mb-4">{selectedAchievement.description}</p>
                  
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase">Progress</span>
                    <span className="text-sm font-mono font-bold text-[#FF6A00]">
                      {userAchievements.find(ua => ua.achievementId === selectedAchievement.id)?.progressValue || 0} / {selectedAchievement.criteriaValue}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF6A00]"
                      style={{ width: `${Math.min(100, ((userAchievements.find(ua => ua.achievementId === selectedAchievement.id)?.progressValue || 0) / selectedAchievement.criteriaValue) * 100)}%` }}
                    />
                  </div>
                </div>

                {userAchievements.find(ua => ua.achievementId === selectedAchievement.id)?.unlockedAt && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-green-500 font-bold">
                      Unlocked on {new Date(userAchievements.find(ua => ua.achievementId === selectedAchievement.id)!.unlockedAt!).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      Reward: +50 XP Earned
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
