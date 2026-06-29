import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Subtask, Task } from '../../context/AppContext';

export const TaskModal: React.FC = () => {
  const { 
    isTaskModalOpen, 
    setTaskModalOpen, 
    editingTask, 
    setEditingTask, 
    appData, 
    setAppData, 
    currentCategoryIndex,
    saveHistorySnapshot
  } = useAppContext();

  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [deadline, setDeadline] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('low');
  const [tagsInput, setTagsInput] = useState('');
  const [location, setLocation] = useState('');
  const [reminder, setReminder] = useState('none');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // Populate data when editing
  useEffect(() => {
    if (isTaskModalOpen) {
      if (editingTask && appData[editingTask.catIndex]) {
        const task = appData[editingTask.catIndex].tasks[editingTask.taskIndex];
        setName(task.name || '');
        setNote(task.note || '');
        setDeadline(task.deadline || '');
        setTime(task.time || '');
        setPriority(task.priority || 'low');
        setTagsInput(task.tags ? task.tags.join(', ') : '');
        setLocation(task.location || '');
        setReminder(task.reminder || 'none');
        setSubtasks(task.subtasks ? [...task.subtasks] : []);
      } else {
        setName('');
        setNote('');
        setDeadline('');
        setTime('');
        setPriority('low');
        setTagsInput('');
        setLocation('');
        setReminder('none');
        setSubtasks([]);
      }
      setNewSubtaskInput('');
    }
  }, [isTaskModalOpen, editingTask, appData]);

  const handleClose = () => {
    setTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    saveHistorySnapshot();

    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    setAppData(prevData => {
      if (editingTask) {
        return prevData.map((cat, cIdx) => {
          if (cIdx !== editingTask.catIndex) return cat;
          return {
            ...cat,
            tasks: cat.tasks.map((t, tIdx) => {
              if (tIdx !== editingTask.taskIndex) return t;
              return {
                ...t,
                name, deadline, time, location, note, priority, tags, reminder,
                subtasks: [...subtasks]
              };
            })
          };
        });
      } else {
        // Find safe index
        let targetIndex = currentCategoryIndex !== null && currentCategoryIndex >= 0 && currentCategoryIndex < prevData.length 
          ? currentCategoryIndex 
          : 0;

        let baseData = prevData;
        if (baseData.length === 0) {
          baseData = [{ name: 'Inbox', tasks: [] }];
          targetIndex = 0;
        }

        const newTask: Task = {
          name, deadline, time, location, note, priority,
          done: false, completedDates: [], streak: 0, lastCompleted: null,
          subtasks: [...subtasks],
          reminder,
          tags
        };

        return baseData.map((cat, cIdx) => {
          if (cIdx !== targetIndex) return cat;
          return {
            ...cat,
            tasks: [...cat.tasks, newTask]
          };
        });
      }
    });

    handleClose();
  };

  const handleAddSubtask = () => {
    const trimmed = newSubtaskInput.trim();
    if (trimmed) {
      setSubtasks([...subtasks, { name: trimmed, done: false }]);
      setNewSubtaskInput('');
    }
  };

  const handleDeleteSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  if (!isTaskModalOpen) return null;

  return (
    <div id="taskModal" className={`modal ${isTaskModalOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>

        <input
          type="text"
          id="taskNameInput"
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          id="taskNoteInput"
          placeholder="Description"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <details className="advanced-task-options">
          <summary>Advanced Options</summary>
          
          <div className="advanced-options-body">
            <div className="task-date-time-group">
              <input 
                type="date" 
                id="taskDeadlineInput" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <input 
                type="time" 
                id="taskTimeInput" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <select 
              id="taskPriorityInput" 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>

            <input
              type="text"
              id="taskTagsInput"
              placeholder="Tags (comma separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />

            <input
              type="text"
              id="taskLocationInput"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <select 
              id="taskReminderInput"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            >
              <option value="none">No Reminder</option>
              <option value="0">At time of event</option>
              <option value="5">5 minutes before</option>
              <option value="10">10 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="1440">1 day before</option>
            </select>

            <div className="subtask-modal-section">
              <label>Subtasks</label>
              <div id="subtaskModalList" className="subtask-modal-list">
                {subtasks.map((sub, index) => (
                  <div key={index} className="subtask-item">
                    <span>{sub.name}</span>
                    <button 
                      type="button" 
                      className="btn-subtask-delete-clean"
                      onClick={() => handleDeleteSubtask(index)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
              <div className="subtask-input-group">
                <input 
                  type="text" 
                  id="newSubtaskInput" 
                  placeholder="Add subtask..." 
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                />
                <button type="button" id="addSubtaskBtn" onClick={handleAddSubtask}>+</button>
              </div>
            </div>
          </div>
        </details>

        <div className="modal-actions">
          <button id="closeTaskModalBtn" type="button" onClick={handleClose}>
            Cancel
          </button>
          <button id="saveTaskModalBtn" type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
