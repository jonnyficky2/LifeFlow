import { useCallback } from 'react';
import { useHabitContext } from '../context/HabitContext';
import { useAppContext } from '../context/AppContext';
import type { Habit, HabitRepeatConfig } from '../types';
import { useToast } from '../context/ToastContext';

export const useHabits = () => {
  const { 
    habits, 
    setHabits, 
    habitCategories, 
    setHabitCategories, 
    habitHistory, 
    setHabitHistory, 
    saveHabitSnapshot 
  } = useHabitContext();
  const { setXp } = useAppContext();
  const { showToast } = useToast();

  const addCategory = useCallback((categoryName: string) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    if (habitCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Category already exists', 'info');
      return;
    }
    saveHabitSnapshot();
    setHabitCategories(prev => [...prev, trimmed]);
    showToast(`Category "${trimmed}" created`, 'success');
  }, [habitCategories, saveHabitSnapshot, setHabitCategories, showToast]);

  const deleteCategory = useCallback((categoryName: string) => {
    saveHabitSnapshot();
    setHabitCategories(prev => prev.filter(c => c !== categoryName));
    // Reassign habits under this category to "Daily" or first available category
    setHabits(prev => prev.map(h => {
      if (h.category === categoryName) {
        return { ...h, category: 'Daily' };
      }
      return h;
    }));
    showToast(`Category "${categoryName}" removed`, 'warning');
  }, [saveHabitSnapshot, setHabitCategories, setHabits, showToast]);

  const addHabit = useCallback((
    name: string,
    color: string = 'var(--primary-color)',
    icon: string = 'target',
    repeat?: HabitRepeatConfig,
    time?: string,
    category?: string,
    targetValue?: string
  ) => {
    saveHabitSnapshot();
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const targetCat = category?.trim() || 'Daily';
    
    // Auto-ensure category exists
    if (!habitCategories.includes(targetCat)) {
      setHabitCategories(prev => [...prev, targetCat]);
    }

    const newHabit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      category: targetCat,
      color,
      icon,
      createdAt: d.toISOString(),
      startDate: today,
      repeat,
      time: time || undefined,
      targetValue: targetValue?.trim() || undefined
    };
    setHabits(prev => [...prev, newHabit]);
    showToast(`Habit "${name.trim()}" added to ${targetCat}`, 'success');
  }, [saveHabitSnapshot, habitCategories, setHabitCategories, setHabits, showToast]);

  const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
    saveHabitSnapshot();
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      return { ...h, ...updates };
    }));
    showToast('Habit updated', 'success');
  }, [saveHabitSnapshot, setHabits, showToast]);

  const addHabits = useCallback((items: Array<{ name: string; time?: string; repeat?: HabitRepeatConfig; icon?: string; category?: string; targetValue?: string }>) => {
    const valid = items.filter(i => i && i.name && i.name.trim().length > 0);
    if (valid.length === 0) return;
    saveHabitSnapshot();
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const newHabits: Habit[] = valid.map(item => ({
      id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${Math.random().toString(36).substring(2, 9)}`,
      name: item.name.trim(),
      category: item.category?.trim() || 'Daily',
      color: 'var(--primary-color)',
      icon: item.icon || 'target',
      createdAt: d.toISOString(),
      startDate: today,
      repeat: item.repeat,
      time: item.time,
      targetValue: item.targetValue
    }));
    setHabits(prev => [...prev, ...newHabits]);
    valid.forEach(item => showToast(`Habit "${item.name.trim()}" added`, 'success'));
  }, [saveHabitSnapshot, setHabits, showToast]);

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
    const isCompleted = currentDates.includes(dateString);
    const reward = 5;
    
    if (isCompleted) {
      // Remove date
      newHistory[habitId] = currentDates.filter(d => d !== dateString);
      setXp(prev => Math.max(0, prev - reward));
      showToast('Habit marked pending', 'info');
    } else {
      // Add date
      newHistory[habitId] = [...currentDates, dateString];
      setXp(prev => prev + reward);
      showToast('Habit completed (+5 XP)', 'success');
    }
    
    setHabitHistory(newHistory);
  }, [saveHabitSnapshot, habitHistory, setHabitHistory, setXp, showToast]);

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
    habitCategories,
    addCategory,
    deleteCategory,
    addHabit,
    updateHabit,
    addHabits,
    deleteHabit,
    toggleHabitDate,
    getCompletionRate
  };
};
