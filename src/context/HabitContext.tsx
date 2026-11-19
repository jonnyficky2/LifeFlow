import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';
import { collection, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { STORAGE_KEYS } from './AppContext';
import { usePersistentState } from '../hooks/usePersistentState';
import type { Habit, HabitHistory, StreakData } from '../types';

interface HabitContextType {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  habitHistory: HabitHistory;
  setHabitHistory: React.Dispatch<React.SetStateAction<HabitHistory>>;
  streakData: StreakData;
  setStreakData: React.Dispatch<React.SetStateAction<StreakData>>;
  undoHabit: () => void;
  redoHabit: () => void;
  saveHabitSnapshot: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = usePersistentState<Habit[]>(STORAGE_KEYS.HABITS, []);
  const [habitHistory, setHabitHistory] = usePersistentState<HabitHistory>(STORAGE_KEYS.HABIT_HISTORY, {});
  const [streakData, setStreakData] = usePersistentState<StreakData>(STORAGE_KEYS.STREAK_DATA, []);

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const { user } = useAuth();
  const habitsRef = useRef<string>('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'habits'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mapped = snapshot.docs.map(d => ({ ...(d.data() as Habit), id: d.id }));
      setHabits(mapped);
      habitsRef.current = JSON.stringify(mapped);
    }, (err) => console.error('Failed to sync habits from Firestore:', err));
    return () => unsubscribe();
  }, [user, setHabits]);

  useEffect(() => {
    if (!user || habits.length === 0) return;
    const current = JSON.stringify(habits);
    if (current === habitsRef.current) return;
    habitsRef.current = current;
    const writes = habits.map(h => {
      const { id, ...data } = h;
      return setDoc(doc(db, 'users', user.uid, 'habits', id), data);
    });
    Promise.all(writes).catch(err => console.error('Failed to sync habits to Firestore:', err));
  }, [habits, user]);

  const saveHabitSnapshot = () => {
    const snapshot = JSON.stringify({ habits, habitHistory, streakData });
    setUndoStack(prev => [...prev, snapshot]);
    setRedoStack([]);
  };

  const undoHabit = () => {
    if (undoStack.length === 0) return;
    const currentState = JSON.stringify({ habits, habitHistory, streakData });
    setRedoStack(prev => [...prev, currentState]);
    const newUndoStack = [...undoStack];
    const prevStateStr = newUndoStack.pop();
    setUndoStack(newUndoStack);
    if (prevStateStr) {
      const prevState = JSON.parse(prevStateStr);
      setHabits(prevState.habits);
      setHabitHistory(prevState.habitHistory);
      setStreakData(prevState.streakData);
    }
  };

  const redoHabit = () => {
    if (redoStack.length === 0) return;
    const currentState = JSON.stringify({ habits, habitHistory, streakData });
    setUndoStack(prev => [...prev, currentState]);
    const newRedoStack = [...redoStack];
    const nextStateStr = newRedoStack.pop();
    setRedoStack(newRedoStack);
    if (nextStateStr) {
      const nextState = JSON.parse(nextStateStr);
      setHabits(nextState.habits);
      setHabitHistory(nextState.habitHistory);
      setStreakData(nextState.streakData);
    }
  };

  return (
    <HabitContext.Provider value={{
      habits, setHabits,
      habitHistory, setHabitHistory,
      streakData, setStreakData,
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
