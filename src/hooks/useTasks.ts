import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Task } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export function getToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function useTasks() {
  const { appData, setAppData, setXp, setStreakData, setHistoryData, saveHistorySnapshot } = useAppContext();
  const { showToast } = useToast();

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

  const updateDailyHistoryLocal = useCallback((newData: typeof appData) => {
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
  }, [setHistoryData]);

  const toggleTask = useCallback((catIndex: number, taskIndex: number) => {
    const oldTask = appData[catIndex]?.tasks[taskIndex];
    if (!oldTask) return;

    saveHistorySnapshot();
    const willBeDone = !oldTask.done;
    const reward = 3;

    if (willBeDone) {
      setXp(prev => prev + reward);
      showToast(`Task completed! +${reward} XP`, 'success');
    } else {
      setXp(prev => Math.max(0, prev - reward));
      showToast('Task marked as pending', 'info');
    }

    setAppData(prevData => {
      const currentOldTask = prevData[catIndex]?.tasks[taskIndex];
      if (!currentOldTask) return prevData;

      const task = { ...currentOldTask };
      const today = getToday();
      task.done = willBeDone;

      if (task.done) {
        if (!task.completedDates.includes(today)) {
          task.completedDates = [...task.completedDates, today];
          updateTaskStreak(task);
        }
      } else {
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
  }, [appData, saveHistorySnapshot, setAppData, setXp, showToast, setStreakData, updateDailyHistoryLocal]);

  const toggleSubtask = useCallback((catIndex: number, taskIndex: number, subIndex: number) => {
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
  }, [saveHistorySnapshot, setAppData]);

  const deleteTask = useCallback((catIndex: number, taskIndex: number) => {
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
      showToast('Task deleted', 'warning');
    }
  }, [saveHistorySnapshot, setAppData, showToast]);

  const deleteCategory = useCallback((catIndex: number) => {
    if (window.confirm("Delete this category and all tasks inside?")) {
      saveHistorySnapshot();
      setAppData(prevData => prevData.filter((_, cIdx) => cIdx !== catIndex));
      showToast('Category deleted', 'warning');
    }
  }, [saveHistorySnapshot, setAppData, showToast]);

  const addCategory = useCallback((name: string) => {
    saveHistorySnapshot();
    setAppData(prevData => {
      return [...prevData, { name, tasks: [] }];
    });
    showToast(`Category "${name}" created`, 'success');
  }, [saveHistorySnapshot, setAppData, showToast]);

  const addTask = useCallback((catIndex: number, taskName: string) => {
    saveHistorySnapshot();
    setAppData(prevData => {
      return prevData.map((cat, cIdx) => {
        if (cIdx !== catIndex) return cat;
        const newTask: Task = {
          name: taskName,
          done: false,
          deadline: "",
          time: "",
          location: "",
          note: "",
          priority: "low",
          tags: [],
          subtasks: [],
          streak: 0,
          lastCompleted: null,
          completedDates: [],
          reminder: ""
        };
        return {
          ...cat,
          tasks: [...(cat.tasks || []), newTask]
        };
      });
    });
    showToast('Task added', 'success');
  }, [saveHistorySnapshot, setAppData, showToast]);

  return {
    toggleTask,
    toggleSubtask,
    deleteTask,
    deleteCategory,
    addCategory,
    addTask
  };
}
