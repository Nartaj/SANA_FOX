import React from 'react';
import { useNavigation } from '../navigation/NavigationState';
import { User, Trophy, ArrowLeft, Settings, Share2, ChevronRight } from 'lucide-react';
import { repository } from '../data/repository';
import { SEED_ACHIEVEMENTS } from '../data/seedData';

export const ProfileHome: React.FC = () => {
  const { push } = useNavigation();
  const user = repository.getUser() || { displayName: 'SANA Learner', xp: 0, level: 1, id: 'user_1' };
  const streak = repository.getStreak(user.id);
  const userAchievements = repository.getUserAchievements(user.id);
  
  const unlockedAchievements = userAchievements
    .filter(ua => ua.unlockedAt)
    .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0));
    
  const recentTrophies = unlockedAchievements.slice(0, 3).map(ua => 
    SEED_ACHIEVEMENTS.find(a => a.id === ua.achievementId)
  );

  return (
    <div className="flex flex-col p-6 gap-6">
      <header className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl border border-white/10">🦊</div>
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-[#FF6A00] text-[10px] uppercase tracking-widest font-black">Level {user.level} Security Pro</p>
          </div>
        </div>
        <button className="p-3 bg-white/5 rounded-full border border-white/10">
          <Settings size={20} className="text-white/60" />
        </button>
      </header>
      
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Progress Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold tracking-tighter">{user.xp.toLocaleString()}</span>
            <span className="text-[10px] text-white/40 uppercase font-bold">Total XP</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold tracking-tighter">{streak?.currentStreak || 0} Days</span>
            <span className="text-[10px] text-white/40 uppercase font-bold">Streak</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF6A00]/20 rounded-2xl flex items-center justify-center text-[#FF6A00]">
                <Trophy size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Trophies</h3>
                <p className="text-xs text-white/40 uppercase tracking-widest">{unlockedAchievements.length} / {SEED_ACHIEVEMENTS.length} Unlocked</p>
              </div>
            </div>
            <button 
              onClick={() => push('Achievements')}
              className="text-[#FF6A00] text-xs font-bold uppercase tracking-widest flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {unlockedAchievements.length > 0 ? (
            <div className="flex gap-3">
              {recentTrophies.map((trophy, idx) => (
                <div key={idx} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/5">
                  🏆
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/20 text-[10px] uppercase font-bold text-center py-2">No trophies earned yet</p>
          )}
        </div>

      
      </div>
    </div>
  );
};
