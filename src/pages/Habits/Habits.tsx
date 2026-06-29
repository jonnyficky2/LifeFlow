import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useHabits } from '../../hooks/useHabits';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import './Habits.css';

export const Habits: React.FC = () => {
  const { habits, habitHistory, isAppLoading } = useAppContext();
  const { addHabit, deleteHabit, toggleHabitDate, getCompletionRate } = useHabits();

  // Create Habit Modal State
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('🎯');

  // Delete Habit Confirm State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetDeleteHabitId, setTargetDeleteHabitId] = useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Generate 90 days grid grouped by weeks
  const gridColumns = useMemo(() => {
    const daysCount = 90;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysCount + 1);
    
    const startDayOfWeek = startDate.getDay(); // 0 = Sun, 1 = Mon...
    
    const columns: Array<Array<Date | null>> = [];
    let currentColumn: Array<Date | null> = [];
    
    // Pad the first week so days align vertically
    for (let i = 0; i < startDayOfWeek; i++) {
      currentColumn.push(null);
    }
    
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      currentColumn.push(d);
      
      if (currentColumn.length === 7) {
        columns.push(currentColumn);
        currentColumn = [];
      }
    }
    
    if (currentColumn.length > 0) {
      columns.push(currentColumn);
    }
    
    return columns;
  }, []);

  // Helper to format YYYY-MM-DD local time
  const formatDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleCreateHabit = () => {
    setNewHabitName('');
    setNewHabitIcon('🎯');
    setHabitModalOpen(true);
  };

  const handleCreateHabitSubmit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim(), 'var(--primary-color)', newHabitIcon.trim() || '🎯');
      setHabitModalOpen(false);
    }
  };

  const triggerDeleteHabit = (habitId: string, habitName: string) => {
    setTargetDeleteHabitId(habitId);
    setConfirmMessage(`Are you sure you want to delete the habit "${habitName}"? This action cannot be undone.`);
    setConfirmOpen(true);
  };

  return (
    <div className="habits-wrapper section-page">
      <div className="habits-header">
        <div>
          <h1 className="habits-header-title">
            🌱 Habit Tracker
          </h1>
          <p className="habits-header-subtitle">Build consistency, one day at a time.</p>
        </div>
        <button className="btn" onClick={handleCreateHabit}>+ New Habit</button>
      </div>

      <div className="habits-list">
        {isAppLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="habit-row habit-row-skeleton">
              <div className="habit-row-header habit-row-header-border-none">
                <div className="habit-info">
                  <Skeleton type="circle" width={48} height={48} />
                  <div>
                    <Skeleton type="title" width={120} />
                    <Skeleton type="text" width={180} />
                  </div>
                </div>
              </div>
              <Skeleton type="block" height={100} className="habit-skeleton-block" />
            </div>
          ))
        ) : habits.length === 0 ? (
          <EmptyState 
            icon="🌱" 
            title="No Habits Yet" 
            description="Start small. Add a daily habit to track your consistency over time."
          >
            <button className="btn empty-state__cta" onClick={handleCreateHabit}>+ Create First Habit</button>
          </EmptyState>
        ) : (
          habits.map(habit => {
            const completionRate = getCompletionRate(habit.id, 30);
            const historyDates = habitHistory[habit.id] || [];

            return (
              <div key={habit.id} className="habit-row">
                <div className="habit-row-header">
                  <div className="habit-info">
                    <div className="habit-icon">{habit.icon}</div>
                    <div>
                      <h3 className="habit-title">{habit.name}</h3>
                      <div className="habit-stats">
                        30-Day Consistency: <strong>{completionRate}%</strong>
                      </div>
                    </div>
                  </div>
                  <div className="habit-actions">
                    <button aria-label={`Delete habit ${habit.name}`} onClick={() => triggerDeleteHabit(habit.id, habit.name)}>🗑</button>
                  </div>
                </div>

                <div className="habit-grid-container" style={{ '--habit-color': habit.color } as React.CSSProperties}>
                  <div className="habit-grid-scroll-area">
                    {/* Months header can go here if needed, skipping for simplicity */}
                    <div className="habit-grid">
                      <div className="habit-grid-weekdays">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                      </div>
                      
                      <div className="habit-grid-columns">
                        {gridColumns.map((col, colIdx) => (
                          <div key={colIdx} className="habit-grid-column">
                            {col.map((date, rowIdx) => {
                              if (!date) {
                                return <div key={`empty-${rowIdx}`} className="habit-cell-placeholder"></div>;
                              }
                              
                              const dateStr = formatDateString(date);
                              const isCompleted = historyDates.includes(dateStr);
                              
                              return (
                                <div 
                                  key={dateStr}
                                  className={`habit-cell ${isCompleted ? 'is-completed' : ''}`}
                                  title={`${dateStr}: ${isCompleted ? 'Completed' : 'Not completed'}`}
                                  onClick={() => toggleHabitDate(habit.id, dateStr)}
                                ></div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Habit Modal */}
      {habitModalOpen && (
        <div className="modal show">
          <div className="modal-content" style={{ maxWidth: '450px', padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '20px' }}>Create New Habit</h2>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label htmlFor="habitNameInput">Habit Name</label>
              <input 
                id="habitNameInput"
                type="text" 
                placeholder="e.g. Reading, Workout"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateHabitSubmit()}
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label htmlFor="habitIconInput">Icon (Emoji)</label>
              <input 
                id="habitIconInput"
                type="text" 
                placeholder="e.g. 🎯"
                value={newHabitIcon}
                onChange={(e) => setNewHabitIcon(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateHabitSubmit()}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setHabitModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateHabitSubmit}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmOpen && (
        <div className="modal show">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '24px', borderRadius: '12px' }}>
            <h3>Delete Habit</h3>
            <p style={{ margin: '16px 0', color: 'var(--color-muted)' }}>{confirmMessage}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => {
                if (targetDeleteHabitId) {
                  deleteHabit(targetDeleteHabitId);
                }
                setConfirmOpen(false);
                setTargetDeleteHabitId(null);
              }}>Delete</button>
              <button className="btn btn-secondary" onClick={() => {
                setConfirmOpen(false);
                setTargetDeleteHabitId(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
