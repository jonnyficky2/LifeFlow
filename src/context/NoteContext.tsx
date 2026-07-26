import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from './AppContext';
import { usePersistentState } from '../hooks/usePersistentState';
import type { Note } from '../types';

interface NoteContextType {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  undoNote: () => void;
  redoNote: () => void;
  saveNoteSnapshot: () => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = usePersistentState<Note[]>(STORAGE_KEYS.NOTES, []);

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const saveNoteSnapshot = () => {
    const snapshot = JSON.stringify({ notes });
    setUndoStack(prev => [...prev, snapshot]);
    setRedoStack([]);
  };

  const undoNote = () => {
    if (undoStack.length === 0) return;
    const currentState = JSON.stringify({ notes });
    setRedoStack(prev => [...prev, currentState]);
    const newUndoStack = [...undoStack];
    const prevStateStr = newUndoStack.pop();
    setUndoStack(newUndoStack);
    if (prevStateStr) setNotes(JSON.parse(prevStateStr).notes);
  };

  const redoNote = () => {
    if (redoStack.length === 0) return;
    const currentState = JSON.stringify({ notes });
    setUndoStack(prev => [...prev, currentState]);
    const newRedoStack = [...redoStack];
    const nextStateStr = newRedoStack.pop();
    setRedoStack(newRedoStack);
    if (nextStateStr) setNotes(JSON.parse(nextStateStr).notes);
  };

  return (
    <NoteContext.Provider value={{
      notes, setNotes,
      undoNote, redoNote, saveNoteSnapshot
    }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (!context) throw new Error('useNoteContext must be used within NoteProvider');
  return context;
};
