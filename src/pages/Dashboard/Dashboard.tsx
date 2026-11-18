import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import { useHabitContext } from '../../context/HabitContext';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import type { Task } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';

const getLocalDateString = (dateObj: Date) => {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
};

export const Dashboard: React.FC = () => {
  const { historyData, isAppLoading, setActiveSection } = useAppContext();
  const { appData, setTaskModalOpen, setCurrentCategoryIndex, setEditingTask } = useTaskContext();
  const { habits, habitHistory } = useHabitContext();
  const { toggleTask } = useTasks();
  const { user } = useAuth();
  const [justCompletedTasks, setJustCompletedTasks] = React.useState<Set<string>>(new Set());

  const handleToggleTask = (catIndex: number, taskIndex: number, currentDone: boolean) => {
    if (!currentDone) {
      const key = `${catIndex}-${taskIndex}`;
      setJustCompletedTasks(prev => new Set(prev).add(key));
      setTimeout(() => {
        setJustCompletedTasks(prev => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 1000);
    }
    toggleTask(catIndex, taskIndex);
  };

  const todayStr = getLocalDateString(new Date());

  // Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17) timeGreeting = 'Good evening';

    const name = user?.displayName ? user.displayName.split(' ')[0] : '';
    return name ? `${timeGreeting}, ${name}!` : `${timeGreeting}!`;
  }, [user]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).format(new Date());
  }, []);

  const stats = useMemo(() => {
    let done = 0;
    let pending = 0;
    let total = 0;
    let todayTasks = 0;

    appData.forEach(category => {
      category.tasks?.forEach((task: Task) => {
        total++;
        if (task.deadline === todayStr) todayTasks++;
        if (task.done) done++;
        else pending++;
      });
    });

    return { done, pending, total, todayTasks };
  }, [appData, todayStr]);

  const habitStats = useMemo(() => {
    const total = habits.length;
    if (total === 0) return { completed: 0, total: 0, text: '0/0' };
    const completed = habits.filter(h => (habitHistory[h.id] || []).includes(todayStr)).length;
    return { completed, total, text: `${completed}/${total}` };
  }, [habits, habitHistory, todayStr]);

  // Heatmap: 30 days
  const heatmapBoxes = useMemo(() => {
    const boxes = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = getLocalDateString(d);
      
      const percent = historyData[dateString] || 0;
      const isActive = percent > 0;
      
      boxes.push(
        <div 
          key={dateString} 
          className={`day-box ${isActive ? 'day-active' : ''}`}
          style={isActive ? { opacity: Math.max(0.3, percent / 100) } : {}}
          title={`${dateString}: ${percent}%`}
        ></div>
      );
    }
    return boxes;
  }, [historyData]);

  // Actionable tasks: Overdue first, then Today, then General Pending (max 5)
  const priorityTasks = useMemo(() => {
    const overdue: { task: Task; catIndex: number; taskIndex: number; categoryName: string; isOverdue: boolean }[] = [];
    const todayList: { task: Task; catIndex: number; taskIndex: number; categoryName: string; isOverdue: boolean }[] = [];
    const generalPending: { task: Task; catIndex: number; taskIndex: number; categoryName: string; isOverdue: boolean }[] = [];

    appData.forEach((category, catIndex) => {
      (category.tasks || []).forEach((task: Task, taskIndex: number) => {
        if (!task.done) {
          const item = {
            task,
            catIndex,
            taskIndex,
            categoryName: category.name || 'Inbox',
            isOverdue: Boolean(task.deadline && task.deadline < todayStr)
          };
          if (item.isOverdue) {
            overdue.push(item);
          } else if (task.deadline === todayStr) {
            todayList.push(item);
          } else {
            generalPending.push(item);
          }
        }
      });
    });

    const combined = [...overdue, ...todayList];
    if (combined.length === 0) {
      return generalPending.slice(0, 5);
    }
    return combined.slice(0, 5);
  }, [appData, todayStr]);

  const openAddTask = () => {
    setEditingTask(null);
    setCurrentCategoryIndex(0);
    setTaskModalOpen(true);
  };

  const handleOpenTaskDetail = (catIndex: number, taskIndex: number) => {
    setEditingTask({ catIndex, taskIndex });
    setCurrentCategoryIndex(catIndex);
    setTaskModalOpen(true);
  };

  return (
    <div id="homeSection" className="dashboard-wrapper section-page">
      <section className="dashboard-header">
        <div>
          <h1>{greeting}</h1>
          <p>{formattedDate} — Let's make today productive.</p>
        </div>
        <div className="dashboard-header-actions">
          <button type="button" className="btn btn-primary" onClick={openAddTask}>+ Add task</button>
        </div>
      </section>

      <section className="dashboard-panel dashboard-today-panel">
        <div className="panel-header">
          <div>
            <h2>Today & Overdue</h2>
            <p>Tasks that need your attention now.</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => setActiveSection('tasks')}>View all tasks</button>
        </div>
        {priorityTasks.length > 0 ? (
          <div className="dashboard-today-list">
            {priorityTasks.map(({ task, catIndex, taskIndex, categoryName, isOverdue }) => (
              <div className={`dashboard-today-item ${justCompletedTasks.has(`${catIndex}-${taskIndex}`) ? 'dashboard-today-item--just-completed' : ''}`} key={`${catIndex}-${taskIndex}`}>
                <input
                  type="checkbox"
                  className="dashboard-today-checkbox"
                  checked={task.done}
                  onChange={() => handleToggleTask(catIndex, taskIndex, task.done)}
                  aria-label={`Mark "${task.name}" as done`}
                />
                <button
                  type="button"
                  className="dashboard-today-task-btn"
                  onClick={() => handleOpenTaskDetail(catIndex, taskIndex)}
                  title="Click to view or edit task"
                >
                  {task.name}
                </button>
                <div className="dashboard-task-tags">
                  {isOverdue && (
                    <span className="dashboard-task-tag dashboard-task-tag--overdue">Overdue</span>
                  )}
                  {!isOverdue && task.deadline === todayStr && (
                    <span className="dashboard-task-tag dashboard-task-tag--today">Today</span>
                  )}
                  {task.time && (
                    <span className="dashboard-task-tag">{task.time}</span>
                  )}
                  <span className="dashboard-task-tag dashboard-task-tag--category">{categoryName}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="dashboard-empty-copy">🎉 All caught up! No pending tasks right now.</p>
        )}
      </section>

      {/* QUICK SUMMARY */}
      <div id="quickStats" className="quick-stats-grid">
        <div className="stat-card">
          <div>
            <p>Remaining</p>
            {isAppLoading ? <Skeleton height={28} width={40} className="dashboard-skeleton-stat-num" /> : <h3 id="pendingCount">{stats.pending}</h3>}
            <small>Tasks to do</small>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p>Completed today</p>
            {isAppLoading ? <Skeleton height={28} width={40} className="dashboard-skeleton-stat-num" /> : <h3 id="doneCount">{stats.done}</h3>}
            <small>Finished tasks</small>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p>Due today</p>
            {isAppLoading ? <Skeleton height={28} width={40} className="dashboard-skeleton-stat-num" /> : <h3 id="todayCount">{stats.todayTasks}</h3>}
            <small>Scheduled tasks</small>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p>Habits today</p>
            {isAppLoading ? <Skeleton height={28} width={40} className="dashboard-skeleton-stat-num" /> : <h3 id="habitCount">{habitStats.text}</h3>}
            <small>Habit consistency</small>
          </div>
        </div>
      </div>

      {/* ACTIVITY & MOTIVATION */}
      <section className="dashboard-grid">
        <section className="dashboard-panel activity-panel dashboard-panel-no-margin">
          <h2>Activity</h2>
          <div id="heatmap">
            {isAppLoading ? (
              Array.from({ length: 30 }).map((_, i) => (
                <Skeleton key={i} width="100%" height="100%" className="dashboard-skeleton-activity-box" />
              ))
            ) : heatmapBoxes}
          </div>
        </section>
      </section>
    </div>
  );
};
