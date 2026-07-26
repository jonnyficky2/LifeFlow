import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDbData, setDbData } from '../services/db';
import type { ReactNode } from 'react';

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

function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const lsData = localStorage.getItem(key);
      let initialData = defaultValue;

      if (lsData) {
         try {
           initialData = JSON.parse(lsData) as T;
         } catch(e) {}
      }

      const dbData = await getDbData<T | null>(key, null);
      if (dbData !== null) {
        initialData = dbData;
      } else if (lsData) {
        await setDbData(key, initialData);
      }
      
      if (mounted) {
        setState(initialData);
      }
    };
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  
  const setPersistentState: React.Dispatch<React.SetStateAction<T>> = useCallback((value) => {
    setState(prev => {
      const nextValue = typeof value === 'function' ? (value as any)(prev) : value;
      setDbData(key, nextValue).catch(e => console.error("Failed to save", key, e));
      return nextValue;
    });
  }, [key]);

  return [state, setPersistentState];
}

export interface Subtask {
  name: string;
  done: boolean;
}

export interface Task {
  name: string;
  deadline: string;
  time: string;
  location: string;
  note: string;
  priority: string;
  done: boolean;
  completedDates: string[];
  streak: number;
  lastCompleted: string | null;
  subtasks: Subtask[];
  reminder: string;
  tags: string[];
}

export interface Category {
  name: string;
  tasks: Task[];
}

export type HabitRepeatType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface HabitRepeatConfig {
  type: HabitRepeatType;
  customDays?: number[]; // [0-6] dimana 0 adalah Sunday
  customDate?: number; // [1-31] untuk monthly
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  repeat?: HabitRepeatConfig;
  time?: string;
}

export type HabitHistory = Record<string, string[]>;

export type StreakData = string[];
export type HistoryData = Record<string, number>;
export interface AppSettings {
  theme?: string;
  [key: string]: unknown;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Teks raw Markdown
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  time?: string;
  reminder?: string;
  isPinned?: boolean;
}

interface AppContextType {
  appData: Category[];
  setAppData: React.Dispatch<React.SetStateAction<Category[]>>;
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  habitHistory: HabitHistory;
  setHabitHistory: React.Dispatch<React.SetStateAction<HabitHistory>>;
  streakData: StreakData;
  setStreakData: React.Dispatch<React.SetStateAction<StreakData>>;
  historyData: HistoryData;
  setHistoryData: React.Dispatch<React.SetStateAction<HistoryData>>;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;

  activeSection: string;
  setActiveSection: (section: string) => void;

  // Global UI State
  isTaskModalOpen: boolean;
  setTaskModalOpen: (isOpen: boolean) => void;
  editingTask: { catIndex: number; taskIndex: number } | null;
  setEditingTask: (task: { catIndex: number; taskIndex: number } | null) => void;
  currentCategoryIndex: number | null;
  setCurrentCategoryIndex: (index: number | null) => void;

  isAppLoading: boolean;

  undo: () => void;
  redo: () => void;
  saveHistorySnapshot: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appData, setAppData] = usePersistentState<Category[]>(STORAGE_KEYS.APP_DATA, [{ name: "Inbox", tasks: [] }]);
  const [xp, setXp] = usePersistentState<number>(STORAGE_KEYS.XP, 0);
  const [habits, setHabits] = usePersistentState<Habit[]>(STORAGE_KEYS.HABITS, []);
  const [habitHistory, setHabitHistory] = usePersistentState<HabitHistory>(STORAGE_KEYS.HABIT_HISTORY, {});
  const [streakData, setStreakData] = usePersistentState<StreakData>(STORAGE_KEYS.STREAK_DATA, []);
  const [historyData, setHistoryData] = usePersistentState<HistoryData>(STORAGE_KEYS.HISTORY_DATA, {});
  const [notes, setNotes] = usePersistentState<Note[]>(STORAGE_KEYS.NOTES, []);
  const [settings, setSettings] = usePersistentState<AppSettings>(STORAGE_KEYS.SETTINGS, {});

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{ catIndex: number; taskIndex: number } | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const saveHistorySnapshot = () => {
    const snapshot = JSON.stringify({ appData, xp, habits, habitHistory, streakData, historyData, notes });
    setUndoStack(prev => [...prev, snapshot]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const currentState = JSON.stringify({ appData, xp, habits, habitHistory, streakData, historyData, notes });
    setRedoStack(prev => [...prev, currentState]);
    
    const newUndoStack = [...undoStack];
    const prevStateStr = newUndoStack.pop();
    setUndoStack(newUndoStack);
    
    if (prevStateStr) {
      const prevState = JSON.parse(prevStateStr);
      setAppData(prevState.appData);
      setXp(prevState.xp);
      setHabits(prevState.habits);
      setHabitHistory(prevState.habitHistory);
      setStreakData(prevState.streakData);
      setHistoryData(prevState.historyData);
      setNotes(prevState.notes);
    }
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const currentState = JSON.stringify({ appData, xp, habits, habitHistory, streakData, historyData, notes });
    setUndoStack(prev => [...prev, currentState]);
    
    const newRedoStack = [...redoStack];
    const nextStateStr = newRedoStack.pop();
    setRedoStack(newRedoStack);
    
    if (nextStateStr) {
      const nextState = JSON.parse(nextStateStr);
      setAppData(nextState.appData);
      setXp(nextState.xp);
      setHabits(nextState.habits);
      setHabitHistory(nextState.habitHistory);
      setStreakData(nextState.streakData);
      setHistoryData(nextState.historyData);
      setNotes(nextState.notes);
    }
  };


  return (
    <AppContext.Provider value={{
      appData, setAppData,
      xp, setXp,
      habits, setHabits,
      habitHistory, setHabitHistory,
      streakData, setStreakData,
      historyData, setHistoryData,
      notes, setNotes,
      settings, setSettings,
      isSidebarOpen, setSidebarOpen,
      activeSection, setActiveSection,
      isTaskModalOpen, setTaskModalOpen,
      editingTask, setEditingTask,
      currentCategoryIndex, setCurrentCategoryIndex,
      isAppLoading,
      undo, redo, saveHistorySnapshot
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
