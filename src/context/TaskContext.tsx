import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from './AppContext';
import { usePersistentState } from '../hooks/usePersistentState';
import type { Category } from '../types';

interface TaskContextType {
  appData: Category[];
  setAppData: React.Dispatch<React.SetStateAction<Category[]>>;
  isTaskModalOpen: boolean;
  setTaskModalOpen: (isOpen: boolean) => void;
  editingTask: { catIndex: number; taskIndex: number } | null;
  setEditingTask: (task: { catIndex: number; taskIndex: number } | null) => void;
  currentCategoryIndex: number | null;
  setCurrentCategoryIndex: (index: number | null) => void;
  undoTask: () => void;
  redoTask: () => void;
  saveTaskSnapshot: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appData, setAppData] = usePersistentState<Category[]>(STORAGE_KEYS.APP_DATA, [{ name: "Inbox", tasks: [] }]);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{ catIndex: number; taskIndex: number } | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number | null>(null);

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const saveTaskSnapshot = () => {
    const snapshot = JSON.stringify({ appData });
    setUndoStack(prev => [...prev, snapshot]);
    setRedoStack([]);
  };

  const undoTask = () => {
    if (undoStack.length === 0) return;
    const currentState = JSON.stringify({ appData });
    setRedoStack(prev => [...prev, currentState]);
    const newUndoStack = [...undoStack];
    const prevStateStr = newUndoStack.pop();
    setUndoStack(newUndoStack);
    if (prevStateStr) setAppData(JSON.parse(prevStateStr).appData);
  };

  const redoTask = () => {
    if (redoStack.length === 0) return;
    const currentState = JSON.stringify({ appData });
    setUndoStack(prev => [...prev, currentState]);
    const newRedoStack = [...redoStack];
    const nextStateStr = newRedoStack.pop();
    setRedoStack(newRedoStack);
    if (nextStateStr) setAppData(JSON.parse(nextStateStr).appData);
  };

  return (
    <TaskContext.Provider value={{
      appData, setAppData,
      isTaskModalOpen, setTaskModalOpen,
      editingTask, setEditingTask,
      currentCategoryIndex, setCurrentCategoryIndex,
      undoTask, redoTask, saveTaskSnapshot
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within TaskProvider');
  return context;
};
