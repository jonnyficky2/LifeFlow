import { useCallback } from 'react';
import { useNoteContext } from '../context/NoteContext';
import type { Note } from '../types';
import { useToast } from '../context/ToastContext';

export const useNotes = () => {
  const { notes, setNotes, saveNoteSnapshot } = useNoteContext();
  const { showToast } = useToast();

  const addNote = useCallback((title: string = 'Untitled Note') => {
    saveNoteSnapshot();
    const newNote: Note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    showToast('Note created', 'success');
    return newNote.id;
  }, [saveNoteSnapshot, setNotes, notes, showToast]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    // Only call saveNoteSnapshot if this is a meaningful manual action, 
    // but for real-time auto-save we don't want to spam the undo stack on every keystroke.
    // The UI should handle undo/redo stack grouping, or we just rely on standard input undo.
    // We will let the UI call saveNoteSnapshot explicitly before big changes if needed.
    
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date().toISOString() } 
          : note
      )
    );
  }, [setNotes]);

  const deleteNote = useCallback((id: string) => {
    saveNoteSnapshot();
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    showToast('Note deleted', 'warning');
  }, [saveNoteSnapshot, setNotes, showToast]);

  return {
    addNote,
    updateNote,
    deleteNote
  };
};
