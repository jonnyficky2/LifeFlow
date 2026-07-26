import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import type { Task } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { quoteManager } from '../../utils/QuoteProvider';

import { getLevelData } from '../../utils/level';

const levelNames = [
  "Rookie", "Grinder", "Focused", "Achiever", "Discipline",
  "Advanced", "Elite", "Mastermind", "Legend", "Monster"
];

const getLocalDateString = (dateObj: Date) => {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
};

export const Dashboard: React.FC = () => {
  const { xp, historyData, isAppLoading } = useAppContext();
  const { appData } = useTaskContext();
  const [quote] = useState(() => quoteManager.getDailyQuote());

  const { level, remainingXP, xpNeeded } = useMemo(() => getLevelData(xp), [xp]);
  const levelName = levelNames[Math.min(level - 1, 9)];
  const xpPercent = (remainingXP / xpNeeded) * 100;

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

  return (
    <div id="homeSection" className="dashboard-wrapper section-page">
      <section className="dashboard-header">
        <div>
          <h1>Good morning! </h1>
          <p>Let's make today productive.</p>
        </div>
      </section>

      {/* LEVEL & XP */}
      <div id="levelBox">
        {isAppLoading ? (
          <>
            <Skeleton type="title" width="40%" />
            <Skeleton type="block" height="22px" className="dashboard-skeleton-xp-bar" />
            <Skeleton type="text" width="20%" className="dashboard-skeleton-text-small" />
          </>
        ) : (
          <>
            <h2 id="levelText">🏆 Level {level} {levelName && `\n${levelName}`}</h2>
            <div className="xp-progress-container">
              <div className="xp-bar">
                <div id="xpFill" style={{ width: `${xpPercent}%` }}></div>
              </div>
              <p id="xpText">{remainingXP} / {xpNeeded} XP</p>
            </div>
          </>
        )}
      </div>

      {/* QUICK STATS */}
      <div id="quickStats" className="quick-stats-grid">
        <div className="stat-card">
          <span className="stat-icon stat-icon-blue">▤</span>
          <div>
            <p>All Tasks</p>
            {isAppLoading ? <Skeleton height={28} width={40} className="dashboard-skeleton-stat-num" /> : <h3 id="allTaskCount">{stats.total}</h3>}
            <small>Total tasks</small>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon stat-icon-yellow">◷</span>
          <div>
            <p>Pending</p>
            {isAppLoading ? <Skeleton height={28} width={40} className="dashboard-skeleton-stat-num" /> : <h3 id="pendingCount">{stats.pending}</h3>}
            <small>Tasks to do</small>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon stat-icon-green">✓</span>
          <div>
            <p>Done</p>
            {isAppLoading ? <Skeleton height={28} width={40} className="dashboard-skeleton-stat-num" /> : <h3 id="doneCount">{stats.done}</h3>}
            <small>Tasks completed</small>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon stat-icon-purple">▣</span>
          <div>
            <p>Today</p>
            {isAppLoading ? <Skeleton height={28} width={40} className="dashboard-skeleton-stat-num" /> : <h3 id="todayCount">{stats.todayTasks}</h3>}
            <small>Tasks for today</small>
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

        <div className="dashboard-side">
          <div id="quoteContainer" className="dashboard-panel motivation-panel">
            <h2>Motivation</h2>
            <p id="quoteText">"{quote.text}"</p>
            <small id="quoteAuthor">- {quote.author}</small>
          </div>
        </div>
      </section>
    </div>
  );
};
