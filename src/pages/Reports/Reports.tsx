import React, { useMemo, useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import { useHabitContext } from '../../context/HabitContext';
import './Reports.css';

export const Reports: React.FC = () => {
  const { historyData, setActiveSection } = useAppContext();
  const { appData } = useTaskContext();
  const { habits, habitHistory } = useHabitContext();

  const [activeTab, setActiveTab] = useState<'tasks' | 'habits'>('tasks');

  const hasData = useMemo(() => appData.some(cat => (cat.tasks?.length ?? 0) > 0) || habits.length > 0, [appData, habits]);

  const progress = useMemo(() => {
    const all = appData.flatMap(c => c.tasks ?? []);
    const done = all.filter(t => t.done).length;
    return { percent: all.length ? Math.round((done / all.length) * 100) : 0 };
  }, [appData]);

  const chartData = useMemo(() => {
    const dateStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date();
      d.setDate(d.getDate() - 6 + index);
      const key = dateStr(d);
      const values = Object.values(habitHistory);
      const completedHabits = values.filter(days => days.includes(key)).length;
      return {
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: historyData[key] || 0,
        habits: habits.length ? Math.round((completedHabits / habits.length) * 100) : 0,
      };
    });
  }, [historyData, habitHistory, habits]);

  if (!hasData) {
    return (
      <div id="statsSection" className="section-page">
        <div className="empty-state">
          <div className="empty-state__icon"><Icon name="chart" /></div>
          <h3 className="empty-state__title">No Analytics Yet</h3>
          <p className="empty-state__description">Complete tasks and build habits to generate your productivity reports.</p>
          <button className="empty-state__cta" onClick={() => setActiveSection('home')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  // Calculate SVG dimensions & points
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const renderCurvedChart = (dataKey: 'tasks' | 'habits', strokeColor: string, gradientId: string) => {
    const values = chartData.map(d => d[dataKey]);
    const maxValue = Math.max(...values, 100);

    const points = chartData.map((d, i) => {
      const x = paddingX + i * (graphWidth / (chartData.length - 1));
      const val = d[dataKey];
      const y = height - paddingY - (val / maxValue) * graphHeight;
      return { x, y, val, dayName: d.dayName };
    });

    let dLine = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      dLine += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const dArea = `${dLine} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} className="svg-grid-line" />
        <line x1={paddingX} y1={paddingY + graphHeight / 2} x2={width - paddingX} y2={paddingY + graphHeight / 2} className="svg-grid-line" />
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} className="svg-grid-line" />

        <path d={dArea} fill={`url(#${gradientId})`} />
        <path d={dLine} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />

        {points.map((pt, idx) => (
          <g key={idx} className="svg-node-group">
            <circle cx={pt.x} cy={pt.y} r="5" className="svg-node-dot" style={{ stroke: 'var(--color-surface)' }} />
            <text x={pt.x} y={pt.y - 12} textAnchor="middle" className="svg-node-val" style={{ fill: strokeColor }}>
              {pt.val}%
            </text>
            <text x={pt.x} y={height - 8} textAnchor="middle" className="svg-label-text">
              {pt.dayName}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div id="statsSection" className="section-page">
      <div id="statsContent">
        <div className="reports-header-summary">
          <div className="progress-ring-box">
            <svg className="progress-ring" width="160" height="160">
              <circle className="ring-bg" cx="80" cy="80" r="62" />
              <circle className="ring-progress" cx="80" cy="80" r="62" style={{ strokeDashoffset: 390 - (390 * progress.percent) / 100 }} />
            </svg>
            <div className="ring-text">
              <h2>{progress.percent}%</h2>
              <p>Overall completion</p>
            </div>
          </div>

          <div className="reports-tab-switch">
            <button
              className={`reports-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <Icon name="tasks" size={16} /> Tasks Trend
            </button>
            <button
              className={`reports-tab-btn ${activeTab === 'habits' ? 'active' : ''}`}
              onClick={() => setActiveTab('habits')}
            >
              <Icon name="habits" size={16} /> Habits Consistency
            </button>
          </div>
        </div>

        <div className="chart-preview-list">
          <div className="chart-option-card">
            <div className="chart-option-header">
              <span className="chart-option-badge">
                {activeTab === 'tasks' ? '7-Day Task Completion' : '7-Day Habit Consistency'}
              </span>
              <h3>Smooth Curved Area Chart</h3>
              <p className="chart-option-desc">
                {activeTab === 'tasks' 
                  ? 'Visualisasi tren penyelesaian tugas selama 7 hari terakhir.' 
                  : 'Visualisasi konsistensi rutinitas kebiasaan selama 7 hari terakhir.'}
              </p>
            </div>
            <div className="svg-chart-container">
              {activeTab === 'tasks'
                ? renderCurvedChart('tasks', 'var(--color-primary)', 'tasksGradient')
                : renderCurvedChart('habits', 'var(--color-success)', 'habitsGradient')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
