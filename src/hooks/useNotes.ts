import { useAppContext } from '../context/AppContext';
import type { Note } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export const useNotes = () => {
  const { notes, setNotes, saveHistorySnapshot } = useAppContext();
  const { showToast } = useToast();

  const addNote = (title: string = 'Untitled Note') => {
    saveHistorySnapshot();
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
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    // Only call saveHistorySnapshot if this is a meaningful manual action, 
    // but for real-time auto-save we don't want to spam the undo stack on every keystroke.
    // The UI should handle undo/redo stack grouping, or we just rely on standard input undo.
    // We will let the UI call saveHistorySnapshot explicitly before big changes if needed.
    
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date().toISOString() } 
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    saveHistorySnapshot();
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    showToast('Note deleted', 'warning');
  };

  return {
    addNote,
    updateNote,
    deleteNote
  };
};
