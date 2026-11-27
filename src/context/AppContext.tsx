import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import type { HistoryData } from '../types';

export const STORAGE_KEYS = {
  APP_DATA: "appData",
  XP: "xp",
  HABITS: "habits",
  HABIT_CATEGORIES: "habitCategories",
  HABIT_HISTORY: "habitHistory",
  STREAK_DATA: "streakData",
  HISTORY_DATA: "historyData",
  NOTES: "notes",
  SETTINGS: "settings"
};

interface AppContextType {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  historyData: HistoryData;
  setHistoryData: React.Dispatch<React.SetStateAction<HistoryData>>;
  
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;

  activeSection: string;
  setActiveSection: (section: string) => void;

  isAiChatOpen: boolean;
  setAiChatOpen: (isOpen: boolean) => void;

  isUnifiedSearchOpen: boolean;
  setUnifiedSearchOpen: (isOpen: boolean) => void;

  isAppLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const APP_SECTIONS = ['home', 'tasks', 'habits', 'focus', 'calendar', 'categories', 'stats', 'notes', 'settings'];

const getSectionFromLocation = () => {
  const hashSection = window.location.hash.replace('#', '');
  return APP_SECTIONS.includes(hashSection) ? hashSection : 'home';
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [xp, setXp] = usePersistentState<number>(STORAGE_KEYS.XP, 0);
  const [historyData, setHistoryData] = usePersistentState<HistoryData>(STORAGE_KEYS.HISTORY_DATA, {});

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSectionState] = useState(getSectionFromLocation);

  // Section changes must create a browser history entry so Android/browser back
  // returns to the previous page instead of closing the app (PWA standalone).
  const setActiveSection = React.useCallback((section: string) => {
    setActiveSectionState(section);
    if (window.location.hash !== `#${section}`) {
      window.history.pushState({ section }, '', `#${section}`);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const section = event.state?.section;
      setActiveSectionState(
        typeof section === 'string' && APP_SECTIONS.includes(section)
          ? section
          : getSectionFromLocation()
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [isAiChatOpen, setAiChatOpen] = useState(false);
  const [isUnifiedSearchOpen, setUnifiedSearchOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setUnifiedSearchOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setAiChatOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider value={{
      xp, setXp,
      historyData, setHistoryData,
      isSidebarOpen, setSidebarOpen,
      activeSection, setActiveSection,
      isAiChatOpen, setAiChatOpen,
      isUnifiedSearchOpen, setUnifiedSearchOpen,
      isAppLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
