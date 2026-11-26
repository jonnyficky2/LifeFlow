import React, { useMemo } from 'react';
import { Icon } from '../../components/ui/Icon';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import { useHabitContext } from '../../context/HabitContext';
import { useNoteContext } from '../../context/NoteContext';
import { useTasks } from '../../hooks/useTasks';
import { useHabits } from '../../hooks/useHabits';
import { useAuth } from '../../context/AuthContext';
import type { Task } from '../../types';
import './Dashboard.css';

const getLocalDateString = (dateObj: Date) => {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
};

export const Dashboard: React.FC = () => {
  const { xp, setActiveSection } = useAppContext();
  const { appData, setTaskModalOpen, setCurrentCategoryIndex, setEditingTask } = useTaskContext();
  const { habits, habitHistory } = useHabitContext();
  const { notes, setActiveNoteId } = useNoteContext();
  const { toggleTask } = useTasks();
  const { toggleHabitDate } = useHabits();
  const { user } = useAuth();

  const todayStr = useMemo(() => getLocalDateString(new Date()), []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17) timeGreeting = 'Good evening';
    const name = user?.displayName ? user.displayName.split(' ')[0] : '';
    return name ? `${timeGreeting}, ${name}!` : `${timeGreeting}!`;
  }, [user]);

  const stats = useMemo(() => {
    let pending = 0;
    let done = 0;
    appData.forEach(cat => {
      cat.tasks?.forEach(t => (t.done ? done++ : pending++));
    });
    return { pending, done, total: pending + done };
  }, [appData]);

  const todayHabits = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 Sun - 6 Sat
    const dayOfMonth = today.getDate(); // 1 - 31

    return habits.filter(h => {
      if (!h.repeat || h.repeat.type === 'daily') return true;
      if (h.repeat.type === 'weekly') return true;
      if (h.repeat.type === 'custom') {
        return h.repeat.customDays ? h.repeat.customDays.includes(dayOfWeek) : true;
      }
      if (h.repeat.type === 'monthly') {
        return h.repeat.customDate ? h.repeat.customDate === dayOfMonth : true;
      }
      return true;
    });
  }, [habits]);

  const habitCompletion = useMemo(() => {
    const total = todayHabits.length;
    if (total === 0) return 0;
    const completed = todayHabits.filter(h => (habitHistory[h.id] || []).includes(todayStr)).length;
    return Math.round((completed / total) * 100);
  }, [todayHabits, habitHistory, todayStr]);

  const todayTasks = useMemo(() => {
    const list: { task: Task; catIndex: number; taskIndex: number; categoryName: string }[] = [];
    appData.forEach((cat, catIndex) => {
      cat.tasks?.forEach((task, taskIndex) => {
        if (!task.done && (task.deadline === todayStr || (task.deadline && task.deadline < todayStr))) {
          list.push({ task, catIndex, taskIndex, categoryName: cat.name });
        }
      });
    });
    return list;
  }, [appData, todayStr]);

  const todayNotes = useMemo(() => {
    return notes.filter(n => {
      const createdDate = n.createdAt ? n.createdAt.split('T')[0] : '';
      return n.deadline === todayStr || createdDate === todayStr;
    }).slice(0, 5);
  }, [notes, todayStr]);

  return (
    <div className="dashboard-wrapper">
      <section className="dashboard-header">
        <div>
          <h1>{greeting}</h1>
          <p>Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="btn btn-primary" onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}>+ Add Task</button>
        </div>
      </section>

      <section className="dashboard-stats-overview">
        <div className="dashboard-ring-card">
          <div className="dashboard-ring-container">
            <svg className="dashboard-ring-svg" width="140" height="140">
              <circle className="dashboard-ring-bg" cx="70" cy="70" r="60" />
              <circle className="dashboard-ring-fill" cx="70" cy="70" r="60" style={{ strokeDashoffset: 377 - (377 * (stats.total > 0 ? (stats.done / stats.total) * 100 : 0) / 100) }} />
            </svg>
            <div className="dashboard-ring-label">
              <span className="dashboard-ring-percent">{stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%</span>
              <span className="dashboard-ring-caption">Tasks</span>
            </div>
          </div>
          <p className="dashboard-ring-detail">{stats.done} of {stats.total} completed</p>
        </div>

        <div className="dashboard-metric-cards-grid">
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-top">
              <p className="dashboard-metric-title">Habits</p>
              <Icon name="habits" size={18} className="dashboard-metric-icon" />
            </div>
            <div>
              <p className="dashboard-metric-value">{habitCompletion}%</p>
              <p className="dashboard-metric-subtext">Consistency</p>
            </div>
            <div className="dashboard-mini-bar"><div className="dashboard-mini-bar-fill dashboard-mini-bar-fill--success" style={{ width: `${habitCompletion}%` }} /></div>
          </div>
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-top">
              <p className="dashboard-metric-title">Tasks</p>
              <Icon name="tasks" size={18} className="dashboard-metric-icon" />
            </div>
            <div>
              <p className="dashboard-metric-value">{todayTasks.length}</p>
              <p className="dashboard-metric-subtext">Due today</p>
            </div>
            <div className="dashboard-mini-bar"><div className="dashboard-mini-bar-fill" style={{ width: '100%' }} /></div>
          </div>
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-top">
              <p className="dashboard-metric-title">Notes</p>
              <Icon name="notes" size={18} className="dashboard-metric-icon" />
            </div>
            <div>
              <p className="dashboard-metric-value">{todayNotes.length}</p>
              <p className="dashboard-metric-subtext">Recent today</p>
            </div>
            <div className="dashboard-mini-bar"><div className="dashboard-mini-bar-fill" style={{ width: '100%' }} /></div>
          </div>
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-top">
              <p className="dashboard-metric-title">XP</p>
              <Icon name="zap" size={18} className="dashboard-metric-icon" />
            </div>
            <div>
              <p className="dashboard-metric-value">{xp}</p>
              <p className="dashboard-metric-subtext">Total progress</p>
            </div>
            <div className="dashboard-mini-bar"><div className="dashboard-mini-bar-fill" style={{ width: `${Math.min(100, (xp % 100))}%` }} /></div>
          </div>
        </div>
      </section>

      <section className="dashboard-today-section">
        {/* Tasks Col */}
        <div className="dashboard-today-col">
          <div className="dashboard-col-header">
            <div className="dashboard-col-title-group">
              <h2 className="dashboard-col-title">Today's Tasks</h2>
              <span className="dashboard-col-badge">{todayTasks.length}</span>
            </div>
          </div>
          <div className="dashboard-today-items">
            {todayTasks.map(({ task, catIndex, taskIndex, categoryName }) => (
              <div key={`${catIndex}-${taskIndex}`} className="today-task-card">
                <input 
                  type="checkbox" 
                  className="today-checkbox" 
                  checked={task.done} 
                  onChange={() => toggleTask(catIndex, taskIndex)}
                  aria-label={`Mark task ${task.name} as done`}
                />
                <div className="today-item-body">
                  <h3 
                    className="today-item-title" 
                    onClick={() => {
                      setEditingTask({ catIndex, taskIndex });
                      setCurrentCategoryIndex(catIndex);
                      setTaskModalOpen(true);
                    }}
                  >
                    {task.name}
                  </h3>
                  <div className="today-item-meta">
                    {task.time && <span className="today-tag today-tag--time"><Icon name="clock" size={11} /> {task.time}</span>}
                    <span className="today-tag today-tag--category">{categoryName}</span>
                    {task.priority && task.priority !== 'low' && (
                      <span className={`today-tag ${task.priority === 'high' ? 'today-tag--priority-high' : ''}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {todayTasks.length === 0 && <div className="dashboard-col-empty"><p>No tasks due today.</p></div>}
          </div>
          <div className="dashboard-col-footer">
            <button className="dashboard-col-footer-link" onClick={() => setActiveSection('tasks')}>View all tasks →</button>
          </div>
        </div>

        {/* Habits Col */}
        <div className="dashboard-today-col">
          <div className="dashboard-col-header">
            <div className="dashboard-col-title-group">
              <h2 className="dashboard-col-title">Today's Habits</h2>
              <span className="dashboard-col-badge">
                {todayHabits.filter(h => (habitHistory[h.id] || []).includes(todayStr)).length}/{todayHabits.length}
              </span>
            </div>
          </div>
          <div className="dashboard-today-items">
            {todayHabits.map(habit => {
              const isDone = (habitHistory[habit.id] || []).includes(todayStr);
              return (
                <div key={habit.id} className={`today-habit-card ${isDone ? 'is-done' : ''}`}>
                  <input
                    type="checkbox"
                    className="today-checkbox"
                    checked={isDone}
                    onChange={() => toggleHabitDate(habit.id, todayStr)}
                    aria-label={`Check habit ${habit.name}`}
                  />
                  <div className="today-habit-icon">
                    <Icon name={(habit.icon as any) || 'target'} size={15} />
                  </div>
                  <div className="today-item-body">
                    <h3 className="today-item-title">{habit.name}</h3>
                    <div className="today-item-meta">
                      {habit.category && (
                        <span className="today-tag today-tag--category">{habit.category}</span>
                      )}
                      {habit.time && (
                        <span className="today-tag today-tag--time">
                          <Icon name="clock" size={11} /> {habit.time}
                        </span>
                      )}
                      {habit.targetValue && (
                        <span className="today-tag">
                          <Icon name="target" size={11} /> {habit.targetValue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {todayHabits.length === 0 && <div className="dashboard-col-empty"><p>No habits scheduled today.</p></div>}
          </div>
          <div className="dashboard-col-footer">
            <button className="dashboard-col-footer-link" onClick={() => setActiveSection('habits')}>Manage habits →</button>
          </div>
        </div>

        {/* Notes Col */}
        <div className="dashboard-today-col">
          <div className="dashboard-col-header">
            <div className="dashboard-col-title-group">
              <h2 className="dashboard-col-title">Today's Notes</h2>
              <span className="dashboard-col-badge">{todayNotes.length}</span>
            </div>
          </div>
          <div className="dashboard-today-items">
            {todayNotes.map(note => (
              <div 
                key={note.id} 
                className="today-note-card" 
                onClick={() => {
                  setActiveNoteId(note.id);
                  setActiveSection('notes');
                }}
              >
                <h3 className="today-note-title">{note.title || 'Untitled Note'}</h3>
                <p className="today-note-snippet">{note.content ? note.content.substring(0, 80) : 'Empty note...'}</p>
              </div>
            ))}
            {todayNotes.length === 0 && <div className="dashboard-col-empty"><p>No notes for today.</p></div>}
          </div>
          <div className="dashboard-col-footer">
            <button className="dashboard-col-footer-link" onClick={() => setActiveSection('notes')}>View all notes →</button>
          </div>
        </div>
      </section>
    </div>
  );
};
