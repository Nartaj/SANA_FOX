import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type TabName = 'lessons' | 'challenges' | 'check' | 'profile';

export interface Route {
  name: string;
  params?: Record<string, any>;
}

interface TabStack {
  stack: Route[];
}

interface NavigationState {
  activeTab: TabName;
  tabs: Record<TabName, TabStack>;
}

interface NavigationContextType {
  state: NavigationState;
  navigate: (tab: TabName, routeName: string, params?: Record<string, any>) => void;
  push: (routeName: string, params?: Record<string, any>) => void;
  pop: () => void;
  switchTab: (tab: TabName) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const INITIAL_STATE: NavigationState = {
  activeTab: 'lessons',
  tabs: {
    lessons: { stack: [{ name: 'LessonsHome' }] },
    challenges: { stack: [{ name: 'ChallengesHome' }] },
    check: { stack: [{ name: 'CheckHome' }] },
    profile: { stack: [{ name: 'ProfileHome' }] },
  },
};

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NavigationState>(INITIAL_STATE);

  const switchTab = useCallback((tab: TabName) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const push = useCallback((routeName: string, params?: Record<string, any>) => {
    setState((prev) => {
      const currentTab = prev.activeTab;
      const currentStack = prev.tabs[currentTab].stack;
      
      return {
        ...prev,
        tabs: {
          ...prev.tabs,
          [currentTab]: {
            stack: [...currentStack, { name: routeName, params }],
          },
        },
      };
    });
  }, []);

  const pop = useCallback(() => {
    setState((prev) => {
      const currentTab = prev.activeTab;
      const currentStack = prev.tabs[currentTab].stack;
      
      if (currentStack.length <= 1) return prev;
      
      return {
        ...prev,
        tabs: {
          ...prev.tabs,
          [currentTab]: {
            stack: currentStack.slice(0, -1),
          },
        },
      };
    });
  }, []);

  const navigate = useCallback((tab: TabName, routeName: string, params?: Record<string, any>) => {
    setState((prev) => ({
      ...prev,
      activeTab: tab,
      tabs: {
        ...prev.tabs,
        [tab]: {
          stack: [...prev.tabs[tab].stack, { name: routeName, params }],
        },
      },
    }));
  }, []);

  return (
    <NavigationContext.Provider value={{ state, navigate, push, pop, switchTab }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
