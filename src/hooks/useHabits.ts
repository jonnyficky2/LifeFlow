import { useAppContext } from '../context/AppContext';
import type { Habit } from '../context/AppContext';

export const useHabits = () => {
  const { habits, setHabits, habitHistory, setHabitHistory, saveHistorySnapshot } = useAppContext();

  const addHabit = (name: string, color: string = 'var(--primary-color)', icon: string = '🎯') => {
    saveHistorySnapshot();
    const newHabit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      color,
      icon,
      createdAt: new Date().toISOString()
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (habitId: string) => {
    saveHistorySnapshot();
    setHabits(habits.filter(h => h.id !== habitId));
    
    // Also cleanup history
    const newHistory = { ...habitHistory };
    delete newHistory[habitId];
    setHabitHistory(newHistory);
  };

  const toggleHabitDate = (habitId: string, dateString: string) => {
    saveHistorySnapshot();
    
    const newHistory = { ...habitHistory };
    const currentDates = newHistory[habitId] || [];
    
    if (currentDates.includes(dateString)) {
      // Remove date
      newHistory[habitId] = currentDates.filter(d => d !== dateString);
    } else {
      // Add date
      newHistory[habitId] = [...currentDates, dateString];
    }
    
    setHabitHistory(newHistory);
  };

  const getCompletionRate = (habitId: string, days: number = 30): number => {
    const dates = habitHistory[habitId] || [];
    if (dates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count how many of the completed dates fall within the last 'days'
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - days);
    
    const validDates = dates.filter(d => {
      const date = new Date(d);
      return date >= cutoff && date <= today;
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
