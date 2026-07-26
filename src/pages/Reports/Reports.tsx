import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import { useHabitContext } from '../../context/HabitContext';
import './Reports.css';

export const Reports: React.FC = () => {
  const { historyData, setActiveSection } = useAppContext();
  const { appData } = useTaskContext();
  const { habits, habitHistory } = useHabitContext();

  const hasData = useMemo(() => {
    const hasTasks = appData.some(cat => cat.tasks && cat.tasks.length > 0);
    const hasHabits = habits && habits.length > 0;
    return hasTasks || hasHabits;
  }, [appData, habits]);

  const progressRing = useMemo(() => {
    let total = 0;
    let done = 0;
    appData.forEach(cat => {
      cat.tasks?.forEach(task => {
        total++;
        if (task.done) done++;
      });
    });
    const percent = total ? Math.round((done / total) * 100) : 0;
    const offset = 440 - (440 * percent) / 100;
    return { percent, offset };
  }, [appData]);

  const improveStats = useMemo(() => {
    const dates = Object.keys(historyData || {});
    let dailyText = "There is no data today";
    let weeklyText = "There is no weekly data yet";

    if (dates.length >= 2) {
      const today = new Date();
      const todayKey = today.toISOString().split("T")[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split("T")[0];

      const todayValue = historyData[todayKey] || 0;
      const yesterdayValue = historyData[yesterdayKey] || 0;
      const diff = todayValue - yesterdayValue;

      if (diff > 0) {
        dailyText = `🔥 Today ${diff}% is better than yesterday`;
      } else if (diff < 0) {
        dailyText = `📉 Today down ${Math.abs(diff)}%`;
      } else {
        dailyText = `⚖️ progress is the same as yesterday`;
      }

      const values = Object.values(historyData) as number[];
      const last7 = values.slice(-7);
      const prev7 = values.slice(-14, -7);

      const avg1 = last7.length ? Math.round(last7.reduce((a, b) => a + b, 0) / last7.length) : 0;
      const avg2 = prev7.length ? Math.round(prev7.reduce((a, b) => a + b, 0) / prev7.length) : 0;

      if (last7.length > 0 && prev7.length > 0) {
        const wDiff = avg1 - avg2;
        if (wDiff > 0) {
          weeklyText = `📈 This week is ${wDiff}% better than last week`;
        } else if (wDiff < 0) {
          weeklyText = `📉 This week down ${Math.abs(wDiff)}% from last week`;
        } else {
          weeklyText = `⚖️ Weekly progress is stable`;
        }
      }
    }

    return { dailyText, weeklyText };
  }, [historyData]);

  const { tasksChartData, habitsChartData } = useMemo(() => {
    const tasksData = [];
    const habitsData = [];
    const totalHabits = habits ? habits.length : 0;

    // Helper agar konsisten dengan getToday() di useTasks.ts (Local Time)
    const getLocalDateString = (dateObj: Date) => {
      return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
    };

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = getLocalDateString(d);
      const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;

      const tVal = historyData ? (historyData[dateKey] || 0) : 0;
      tasksData.push({ label: shortDate, value: tVal });

      let completedHabits = 0;
      if (habitHistory) {
        Object.values(habitHistory).forEach((dates: string[]) => {
          if (Array.isArray(dates) && dates.includes(dateKey)) {
            completedHabits++;
          }
        });
      }
      const hVal = totalHabits ? Math.round((completedHabits / totalHabits) * 100) : 0;
      habitsData.push({ label: shortDate, value: hVal });
    }

    return { tasksChartData: tasksData, habitsChartData: habitsData };
  }, [historyData, habitHistory, habits]);

  if (!hasData) {
    return (
      <div id="statsSection" className="section-page">
        <div id="statsEmptyState" className="empty-state">
          <div className="empty-state__icon">📊</div>
          <h3 className="empty-state__title">No Analytics Yet</h3>
          <p className="empty-state__description">Complete tasks and build habits to generate your productivity reports.</p>
          <button 
            className="empty-state__cta" 
            id="statsGoToDashboardBtn"
            onClick={() => setActiveSection('home')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="statsSection" className="section-page">
      <div id="statsContent">
        <div className="improve-card">
          <h3 id="dailyImprove">{improveStats.dailyText}</h3>
          <p id="weeklyImprove">{improveStats.weeklyText}</p>
        </div>

        <div className="progress-ring-box">
          <svg className="progress-ring" width="180" height="180">
            <circle className="ring-bg" cx="90" cy="90" r="70" />
            <circle 
              className="ring-progress" 
              cx="90" cy="90" r="70" 
              id="progressRing"
              style={{ strokeDashoffset: progressRing.offset }}
            />
          </svg>
          <div className="ring-text">
            <h2 id="ringPercent">{progressRing.percent}%</h2>
            <p>Today's Score</p>
          </div>
        </div>

        <h2>📊 Statistics</h2>
        <div className="chart-box" id="statsChartBox">
          <div className="chart-container">
            {tasksChartData.map((d, idx) => (
              <div className="chart-bar-wrapper" key={idx}>
                <div className="chart-bar-track">
                  <div className="chart-bar" style={{ height: `${d.value}%` }} title={`${d.value}%`} />
                </div>
                <span className="chart-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <h2>🔥 Habit Statistics</h2>
        <div className="chart-box" id="habitChartBox">
          <div className="chart-container">
            {habitsChartData.map((d, idx) => (
              <div className="chart-bar-wrapper" key={idx}>
                <div className="chart-bar-track">
                  <div className="chart-bar" style={{ height: `${d.value}%`, backgroundColor: 'var(--color-success)' }} title={`${d.value}%`} />
                </div>
                <span className="chart-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
