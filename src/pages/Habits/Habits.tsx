import React, { useMemo, useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import type { IconName } from '../../components/ui/Icon';
import { useAppContext } from '../../context/AppContext';
import { useHabitContext } from '../../context/HabitContext';
import type { HabitRepeatType, HabitRepeatConfig, Habit } from '../../types';
import { useHabits } from '../../hooks/useHabits';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import './Habits.css';

const HABIT_ICON_NAMES = [
  'target',
  'dumbbell',
  'book',
  'droplets',
  'heart',
  'brain',
  'coffee',
  'bike',
  'sun',
  'moon',
  'footprints',
  'apple',
] as const;

const isHabitIconName = (value: string): value is IconName =>
  (HABIT_ICON_NAMES as readonly string[]).includes(value as IconName);

const getLocalDateString = (dateObj: Date) => {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
};

export const Habits: React.FC = () => {
  const { isAppLoading } = useAppContext();
  const { habits, habitHistory } = useHabitContext();
  const { 
    habitCategories, 
    addCategory, 
    deleteCategory, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    toggleHabitDate 
  } = useHabits();

  const todayStr = useMemo(() => getLocalDateString(new Date()), []);

  // Modal State for Habit (Create / Edit)
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('');
  const [habitCustomCategory, setHabitCustomCategory] = useState('');
  const [habitIcon, setHabitIcon] = useState<string>('target');
  const [habitTime, setHabitTime] = useState('');
  const [habitTargetValue, setHabitTargetValue] = useState('');
  const [repeatType, setRepeatType] = useState<HabitRepeatType>('daily');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [repeatDate, setRepeatDate] = useState<number>(1);

  // Modal State for Category
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Delete Confirm State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState<{ type: 'habit' | 'category'; id: string; name: string } | null>(null);

  // Unified list of categories
  const categoriesList = useMemo(() => {
    const list = [...habitCategories];
    habits.forEach(h => {
      const cat = h.category?.trim();
      if (cat && !list.includes(cat)) {
        list.push(cat);
      }
    });
    if (list.length === 0) {
      list.push('Daily');
    }
    return list;
  }, [habitCategories, habits]);

  // Group habits by category
  const groupedHabits = useMemo(() => {
    const groups: Record<string, Habit[]> = {};
    categoriesList.forEach(cat => {
      groups[cat] = [];
    });

    habits.forEach(h => {
      const cat = h.category?.trim() || categoriesList[0] || 'Daily';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(h);
    });

    return groups;
  }, [categoriesList, habits]);

  const handleOpenAddHabit = (defaultCategory?: string) => {
    setEditingHabitId(null);
    setHabitName('');
    setHabitCategory(defaultCategory || categoriesList[0] || 'Daily');
    setHabitCustomCategory('');
    setHabitIcon('target');
    setHabitTime('');
    setHabitTargetValue('');
    setRepeatType('daily');
    setRepeatDays([]);
    setRepeatDate(1);
    setHabitModalOpen(true);
  };

  const handleOpenEditHabit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setHabitName(habit.name);
    setHabitCategory(habit.category || 'Daily');
    setHabitCustomCategory('');
    setHabitIcon(habit.icon || 'target');
    setHabitTime(habit.time || '');
    setHabitTargetValue(habit.targetValue || '');
    setRepeatType(habit.repeat?.type || 'daily');
    setRepeatDays(habit.repeat?.customDays || []);
    setRepeatDate(habit.repeat?.customDate || 1);
    setHabitModalOpen(true);
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    const finalCategory = habitCategory === '__new__' 
      ? (habitCustomCategory.trim() || 'Daily') 
      : (habitCategory || 'Daily');

    const repeatConfig: HabitRepeatConfig = { type: repeatType };
    if (repeatType === 'custom') repeatConfig.customDays = repeatDays;
    if (repeatType === 'monthly') repeatConfig.customDate = repeatDate;

    if (editingHabitId) {
      updateHabit(editingHabitId, {
        name: habitName.trim(),
        category: finalCategory,
        icon: habitIcon,
        time: habitTime || undefined,
        targetValue: habitTargetValue.trim() || undefined,
        repeat: repeatConfig
      });
    } else {
      addHabit(
        habitName.trim(),
        'var(--primary-color)',
        habitIcon,
        repeatConfig,
        habitTime || undefined,
        finalCategory,
        habitTargetValue.trim() || undefined
      );
    }

    setHabitModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim());
    setNewCategoryName('');
    setCategoryModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!targetDelete) return;
    if (targetDelete.type === 'habit') {
      deleteHabit(targetDelete.id);
    } else if (targetDelete.type === 'category') {
      deleteCategory(targetDelete.id);
    }
    setConfirmOpen(false);
    setTargetDelete(null);
  };

  return (
    <div className="habits-wrapper section-page">
      <div className="habits-header">
        <div>
          <h1 className="habits-header-title">
            <Icon name="habits" size={24} /> Habit Tracker
          </h1>
          <p className="habits-header-subtitle">
            Group your habits into categories, set targets, and check them off daily.
          </p>
        </div>
        <div className="habits-header-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setCategoryModalOpen(true)}
          >
            + New Category
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => handleOpenAddHabit()}
          >
            + Add Habit
          </button>
        </div>
      </div>

      {isAppLoading ? (
        <div className="habit-categories-container">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="habit-category-card">
              <Skeleton type="title" width={160} height={24} />
              <div style={{ marginTop: 12 }}>
                <Skeleton type="block" height={50} />
              </div>
            </div>
          ))}
        </div>
      ) : categoriesList.length === 0 && habits.length === 0 ? (
        <EmptyState
          icon={<Icon name="habits" size={36} />}
          title="No Habit Categories Yet"
          description="Create your first habit category like 'Work Out' or 'Morning Routine' to get started."
        >
          <button 
            className="btn btn-primary empty-state__cta" 
            onClick={() => handleOpenAddHabit('Work Out')}
          >
            + Create First Habit
          </button>
        </EmptyState>
      ) : (
        <div className="habit-categories-container">
          {categoriesList.map(categoryName => {
            const categoryHabits = groupedHabits[categoryName] || [];
            const completedCount = categoryHabits.filter(h => 
              (habitHistory[h.id] || []).includes(todayStr)
            ).length;
            const totalCount = categoryHabits.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div key={categoryName} className="habit-category-card">
                <div className="habit-category-header">
                  <div className="habit-category-title-group">
                    <h2 className="habit-category-name">{categoryName}</h2>
                    <span className={`habit-category-badge ${totalCount > 0 && completedCount === totalCount ? 'habit-category-badge--completed' : ''}`}>
                      {totalCount > 0 ? `${completedCount}/${totalCount} Completed` : '0 Habits'}
                    </span>
                  </div>
                  <div className="habit-category-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenAddHabit(categoryName)}
                      title={`Add habit to ${categoryName}`}
                    >
                      + Add habit
                    </button>
                    {categoriesList.length > 1 && (
                      <button
                        type="button"
                        className="habit-action-btn habit-action-btn--delete"
                        onClick={() => {
                          setTargetDelete({
                            type: 'category',
                            id: categoryName,
                            name: categoryName
                          });
                          setConfirmOpen(true);
                        }}
                        title={`Delete category "${categoryName}"`}
                        aria-label={`Delete category ${categoryName}`}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {totalCount > 0 && (
                  <div className="habit-category-progress-track">
                    <div 
                      className={`habit-category-progress-fill ${percent === 100 ? 'habit-category-progress-fill--full' : ''}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                )}

                {categoryHabits.length === 0 ? (
                  <div className="habit-category-empty">
                    <p>No habits in "{categoryName}" yet.</p>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => handleOpenAddHabit(categoryName)}
                    >
                      + Add habit now
                    </button>
                  </div>
                ) : (
                  <div className="habit-items-list">
                    {categoryHabits.map(habit => {
                      const isCompleted = (habitHistory[habit.id] || []).includes(todayStr);

                      return (
                        <div 
                          key={habit.id} 
                          className={`habit-item ${isCompleted ? 'habit-item--completed' : ''}`}
                        >
                          <div className="habit-item-left">
                            <input
                              type="checkbox"
                              className="habit-checkbox"
                              checked={isCompleted}
                              onChange={() => toggleHabitDate(habit.id, todayStr)}
                              aria-label={`Check habit "${habit.name}"`}
                            />
                            <div className="habit-item-icon">
                              {isHabitIconName(habit.icon) ? (
                                <Icon name={habit.icon} size={18} />
                              ) : (
                                <Icon name="target" size={18} />
                              )}
                            </div>
                            <div className="habit-item-content">
                              <h3 className="habit-item-title">{habit.name}</h3>
                              <div className="habit-item-meta">
                                {habit.time && (
                                  <span className="habit-tag habit-tag--time">
                                    <Icon name="clock" size={12} /> {habit.time}
                                  </span>
                                )}
                                {habit.targetValue && (
                                  <span className="habit-tag habit-tag--target">
                                    <Icon name="target" size={12} /> {habit.targetValue}
                                  </span>
                                )}
                                {habit.repeat && habit.repeat.type !== 'daily' && (
                                  <span className="habit-tag">
                                    {habit.repeat.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="habit-item-right">
                            <button
                              type="button"
                              className="habit-action-btn"
                              onClick={() => handleOpenEditHabit(habit)}
                              title="Edit habit"
                              aria-label={`Edit habit ${habit.name}`}
                            >
                              <Icon name="edit" size={15} />
                            </button>
                            <button
                              type="button"
                              className="habit-action-btn habit-action-btn--delete"
                              onClick={() => {
                                setTargetDelete({
                                  type: 'habit',
                                  id: habit.id,
                                  name: habit.name
                                });
                                setConfirmOpen(true);
                              }}
                              title="Delete habit"
                              aria-label={`Delete habit ${habit.name}`}
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Habit Create/Edit Modal */}
      {habitModalOpen && (
        <div className="modal show" onClick={() => setHabitModalOpen(false)}>
          <div className="modal-content habit-modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingHabitId ? 'Edit Habit' : 'Create Habit'}</h2>
            <form onSubmit={handleSaveHabit}>
              <div className="form-group habit-field">
                <label htmlFor="habitNameInput">Habit Name *</label>
                <input
                  id="habitNameInput"
                  type="text"
                  placeholder="e.g. Push Up, Read Book, Meditate"
                  value={habitName}
                  onChange={e => setHabitName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group habit-field">
                <label htmlFor="habitCategorySelect">Category</label>
                <select
                  id="habitCategorySelect"
                  value={habitCategory}
                  onChange={e => setHabitCategory(e.target.value)}
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__new__">+ Create New Category...</option>
                </select>
              </div>

              {habitCategory === '__new__' && (
                <div className="form-group habit-field">
                  <label htmlFor="newCategoryInput">New Category Name</label>
                  <input
                    id="newCategoryInput"
                    type="text"
                    placeholder="e.g. Work Out, Nutrition"
                    value={habitCustomCategory}
                    onChange={e => setHabitCustomCategory(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="habit-row-grid-2">
                <div className="form-group habit-field">
                  <label htmlFor="habitTimeInput">Time (Jam)</label>
                  <input
                    id="habitTimeInput"
                    type="time"
                    value={habitTime}
                    onChange={e => setHabitTime(e.target.value)}
                  />
                </div>
                <div className="form-group habit-field">
                  <label htmlFor="habitTargetInput">Duration / Value (Nilai)</label>
                  <input
                    id="habitTargetInput"
                    type="text"
                    placeholder="e.g. 50 reps, 30 min, 2L"
                    value={habitTargetValue}
                    onChange={e => setHabitTargetValue(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group habit-field">
                <label>Icon</label>
                <div className="habit-icon-picker">
                  {HABIT_ICON_NAMES.map(iconName => (
                    <button
                      key={iconName}
                      type="button"
                      className={`habit-icon-option ${habitIcon === iconName ? 'selected' : ''}`}
                      onClick={() => setHabitIcon(iconName)}
                      aria-label={`Select icon ${iconName}`}
                    >
                      <Icon name={iconName} size={18} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="habit-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setHabitModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingHabitId ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Create Modal */}
      {categoryModalOpen && (
        <div className="modal show" onClick={() => setCategoryModalOpen(false)}>
          <div className="modal-content habit-modal-content" onClick={e => e.stopPropagation()}>
            <h2>New Habit Category</h2>
            <form onSubmit={handleSaveCategory}>
              <div className="form-group habit-field">
                <label htmlFor="categoryNameInput">Category Name *</label>
                <input
                  id="categoryNameInput"
                  type="text"
                  placeholder="e.g. Work Out, Morning Routine, Learning"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="habit-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCategoryModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmOpen && targetDelete && (
        <div className="modal show" onClick={() => setConfirmOpen(false)}>
          <div className="modal-content habit-modal-content" onClick={e => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p style={{ margin: '8px 0 16px', color: 'var(--text-secondary)' }}>
              {targetDelete.type === 'habit'
                ? `Are you sure you want to delete the habit "${targetDelete.name}"?`
                : `Are you sure you want to delete the category "${targetDelete.name}"? Any habits in it will be moved to Daily.`}
            </p>
            <div className="habit-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
