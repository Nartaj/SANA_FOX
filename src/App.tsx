/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Trophy, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationProvider, useNavigation, TabName, Route } from './navigation/NavigationState';
import { LessonsHome, ModuleDetails, LessonView } from './screens/LessonsScreens';
import { ChallengesHome, DailyChallengeSwipe, Leaderboard, CyberArena } from './screens/ChallengesScreens';
import { CheckHome, CheckRun, CheckResults } from './screens/CheckScreens';
import { ProfileHome } from './screens/ProfileScreens';
import { Achievements } from './screens/AchievementsScreens';


const ORANGE_ACCENT = '#FF6A00';

function TabContent({ tabName, isActive }: { tabName: TabName, isActive: boolean }) {
  const { state } = useNavigation();
  const stack = state.tabs[tabName].stack;
  const currentRoute = stack[stack.length - 1];

  const renderRoute = (route: Route) => {
    switch (route.name) {
      // Lessons
      case 'LessonsHome': return <LessonsHome />;
      case 'ModuleDetails': return <ModuleDetails params={route.params} />;
      case 'LessonView': return <LessonView params={route.params} />;

      // Challenges
      case 'ChallengesHome': return <ChallengesHome />;
      case 'DailyChallengeSwipe': return <DailyChallengeSwipe />;
      case 'Leaderboard': return <Leaderboard />;
      case 'CyberArena': return <CyberArena />;

      // Check
      case 'CheckHome': return <CheckHome />;
      case 'CheckRun': return <CheckRun />;
      case 'CheckResults': return <CheckResults />;

      // Profile
      case 'ProfileHome': return <ProfileHome />;
      case 'Achievements': return <Achievements />;

      default: return <div>Route not found: {route.name}</div>;
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col relative overflow-y-auto pb-32 ${isActive ? 'flex' : 'hidden'}`}
      style={{ display: isActive ? 'flex' : 'none' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoute.name + JSON.stringify(currentRoute.params)}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {renderRoute(currentRoute)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AppContent() {
  const { state, switchTab } = useNavigation();

  return (
    <div className="min-h-screen text-white font-sans flex flex-col relative overflow-hidden">
      {/* Background Image (Global) */}


      <div className="flex-1 flex flex-col relative z-10">
        <TabContent tabName="lessons" isActive={state.activeTab === 'lessons'} />
        <TabContent tabName="challenges" isActive={state.activeTab === 'challenges'} />
        <TabContent tabName="check" isActive={state.activeTab === 'check'} />
        <TabContent tabName="profile" isActive={state.activeTab === 'profile'} />
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-full py-2 px-2 flex items-center justify-around shadow-2xl z-50">
        <NavButton
          active={state.activeTab === 'lessons'}
          onClick={() => switchTab('lessons')}
          icon={<BookOpen size={20} />}
          label="Lessons"
        />
        <NavButton
          active={state.activeTab === 'challenges'}
          onClick={() => switchTab('challenges')}
          icon={<Trophy size={20} />}
          label="Challenges"
        />
        <NavButton
          active={state.activeTab === 'check'}
          onClick={() => switchTab('check')}
          icon={<ShieldCheck size={20} />}
          label="Check"
        />
        <NavButton
          active={state.activeTab === 'profile'}
          onClick={() => switchTab('profile')}
          icon={<User size={20} />}
          label="Profile"
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 ${active
        ? `bg-[${ORANGE_ACCENT}] text-white shadow-lg shadow-[#FF6A00]/20`
        : 'text-[#141414]/40 hover:text-[#141414]'
        }`}
      style={active ? { backgroundColor: ORANGE_ACCENT } : {}}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
