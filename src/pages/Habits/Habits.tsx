import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useHabits } from '../../hooks/useHabits';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import './Habits.css';

export const Habits: React.FC = () => {
  const { habits, habitHistory, isAppLoading } = useAppContext();
  const { addHabit, deleteHabit, toggleHabitDate, getCompletionRate } = useHabits();

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
    const name = window.prompt("Enter new habit name (e.g. Reading, Workout):");
    if (name && name.trim()) {
      const icon = window.prompt("Enter an emoji icon for this habit:", "🎯") || "🎯";
      addHabit(name.trim(), 'var(--primary-color)', icon);
    }
  };

  return (
    <div className="habits-wrapper section-page" style={{ display: 'flex' }}>
      <div className="habits-header">
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🌱 Habit Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Build consistency, one day at a time.</p>
        </div>
        <button className="btn" onClick={handleCreateHabit}>+ New Habit</button>
      </div>

      <div className="habits-list">
        {isAppLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="habit-row" style={{ padding: '24px' }}>
              <div className="habit-row-header" style={{ border: 'none' }}>
                <div className="habit-info">
                  <Skeleton type="circle" width={48} height={48} />
                  <div>
                    <Skeleton type="title" width={120} />
                    <Skeleton type="text" width={180} />
                  </div>
                </div>
              </div>
              <Skeleton type="block" height={100} style={{ marginTop: '16px', borderRadius: '12px' }} />
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
                    <button onClick={() => {
                      if (window.confirm(`Delete habit "${habit.name}"? This action cannot be undone.`)) {
                        deleteHabit(habit.id);
                      }
                    }}>🗑</button>
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
                                return <div key={`empty-${rowIdx}`} style={{ width: '14px', height: '14px' }}></div>;
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
    </div>
  );
};
