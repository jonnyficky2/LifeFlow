import { useAppContext } from '../context/AppContext';
import type { Task } from '../context/AppContext';

export function getToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function useTasks() {
  const { appData, setAppData, setXp, setStreakData, setHistoryData, saveHistorySnapshot } = useAppContext();

  const updateTaskStreak = (task: Task) => {
    const dates = [...new Set(task.completedDates)].sort();
    if (dates.length === 0) {
      task.streak = 0;
      task.lastCompleted = null;
      return;
    }

    const today = new Date(getToday() + "T00:00:00");
    const lastCompletedDate = new Date(dates[dates.length - 1] + "T00:00:00");
    const daysSinceLastCompleted = Math.round((today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastCompleted > 1) {
      task.streak = 0;
      task.lastCompleted = dates[dates.length - 1];
      return;
    }

    let streak = 1;
    for (let i = dates.length - 1; i > 0; i--) {
      const current = new Date(dates[i] + "T00:00:00");
      const prev = new Date(dates[i - 1] + "T00:00:00");
      const diff = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    task.streak = streak;
    task.lastCompleted = dates[dates.length - 1];
  };

  const updateDailyHistoryLocal = (newData: typeof appData) => {
    const today = getToday();
    let total = 0;
    let done = 0;

    newData.forEach(category => {
      category.tasks?.forEach(task => {
        total++;
        if (task.done) done++;
      });
    });

    const percent = total ? Math.round((done / total) * 100) : 0;
    
    setHistoryData((prev: any) => ({
      ...prev,
      [today]: percent
    }));
  };

  const toggleTask = (catIndex: number, taskIndex: number) => {
    saveHistorySnapshot();
    setAppData(prevData => {
      const oldTask = prevData[catIndex]?.tasks[taskIndex];
      if (!oldTask) return prevData;

      const task = { ...oldTask };
      const today = getToday();
      task.done = !task.done;
      const reward = 3;

      if (task.done) {
        if (!task.completedDates.includes(today)) {
          task.completedDates = [...task.completedDates, today];
          updateTaskStreak(task);
        }
        setXp(prev => prev + reward);
      } else {
        setXp(prev => Math.max(0, prev - reward));
        task.completedDates = task.completedDates.filter(date => date !== today);
        updateTaskStreak(task);
      }

      const newData = prevData.map((cat, cIdx) => {
        if (cIdx !== catIndex) return cat;
        return {
          ...cat,
          tasks: cat.tasks.map((t, tIdx) => tIdx === taskIndex ? task : t)
        };
      });

      if (task.done) {
        setStreakData(prevStreak => {
          let hasTask = false;
          let allDone = true;
          newData.forEach(category => {
            category.tasks?.forEach(t => {
              hasTask = true;
              if (!t.done) allDone = false;
            });
          });

          if (hasTask && allDone && !prevStreak.includes(today)) {
            return [...prevStreak, today];
          }
          return prevStreak;
        });
      }

      updateDailyHistoryLocal(newData);
      return newData;
    });
  };

  const toggleSubtask = (catIndex: number, taskIndex: number, subIndex: number) => {
    saveHistorySnapshot();
    setAppData(prevData => {
      return prevData.map((cat, cIdx) => {
        if (cIdx !== catIndex) return cat;
        return {
          ...cat,
          tasks: cat.tasks.map((t, tIdx) => {
            if (tIdx !== taskIndex) return t;
            return {
              ...t,
              subtasks: t.subtasks.map((sub, sIdx) => {
                if (sIdx !== subIndex) return sub;
                return { ...sub, done: !sub.done };
              })
            };
          })
        };
      });
    });
  };

  const deleteTask = (catIndex: number, taskIndex: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      saveHistorySnapshot();
      setAppData(prevData => {
        return prevData.map((cat, cIdx) => {
          if (cIdx !== catIndex) return cat;
          return {
            ...cat,
            tasks: cat.tasks.filter((_, tIdx) => tIdx !== taskIndex)
          };
        });
      });
    }
  };

  const deleteCategory = (catIndex: number) => {
    if (window.confirm("Delete this category and all tasks inside?")) {
      saveHistorySnapshot();
      setAppData(prevData => prevData.filter((_, cIdx) => cIdx !== catIndex));
    }
  };

  const addCategory = (name: string) => {
    saveHistorySnapshot();
    setAppData(prevData => {
      return [...prevData, { name, tasks: [] }];
    });
  };

  return {
    toggleTask,
    toggleSubtask,
    deleteTask,
    deleteCategory,
    addCategory
  };
}
