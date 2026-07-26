import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import type { HistoryData } from '../types';

export const STORAGE_KEYS = {
  APP_DATA: "appData",
  XP: "xp",
  HABITS: "habits",
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

  isAppLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [xp, setXp] = usePersistentState<number>(STORAGE_KEYS.XP, 0);
  const [historyData, setHistoryData] = usePersistentState<HistoryData>(STORAGE_KEYS.HISTORY_DATA, {});

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider value={{
      xp, setXp,
      historyData, setHistoryData,
      isSidebarOpen, setSidebarOpen,
      activeSection, setActiveSection,
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
