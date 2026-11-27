import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from './AppContext';
import { usePersistentState } from '../hooks/usePersistentState';
import type { Habit, HabitHistory, StreakData } from '../types';

interface HabitContextType {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  habitCategories: string[];
  setHabitCategories: React.Dispatch<React.SetStateAction<string[]>>;
  habitHistory: HabitHistory;
  setHabitHistory: React.Dispatch<React.SetStateAction<HabitHistory>>;
  streakData: StreakData;
  setStreakData: React.Dispatch<React.SetStateAction<StreakData>>;
  pendingHabitCategory: string | null;
  setPendingHabitCategory: (category: string | null) => void;
  undoHabit: () => void;
  redoHabit: () => void;
  saveHabitSnapshot: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const DEFAULT_HABIT_CATEGORIES = ['Work Out', 'Morning Routine', 'Daily'];

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = usePersistentState<Habit[]>(STORAGE_KEYS.HABITS, []);
  const [habitCategories, setHabitCategories] = usePersistentState<string[]>(STORAGE_KEYS.HABIT_CATEGORIES, DEFAULT_HABIT_CATEGORIES);
  const [habitHistory, setHabitHistory] = usePersistentState<HabitHistory>(STORAGE_KEYS.HABIT_HISTORY, {});
  const [streakData, setStreakData] = usePersistentState<StreakData>(STORAGE_KEYS.STREAK_DATA, []);
  const [pendingHabitCategory, setPendingHabitCategory] = useState<string | null>(null);

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const saveHabitSnapshot = () => {
    const snapshot = JSON.stringify({ habits, habitCategories, habitHistory, streakData });
    setUndoStack(prev => [...prev, snapshot]);
    setRedoStack([]);
  };

  const undoHabit = () => {
    if (undoStack.length === 0) return;
    const currentState = JSON.stringify({ habits, habitCategories, habitHistory, streakData });
    setRedoStack(prev => [...prev, currentState]);
    const newUndoStack = [...undoStack];
    const prevStateStr = newUndoStack.pop();
    setUndoStack(newUndoStack);
    if (prevStateStr) {
      const prevState = JSON.parse(prevStateStr);
      setHabits(prevState.habits);
      if (prevState.habitCategories) setHabitCategories(prevState.habitCategories);
      setHabitHistory(prevState.habitHistory);
      setStreakData(prevState.streakData);
    }
  };

  const redoHabit = () => {
    if (redoStack.length === 0) return;
    const currentState = JSON.stringify({ habits, habitCategories, habitHistory, streakData });
    setUndoStack(prev => [...prev, currentState]);
    const newRedoStack = [...redoStack];
    const nextStateStr = newRedoStack.pop();
    setRedoStack(newRedoStack);
    if (nextStateStr) {
      const nextState = JSON.parse(nextStateStr);
      setHabits(nextState.habits);
      if (nextState.habitCategories) setHabitCategories(nextState.habitCategories);
      setHabitHistory(nextState.habitHistory);
      setStreakData(nextState.streakData);
    }
  };

  return (
    <HabitContext.Provider value={{
      habits, setHabits,
      habitCategories, setHabitCategories,
      habitHistory, setHabitHistory,
      streakData, setStreakData,
      pendingHabitCategory, setPendingHabitCategory,
      undoHabit, redoHabit, saveHabitSnapshot
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitContext = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabitContext must be used within HabitProvider');
  return context;
};
