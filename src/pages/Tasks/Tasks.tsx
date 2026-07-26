import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import type { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

export const Tasks: React.FC = () => {
  const { isAppLoading } = useAppContext();
  const { appData, setTaskModalOpen, setCurrentCategoryIndex, setEditingTask, setAppData, saveTaskSnapshot } = useTaskContext();
  const { toggleTask, toggleSubtask, deleteTask, deleteCategory, addCategory, addTask } = useTasks();

  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [search, setSearch] = useState('');
  const [inlineTaskNames, setInlineTaskNames] = useState<Record<number, string>>({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Category inline edit states
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatName, setEditingCatName] = useState<string>('');

  // Confirmation modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<'task' | 'category' | null>(null);
  const [targetCatIndex, setTargetCatIndex] = useState<number | null>(null);
  const [targetTaskIndex, setTargetTaskIndex] = useState<number | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const triggerDeleteCategory = (catIndex: number) => {
    setConfirmType('category');
    setTargetCatIndex(catIndex);
    setConfirmMessage(`Are you sure you want to delete the category "${appData[catIndex].name}" and all tasks inside?`);
    setConfirmOpen(true);
  };

  const triggerDeleteTask = (catIndex: number, taskIndex: number) => {
    setConfirmType('task');
    setTargetCatIndex(catIndex);
    setTargetTaskIndex(taskIndex);
    const taskName = appData[catIndex].tasks[taskIndex].name;
    setConfirmMessage(`Are you sure you want to delete the task "${taskName}"?`);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (confirmType === 'category' && targetCatIndex !== null) {
      deleteCategory(targetCatIndex);
    } else if (confirmType === 'task' && targetCatIndex !== null && targetTaskIndex !== null) {
      deleteTask(targetCatIndex, targetTaskIndex);
    }
    setConfirmOpen(false);
    setConfirmType(null);
    setTargetCatIndex(null);
    setTargetTaskIndex(null);
  };

  const handleCreateInlineTask = (catIndex: number) => {
    const val = (inlineTaskNames[catIndex] || '').trim();
    if (val) {
      addTask(catIndex, val);
      setInlineTaskNames(prev => ({ ...prev, [catIndex]: '' }));
    }
  };

  const handleInlineTaskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, catIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateInlineTask(catIndex);
    }
  };

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
    <div id="tasksSection" className="tasks-wrapper section-page">
      <div className="dashboard-header tasks-header-wrapper">
        <div>
          <h1>☑ Tasks</h1>
          <p>Manage and track your tasks</p>
        </div>
      </div>

      <div className="search-box tasks-search-container">
        <input
          type="text"
          id="searchInput"
          placeholder="Search task..."
          aria-label="Search tasks"
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
          {isAppLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="category">
                <Skeleton type="title" width="30%" />
                <Skeleton type="block" height={60} className="tasks-skeleton-row" />
                <Skeleton type="block" height={60} className="tasks-skeleton-row" />
              </div>
            ))
          ) : appData.length === 0 ? (
            <EmptyState 
              icon="📋" 
              title="No Tasks Yet" 
              description="You haven't created any task categories. Add a new category to get started." 
            />
          ) : (
            appData.map((category, catIndex) => {
              const visibleTasks = category.tasks?.filter(filterTask) || [];
              
              return (
              <div key={catIndex} className="category">
                <div className="category-header">
                  {editingCatIndex === catIndex ? (
                    <div style={{ display: 'flex', width: '100%', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={editingCatName} 
                        onChange={(e) => setEditingCatName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (editingCatName.trim()) {
                              saveTaskSnapshot();
                              setAppData(prev => {
                                const newData = [...prev];
                                newData[catIndex].name = editingCatName.trim();
                                return newData;
                              });
                            }
                            setEditingCatIndex(null);
                          } else if (e.key === 'Escape') {
                            setEditingCatIndex(null);
                          }
                        }}
                        autoFocus
                        style={{ flex: 1, height: '36px', padding: '0 8px', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                      />
                      <button className="btn-primary" onClick={() => {
                        if (editingCatName.trim()) {
                          saveTaskSnapshot();
                          setAppData(prev => {
                            const newData = [...prev];
                            newData[catIndex].name = editingCatName.trim();
                            return newData;
                          });
                        }
                        setEditingCatIndex(null);
                      }} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Save</button>
                      <button className="btn-secondary" onClick={() => setEditingCatIndex(null)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <h2>{category.name}</h2>
                      <div>
                        <button aria-label="Edit category" onClick={() => {
                          setEditingCatIndex(catIndex);
                          setEditingCatName(category.name);
                        }}>✏️</button>
                        <button aria-label="Delete category" onClick={() => triggerDeleteCategory(catIndex)}>🗑</button>
                      </div>
                    </>
                  )}
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
                            <div className="tasks-name-row">
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
                          <button aria-label="Edit task" onClick={() => handleEditTask(catIndex, originalTaskIndex)}>✏️</button>
                          <button aria-label="Delete task" onClick={() => triggerDeleteTask(catIndex, originalTaskIndex)}>🗑</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="task-inline-input-container task-inline-input-row">
                  <div className="task-inline-input-wrapper">
                    <input 
                      type="text" 
                      className="inline-task-input"
                      placeholder="What needs to be done today?" 
                      value={inlineTaskNames[catIndex] || ''}
                      onChange={(e) => setInlineTaskNames(prev => ({ ...prev, [catIndex]: e.target.value }))}
                      onKeyDown={(e) => handleInlineTaskKeyDown(e, catIndex)}
                    />

                    <button 
                      type="button"
                      onClick={() => handleCreateInlineTask(catIndex)}
                      title="Add Task"
                      aria-label="Add task"
                      className="inline-task-submit-btn"
                    >
                      +
                    </button>
                  </div>
                  <small className="task-inline-input-tip">
                    Press Enter ↵ to create a task.
                  </small>
                </div>
              </div>
            );
          }))}
        </div>

        <div className="tasks-add-category-wrapper">
          {isAddingCategory ? (
            <div className="add-box tasks-add-category-form">
              <input
                type="text"
                placeholder="Enter category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (newCategoryName.trim()) {
                      addCategory(newCategoryName.trim());
                      setNewCategoryName('');
                      setIsAddingCategory(false);
                    }
                  } else if (e.key === 'Escape') {
                    setIsAddingCategory(false);
                    setNewCategoryName('');
                  }
                }}
                autoFocus
                className="tasks-add-category-input"
              />
              <button 
                type="button"
                className="btn-primary" 
                onClick={() => {
                  if (newCategoryName.trim()) {
                    addCategory(newCategoryName.trim());
                    setNewCategoryName('');
                    setIsAddingCategory(false);
                  }
                }}
              >
                Create
              </button>
              <button 
                type="button"
                className="btn-secondary" 
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="btn task-create-category-btn-dashed"
              onClick={() => setIsAddingCategory(true)}
            >
              + Create New Category
            </button>
          )}
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

      {confirmOpen && (
        <div className="modal show">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '24px', borderRadius: '12px' }}>
            <h3>Confirm Action</h3>
            <p style={{ margin: '16px 0', color: 'var(--color-muted)' }}>{confirmMessage}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>Confirm</button>
              <button className="btn btn-secondary" onClick={() => {
                setConfirmOpen(false);
                setConfirmType(null);
                setTargetCatIndex(null);
                setTargetTaskIndex(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
