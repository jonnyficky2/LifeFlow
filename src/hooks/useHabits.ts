import { useCallback } from 'react';
import { useHabitContext } from '../context/HabitContext';
import type { Habit, HabitRepeatConfig } from '../types';
import { useToast } from '../context/ToastContext';

export const useHabits = () => {
  const { habits, setHabits, habitHistory, setHabitHistory, saveHabitSnapshot } = useHabitContext();
  const { showToast } = useToast();

  const addHabit = useCallback((name: string, color: string = 'var(--primary-color)', icon: string = '🎯', repeat?: HabitRepeatConfig, time?: string) => {
    saveHabitSnapshot();
    const newHabit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      color,
      icon,
      createdAt: new Date().toISOString(),
      repeat,
      time
    };
    setHabits([...habits, newHabit]);
    showToast(`Habit "${name}" added`, 'success');
  }, [saveHabitSnapshot, setHabits, habits, showToast]);

  const deleteHabit = useCallback((habitId: string) => {
    saveHabitSnapshot();
    setHabits(habits.filter(h => h.id !== habitId));
    
    // Also cleanup history
    const newHistory = { ...habitHistory };
    delete newHistory[habitId];
    setHabitHistory(newHistory);
    showToast('Habit deleted', 'warning');
  }, [saveHabitSnapshot, setHabits, habits, habitHistory, setHabitHistory, showToast]);

  const toggleHabitDate = useCallback((habitId: string, dateString: string) => {
    saveHabitSnapshot();
    
    const newHistory = { ...habitHistory };
    const currentDates = newHistory[habitId] || [];
    
    if (currentDates.includes(dateString)) {
      // Remove date
      newHistory[habitId] = currentDates.filter(d => d !== dateString);
      showToast('Habit unchecked', 'info');
    } else {
      // Add date
      newHistory[habitId] = [...currentDates, dateString];
      showToast('Habit completed! Well done!', 'success');
    }
    
    setHabitHistory(newHistory);
  }, [saveHabitSnapshot, habitHistory, setHabitHistory, showToast]);

  const getCompletionRate = (habitId: string, days: number = 30): number => {
    const dates = habitHistory[habitId] || [];
    if (dates.length === 0) return 0;

    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - days);
    
    // Format cutoff to YYYY-MM-DD local
    const y = cutoff.getFullYear();
    const m = String(cutoff.getMonth() + 1).padStart(2, '0');
    const day = String(cutoff.getDate()).padStart(2, '0');
    const cutoffStr = `${y}-${m}-${day}`;
    
    const todayY = today.getFullYear();
    const todayM = String(today.getMonth() + 1).padStart(2, '0');
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayStr = `${todayY}-${todayM}-${todayDay}`;
    
    const validDates = dates.filter(d => {
      return d >= cutoffStr && d <= todayStr;
    });

    return Math.round((validDates.length / days) * 100);
  };

  return {
    addHabit,
    deleteHabit,
    toggleHabitDate,
    getCompletionRate
  };
};
