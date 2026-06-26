import React, { createContext, useContext, useState, useEffect } from 'react';
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

function getLocalData(key: string, defaultValue: any) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Gagal membaca ${key} dari LocalStorage:`, error);
    return defaultValue;
  }
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

export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export type HabitHistory = Record<string, string[]>;

export interface Note {
  id: string;
  title: string;
  content: string; // Teks raw Markdown
  createdAt: string;
  updatedAt: string;
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
  streakData: any[];
  setStreakData: React.Dispatch<React.SetStateAction<any[]>>;
  historyData: any;
  setHistoryData: React.Dispatch<React.SetStateAction<any>>;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  
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

  undo: () => void;
  redo: () => void;
  saveHistorySnapshot: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useState<Category[]>(getLocalData(STORAGE_KEYS.APP_DATA, [{ name: "Inbox", tasks: [] }]));
  const [xp, setXp] = useState<number>(Number(localStorage.getItem(STORAGE_KEYS.XP)) || 0);
  const [habits, setHabits] = useState<Habit[]>(getLocalData(STORAGE_KEYS.HABITS, []));
  const [habitHistory, setHabitHistory] = useState<HabitHistory>(getLocalData(STORAGE_KEYS.HABIT_HISTORY, {}));
  const [streakData, setStreakData] = useState<any[]>(getLocalData(STORAGE_KEYS.STREAK_DATA, []));
  const [historyData, setHistoryData] = useState<any>(getLocalData(STORAGE_KEYS.HISTORY_DATA, {}));
  const [notes, setNotes] = useState<Note[]>(getLocalData(STORAGE_KEYS.NOTES, []));
  const [settings, setSettings] = useState<any>(getLocalData(STORAGE_KEYS.SETTINGS, {}));

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{ catIndex: number; taskIndex: number } | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number | null>(0);

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

  // Sync to local storage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(appData));
    localStorage.setItem(STORAGE_KEYS.XP, xp.toString());
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    localStorage.setItem(STORAGE_KEYS.HABIT_HISTORY, JSON.stringify(habitHistory));
    localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
    localStorage.setItem(STORAGE_KEYS.HISTORY_DATA, JSON.stringify(historyData));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [appData, xp, habits, habitHistory, streakData, historyData, notes, settings]);

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
