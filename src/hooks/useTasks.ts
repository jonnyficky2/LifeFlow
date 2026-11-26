import { useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useAppContext } from '../context/AppContext';
import { useHabitContext } from '../context/HabitContext';
import type { Task, HistoryData } from '../types';
import type { AssistantAction } from '../utils/aiAssistant';
import { useToast } from '../context/ToastContext';

export function getToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function useTasks() {
  const { appData, setAppData, saveTaskSnapshot } = useTaskContext();
  const { setXp, setHistoryData } = useAppContext();
  const { setStreakData } = useHabitContext();
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
    
    setHistoryData((prev: HistoryData) => ({
      ...prev,
      [today]: percent
    }));
  }, [setHistoryData]);

  const toggleTask = useCallback((catIndex: number, taskIndex: number) => {
    const oldTask = appData[catIndex]?.tasks[taskIndex];
    if (!oldTask) return;

    saveTaskSnapshot();
    const willBeDone = !oldTask.done;
    const reward = 3;

    if (willBeDone) {
      setXp(prev => prev + reward);
      showToast('Task completed (+3 XP)', 'success');
    } else {
      setXp(prev => Math.max(0, prev - reward));
      showToast('Task marked pending', 'info');
    }

    const task = { ...oldTask };
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

    const newData = appData.map((cat, cIdx) => {
      if (cIdx !== catIndex) return cat;
      return {
        ...cat,
        tasks: cat.tasks.map((t, tIdx) => tIdx === taskIndex ? task : t)
      };
    });

    setAppData(newData);

    // Setter lain dipanggil di luar updater setAppData: updater React dieksekusi saat render,
    // dan memanggil setState provider lain dari sana memicu warning "setState while rendering".
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
  }, [appData, saveTaskSnapshot, setAppData, setXp, showToast, setStreakData, updateDailyHistoryLocal]);

  const toggleSubtask = useCallback((catIndex: number, taskIndex: number, subIndex: number) => {
    saveTaskSnapshot();
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
  }, [saveTaskSnapshot, setAppData]);

  const deleteTask = useCallback((catIndex: number, taskIndex: number) => {
    saveTaskSnapshot();
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
  }, [saveTaskSnapshot, setAppData, showToast]);

  const deleteCategory = useCallback((catIndex: number) => {
    saveTaskSnapshot();
    setAppData(prevData => prevData.filter((_, cIdx) => cIdx !== catIndex));
    showToast('Category deleted', 'warning');
  }, [saveTaskSnapshot, setAppData, showToast]);

  const addCategory = useCallback((name: string) => {
    saveTaskSnapshot();
    setAppData(prevData => {
      return [...prevData, { name, tasks: [] }];
    });
    showToast(`Category "${name}" created`, 'success');
  }, [saveTaskSnapshot, setAppData, showToast]);

  const addTask = useCallback((catIndex: number, taskName: string) => {
    saveTaskSnapshot();
    setAppData(prevData => {
      return prevData.map((cat, cIdx) => {
        if (cIdx !== catIndex) return cat;
        const newTask: Task = {
          name: taskName,
          done: false,
          deadline: getToday(),
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
  }, [saveTaskSnapshot, setAppData, showToast]);

  const batchAddTasks = useCallback((catIndex: number, tasksToAdd: { name: string; priority?: string }[]) => {
    if (tasksToAdd.length === 0) return;
    saveTaskSnapshot();
    let targetCatName = 'Inbox';

    setAppData(prevData => {
      return prevData.map((cat, cIdx) => {
        if (cIdx !== catIndex) return cat;
        targetCatName = cat.name;
        const newTasks: Task[] = tasksToAdd.map(item => ({
          name: item.name,
          done: false,
          deadline: getToday(),
          time: "",
          location: "",
          note: "",
          priority: item.priority || "low",
          tags: [],
          subtasks: [],
          streak: 0,
          lastCompleted: null,
          completedDates: [],
          reminder: ""
        }));
        return {
          ...cat,
          tasks: [...(cat.tasks || []), ...newTasks]
        };
      });
    });
    showToast(`${tasksToAdd.length} task${tasksToAdd.length > 1 ? 's' : ''} added to ${targetCatName}`, 'success');
  }, [saveTaskSnapshot, setAppData, showToast]);

  const addTaskWithDetails = useCallback((catIndex: number, taskData: Partial<Task> & { name: string }) => {
    saveTaskSnapshot();
    let targetCatName = 'Inbox';
    setAppData(prevData => {
      return prevData.map((cat, cIdx) => {
        if (cIdx !== catIndex) return cat;
        targetCatName = cat.name;
        const newTask: Task = {
          name: taskData.name,
          done: Boolean(taskData.done),
          deadline: taskData.deadline || getToday(),
          time: taskData.time || "",
          location: taskData.location || "",
          note: taskData.note || "",
          priority: taskData.priority || "low",
          tags: taskData.tags || [],
          subtasks: taskData.subtasks || [],
          streak: 0,
          lastCompleted: null,
          completedDates: [],
          reminder: taskData.reminder || ""
        };
        return {
          ...cat,
          tasks: [...(cat.tasks || []), newTask]
        };
      });
    });
    showToast(`Task "${taskData.name}" ditambahkan ke ${targetCatName}`, 'success');
  }, [saveTaskSnapshot, setAppData, showToast]);

  const updateTaskFields = useCallback((catIndex: number, taskIndex: number, patch: Partial<Task>) => {
    saveTaskSnapshot();
    setAppData(prevData => {
      return prevData.map((cat, cIdx) => {
        if (cIdx !== catIndex) return cat;
        return {
          ...cat,
          tasks: cat.tasks.map((t, tIdx) => {
            if (tIdx !== taskIndex) return t;
            return {
              ...t,
              ...patch
            };
          })
        };
      });
    });
    showToast('Tugas berhasil diperbarui', 'success');
  }, [saveTaskSnapshot, setAppData, showToast]);

  const setTaskDone = useCallback((catIndex: number, taskIndex: number, done: boolean) => {
    const currentTask = appData[catIndex]?.tasks[taskIndex];
    if (!currentTask) return;
    if (currentTask.done !== done) {
      toggleTask(catIndex, taskIndex);
    }
  }, [appData, toggleTask]);

  const moveTask = useCallback((sourceCatIndex: number, taskIndex: number, targetCatIndex: number) => {
    if (sourceCatIndex === targetCatIndex) return;
    const taskToMove = appData[sourceCatIndex]?.tasks[taskIndex];
    if (!taskToMove) return;

    saveTaskSnapshot();
    setAppData(prevData => {
      const sourceCat = prevData[sourceCatIndex];
      const targetCat = prevData[targetCatIndex];
      if (!sourceCat || !targetCat) return prevData;

      const moving = sourceCat.tasks[taskIndex];
      if (!moving) return prevData;

      return prevData.map((cat, cIdx) => {
        if (cIdx === sourceCatIndex) {
          return {
            ...cat,
            tasks: cat.tasks.filter((_, tIdx) => tIdx !== taskIndex)
          };
        }
        if (cIdx === targetCatIndex) {
          return {
            ...cat,
            tasks: [...(cat.tasks || []), moving]
          };
        }
        return cat;
      });
    });
    const targetName = appData[targetCatIndex]?.name || 'kategori baru';
    showToast(`Tugas dipindahkan ke ${targetName}`, 'success');
  }, [appData, saveTaskSnapshot, setAppData, showToast]);

  const executeAssistantAction = useCallback((action: AssistantAction) => {
    if (action.type === 'create_task') {
      const targetName = (action.payload.categoryName || 'Inbox').trim().toLowerCase();
      let catIndex = appData.findIndex(c => c.name.trim().toLowerCase() === targetName);
      if (catIndex === -1) {
        saveTaskSnapshot();
        const newCatName = action.payload.categoryName || 'Inbox';
        const newTask: Task = {
          name: action.payload.taskName,
          done: false,
          deadline: action.payload.deadline || "",
          time: action.payload.time || "",
          location: "",
          note: action.payload.note || "",
          priority: action.payload.priority || "low",
          tags: [],
          subtasks: [],
          streak: 0,
          lastCompleted: null,
          completedDates: [],
          reminder: ""
        };
        setAppData(prev => [...prev, { name: newCatName, tasks: [newTask] }]);
        showToast(`Task "${action.payload.taskName}" ditambahkan ke ${newCatName}`, 'success');
      } else {
        addTaskWithDetails(catIndex, {
          name: action.payload.taskName,
          time: action.payload.time,
          deadline: action.payload.deadline,
          priority: action.payload.priority || 'low',
          note: action.payload.note
        });
      }
    } else if (action.type === 'update_task') {
      for (let cIdx = 0; cIdx < appData.length; cIdx++) {
        const cat = appData[cIdx];
        if (!cat.tasks) continue;
        const tIdx = cat.tasks.findIndex(t => t.name.trim().toLowerCase() === action.payload.taskName.trim().toLowerCase());
        if (tIdx !== -1) {
          updateTaskFields(cIdx, tIdx, {
            time: action.payload.time,
            deadline: action.payload.deadline,
            priority: action.payload.priority,
            note: action.payload.note
          });
          break;
        }
      }
    } else if (action.type === 'set_task_done') {
      for (let cIdx = 0; cIdx < appData.length; cIdx++) {
        const cat = appData[cIdx];
        if (!cat.tasks) continue;
        const tIdx = cat.tasks.findIndex(t => t.name.trim().toLowerCase() === action.payload.taskName.trim().toLowerCase());
        if (tIdx !== -1) {
          setTaskDone(cIdx, tIdx, Boolean(action.payload.done));
          break;
        }
      }
    } else if (action.type === 'move_task') {
      let sourceCIdx = -1;
      let targetTIdx = -1;
      const targetTaskNorm = action.payload.taskName.trim().toLowerCase();

      for (let cIdx = 0; cIdx < appData.length; cIdx++) {
        const cat = appData[cIdx];
        if (!cat.tasks) continue;
        const idx = cat.tasks.findIndex(t => t.name.trim().toLowerCase() === targetTaskNorm);
        if (idx !== -1) {
          sourceCIdx = cIdx;
          targetTIdx = idx;
          break;
        }
      }

      if (sourceCIdx !== -1 && targetTIdx !== -1 && action.payload.targetCategoryName) {
        const destCatNameNorm = action.payload.targetCategoryName.trim().toLowerCase();
        let targetCIdx = appData.findIndex(c => c.name.trim().toLowerCase() === destCatNameNorm);
        if (targetCIdx === -1) {
          saveTaskSnapshot();
          setAppData(prev => {
            const movingTask = prev[sourceCIdx]?.tasks[targetTIdx];
            if (!movingTask) return prev;
            const updatedSource = {
              ...prev[sourceCIdx],
              tasks: prev[sourceCIdx].tasks.filter((_, i) => i !== targetTIdx)
            };
            const newCat = {
              name: action.payload.targetCategoryName!,
              tasks: [movingTask]
            };
            return prev.map((cat, idx) => idx === sourceCIdx ? updatedSource : cat).concat(newCat);
          });
          showToast(`Tugas dipindahkan ke ${action.payload.targetCategoryName}`, 'success');
        } else {
          moveTask(sourceCIdx, targetTIdx, targetCIdx);
        }
      }
    }
  }, [appData, saveTaskSnapshot, setAppData, showToast, addTaskWithDetails, updateTaskFields, setTaskDone, moveTask]);

  return {
    toggleTask,
    toggleSubtask,
    deleteTask,
    deleteCategory,
    addCategory,
    addTask,
    batchAddTasks,
    addTaskWithDetails,
    updateTaskFields,
    setTaskDone,
    moveTask,
    executeAssistantAction
  };
}
