import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Task } from '../../context/AppContext';
import { useTasks } from '../../hooks/useTasks';

export const Tasks: React.FC = () => {
  const { appData, setTaskModalOpen, setCurrentCategoryIndex, setEditingTask } = useAppContext();
  const { toggleTask, toggleSubtask, deleteTask, deleteCategory, addCategory } = useTasks();

  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [search, setSearch] = useState('');

  const filterTask = (task: Task) => {
    const matchFilter = 
      (filter === "all") ||
      (filter === "done" && task.done) ||
      (filter === "pending" && !task.done);

    const keyword = search.toLowerCase();
    const matchSearch =
      !keyword ||
      ((task.name || "").toLowerCase().includes(keyword) ||
       (task.note || "").toLowerCase().includes(keyword) ||
       (task.location || "").toLowerCase().includes(keyword));

    return matchFilter && matchSearch;
  };

  const handleAddTask = (catIndex: number) => {
    setCurrentCategoryIndex(catIndex);
    setTaskModalOpen(true);
  };

  const handleEditTask = (catIndex: number, taskIndex: number) => {
    setEditingTask({ catIndex, taskIndex });
    setTaskModalOpen(true);
  };

  const renderDeadline = (deadline: string) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline + "T00:00:00");
    const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      return <div className="deadline-warning overdue">⚠️ Deadline passed</div>;
    } else if (diff === 0) {
      return <div className="deadline-warning">⏰ Deadline today</div>;
    } else {
      return <div className="deadline-warning">📅 {diff} days left</div>;
    }
  };

  // Check if any task matches filters
  let hasVisibleTasks = false;
  appData.forEach(cat => {
    cat.tasks?.forEach(task => {
      if (filterTask(task)) hasVisibleTasks = true;
    });
  });

  return (
    <div id="tasksSection" className="tasks-wrapper section-page" style={{ display: 'block' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1>☑ Tasks</h1>
          <p>Manage and track your tasks</p>
        </div>
      </div>

      <div className="search-box" style={{ display: 'block', marginBottom: '20px' }}>
        <input
          type="text"
          id="searchInput"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="dashboard-panel tasks-panel">
        <div className="panel-header">
          <h2>Active Tasks</h2>
        </div>
        <div className="panel-tabs">
          <button type="button" className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>All</button>
          <button type="button" className={filter === 'pending' ? 'is-active' : ''} onClick={() => setFilter('pending')}>Pending</button>
          <button type="button" className={filter === 'done' ? 'is-active' : ''} onClick={() => setFilter('done')}>Done</button>
        </div>

        <div id="container">
          {appData.map((category, catIndex) => {
            const visibleTasks = category.tasks?.filter(filterTask) || [];
            
            // Only hide category if it has no tasks at all? Legacy app renders the category even if empty if it has 'Add Task' btn.
            // Wait, let's render all categories so we can add tasks to them.

            return (
              <div key={catIndex} className="category">
                <div className="category-header">
                  <h2>{category.name}</h2>
                  <div>
                    <button onClick={() => {
                      const newName = window.prompt("Enter new category name:", category.name);
                      if (newName) {
                        // we need to edit category, wait, let's just do it inline here or add to useTasks
                      }
                    }}>✏️</button>
                    <button onClick={() => deleteCategory(catIndex)}>🗑</button>
                  </div>
                </div>

                <div>
                  {visibleTasks.map((task) => {
                    // We need original task index for editing/toggling
                    const originalTaskIndex = category.tasks.indexOf(task);
                    
                    return (
                      <div key={originalTaskIndex} className={`task ${task.done ? "done" : ""} ${task.priority || "low"}-priority`} draggable>
                        <div className="task-left">
                          <input 
                            type="checkbox" 
                            checked={task.done} 
                            onChange={() => toggleTask(catIndex, originalTaskIndex)} 
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{task.name}</span>
                              {task.time && <span className="task-time-badge">⏰ {task.time}</span>}
                            </div>
                            
                            {renderDeadline(task.deadline)}

                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="task-subtasks">
                                {task.subtasks.map((sub, subIndex) => (
                                  <div key={subIndex} className={`subtask-row ${sub.done ? "done" : ""}`}>
                                    <input 
                                      type="checkbox" 
                                      checked={sub.done} 
                                      onChange={() => toggleSubtask(catIndex, originalTaskIndex, subIndex)} 
                                    />
                                    <span>{sub.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {task.tags && task.tags.length > 0 && (
                              <div className="task-tags">
                                {task.tags.map((tag, tagIndex) => (
                                  <span key={tagIndex} className="tag-item">#{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="task-right">
                          <button onClick={() => handleEditTask(catIndex, originalTaskIndex)}>✏️</button>
                          <button onClick={() => deleteTask(catIndex, originalTaskIndex)}>🗑</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => handleAddTask(catIndex)}>+ Add Task</button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            type="button" 
            className="btn" 
            style={{ padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px dashed var(--border-color)', color: 'var(--text-color)', width: '100%', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => {
              const name = window.prompt("Enter new category name:");
              if (name && name.trim()) {
                addCategory(name.trim());
              }
            }}
          >
            + Create New Category
          </button>
        </div>

        {!hasVisibleTasks && appData.length > 0 && (
          <div className="empty-state tasks-empty-state">
            <div className="empty-state__icon">✓</div>
            <h3 className="empty-state__title">No Tasks Yet</h3>
            <p className="empty-state__description">Create your first task to get started on your productivity journey.</p>
            <button id="emptyAddTaskBtn" type="button" className="btn empty-state__cta" onClick={() => handleAddTask(0)}>＋ Add Task</button>
          </div>
        )}

      </div>
    </div>
  );
};
