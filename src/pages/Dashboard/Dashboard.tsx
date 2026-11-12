import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import type { Task } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';

const getLocalDateString = (dateObj: Date) => {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
};

export const Dashboard: React.FC = () => {
  const { historyData, isAppLoading, setActiveSection } = useAppContext();
  const { appData, setTaskModalOpen, setCurrentCategoryIndex } = useTaskContext();

  const stats = useMemo(() => {
    let done = 0;
    let pending = 0;
    let total = 0;
    let todayTasks = 0;
    const today = getLocalDateString(new Date());

    appData.forEach(category => {
      category.tasks?.forEach((task: Task) => {
        total++;
        if (task.deadline === today) todayTasks++;
        if (task.done) done++;
        else pending++;
      });
    });

    return { done, pending, total, todayTasks };
  }, [appData]);

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

  const todayTasks = useMemo(() => appData.flatMap((category, catIndex) =>
    (category.tasks || []).map((task, taskIndex) => ({ task, catIndex, taskIndex }))
  ).filter(({ task }) => !task.done && task.deadline === getLocalDateString(new Date())).slice(0, 5), [appData]);

  const openAddTask = () => {
    setCurrentCategoryIndex(0);
    setTaskModalOpen(true);
  };

  return (
    <div id="homeSection" className="dashboard-wrapper section-page">
      <section className="dashboard-header">
        <div>
          <h1>Good morning!</h1>
          <p>Let's make today productive.</p>
        </div>
        <div className="dashboard-header-actions">
          <button type="button" className="btn btn-primary" onClick={openAddTask}>+ Add task</button>
        </div>
      </section>

      <section className="dashboard-panel dashboard-today-panel">
        <div className="panel-header">
          <div>
            <h2>Today</h2>
            <p>Tasks that need your attention now.</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => setActiveSection('tasks')}>View tasks</button>
        </div>
        {todayTasks.length > 0 ? (
          <div className="dashboard-today-list">
            {todayTasks.map(({ task, catIndex, taskIndex }) => <div className="dashboard-today-item" key={`${catIndex}-${taskIndex}`}><span className="dashboard-today-dot" />{task.name}</div>)}
          </div>
        ) : (
          <p className="dashboard-empty-copy">No pending tasks for today.</p>
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
