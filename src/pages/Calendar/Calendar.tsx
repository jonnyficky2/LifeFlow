import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Calendar.css';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar: React.FC = () => {
  const { appData, setTaskModalOpen, setEditingTask } = useAppContext();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Extract all tasks with their original indices for editing
  const allTasks = useMemo(() => {
    const tasksWithIndices: Array<any> = [];
    appData.forEach((cat, catIndex) => {
      cat.tasks?.forEach((task, taskIndex) => {
        tasksWithIndices.push({ ...task, catIndex, taskIndex });
      });
    });
    return tasksWithIndices;
  }, [appData]);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleTaskClick = (e: React.MouseEvent, catIndex: number, taskIndex: number) => {
    e.stopPropagation(); // Prevent triggering cell selection
    setEditingTask({ catIndex, taskIndex });
    setTaskModalOpen(true);
  };

  // Generate calendar cells
  const cells = [];
  // Padding for previous month
  for (let i = 0; i < firstDay; i++) {
    cells.push({ type: 'empty', key: `empty-${i}` });
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Find tasks for this day
    const dayTasks = allTasks.filter(t => t.deadline === dateString);
    
    cells.push({ 
      type: 'day', 
      key: dateString, 
      day, 
      dateString,
      tasks: dayTasks
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Selected date tasks
  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    return allTasks.filter(t => t.deadline === selectedDate);
  }, [selectedDate, allTasks]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>&lt; Prev</button>
        <h2>
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <button className="calendar-nav-btn" onClick={nextMonth}>Next &gt;</button>
      </div>

      <div className="calendar-grid-header">
        {DAY_NAMES.map(name => (
          <div key={name} className="calendar-day-name">{name}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map(cell => {
          if (cell.type === 'empty') {
            return <div key={cell.key} className="calendar-cell is-empty"></div>;
          }

          const isToday = cell.dateString === todayStr;
          const isSelected = cell.dateString === selectedDate;

          return (
            <div 
              key={cell.key} 
              className={`calendar-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
              onClick={() => setSelectedDate(cell.dateString as string)}
            >
              <div className="calendar-date-number">{cell.day}</div>
              <div className="calendar-task-wrapper">
                {cell.tasks?.slice(0, 3).map((task, idx) => (
                  <div 
                    key={idx} 
                    className={`calendar-task-indicator priority-${task.priority || 'low'}`}
                    onClick={(e) => handleTaskClick(e, task.catIndex, task.taskIndex)}
                    style={{ cursor: 'pointer' }}
                  >
                    {task.name}
                  </div>
                ))}
                {(cell.tasks?.length || 0) > 3 && (
                  <div className="calendar-more-tasks">+{(cell.tasks?.length || 0) - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="calendar-selected-details">
          <h3>Tasks for {selectedDate}</h3>
          
          {selectedTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedTasks.map((t, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '12px', 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleTaskClick(e, t.catIndex, t.taskIndex)}
                >
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                  }} className={`priority-${t.priority || 'low'}`}></div>
                  <span style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-secondary)' : 'var(--text-color)' }}>
                    {t.name}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>✏️ Edit</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="calendar-empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <p>No tasks due on this date.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
