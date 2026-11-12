import { Icon } from '../../components/ui/Icon';
import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import { useHabitContext } from '../../context/HabitContext';
import './Reports.css';

export const Reports: React.FC = () => {
  const { historyData, setActiveSection } = useAppContext();
  const { appData } = useTaskContext();
  const { habits, habitHistory } = useHabitContext();
  const hasData = useMemo(() => appData.some(cat => (cat.tasks?.length ?? 0) > 0) || habits.length > 0, [appData, habits]);
  const progress = useMemo(() => { const all = appData.flatMap(c => c.tasks ?? []); const done = all.filter(t => t.done).length; return { percent: all.length ? Math.round(done / all.length * 100) : 0 }; }, [appData]);
  const chartData = useMemo(() => {
    const date = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return Array.from({ length: 7 }, (_, index) => { const d = new Date(); d.setDate(d.getDate() - 6 + index); const key = date(d); const values = Object.values(habitHistory); const completed = values.filter(days => days.includes(key)).length; return { label: `${d.getDate()}/${d.getMonth() + 1}`, tasks: historyData[key] || 0, habits: habits.length ? Math.round(completed / habits.length * 100) : 0 }; });
  }, [historyData, habitHistory, habits]);

  if (!hasData) return <div id="statsSection" className="section-page"><div className="empty-state"><div className="empty-state__icon"><Icon name="chart" /></div><h3 className="empty-state__title">No Analytics Yet</h3><p className="empty-state__description">Complete tasks and build habits to generate your productivity reports.</p><button className="empty-state__cta" onClick={() => setActiveSection('home')}>Go to Dashboard</button></div></div>;

  const renderProgress = (key: 'tasks' | 'habits', success = false) => <div className="progress-list">{chartData.map(d => <div className="progress-row" key={d.label}><span className="progress-label">{d.label}</span><div className="progress-track"><div className={`progress-fill ${success ? 'progress-fill--success' : ''}`} style={{ width: `${d[key]}%` }} /></div><strong>{d[key]}%</strong></div>)}</div>;

  return <div id="statsSection" className="section-page"><div id="statsContent"><div className="progress-ring-box"><svg className="progress-ring" width="180" height="180"><circle className="ring-bg" cx="90" cy="90" r="70" /><circle className="ring-progress" cx="90" cy="90" r="70" style={{ strokeDashoffset: 440 - 440 * progress.percent / 100 }} /></svg><div className="ring-text"><h2>{progress.percent}%</h2><p>Overall completion</p></div></div><h2><Icon name="chart" /> Statistics</h2><div className="chart-box">{renderProgress('tasks')}</div><h2><Icon name="habits" /> Habit Statistics</h2><div className="chart-box">{renderProgress('habits', true)}</div></div></div>;
};
