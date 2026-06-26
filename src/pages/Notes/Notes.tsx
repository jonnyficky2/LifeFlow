import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNotes } from '../../hooks/useNotes';
import './Notes.css';

export const Notes: React.FC = () => {
  const { notes } = useAppContext();
  const { addNote, updateNote, deleteNote } = useNotes();

  const [search, setSearch] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes.length > 0 ? notes[0].id : null);

  // Local state for the editor to avoid laggy keystrokes
  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');

  const activeNoteData = useMemo(() => {
    return notes.find(n => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // Sync local state when changing selected note
  useEffect(() => {
    if (activeNoteData) {
      setLocalTitle(activeNoteData.title);
      setLocalContent(activeNoteData.content);
    } else {
      setLocalTitle('');
      setLocalContent('');
    }
    // We purposefully only run this when activeNoteId changes to populate the form.
    // We DO NOT run this when notes change, otherwise the debounce would overwrite keystrokes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNoteId]);

  // Debounced auto-save
  useEffect(() => {
    if (!activeNoteId) return;

    // Check if there is actually a change to save
    if (activeNoteData && (activeNoteData.title !== localTitle || activeNoteData.content !== localContent)) {
      const handler = setTimeout(() => {
        updateNote(activeNoteId, { title: localTitle, content: localContent });
      }, 500);

      return () => clearTimeout(handler);
    }
  }, [localTitle, localContent, activeNoteId, updateNote, activeNoteData]);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateNote = () => {
    const newId = addNote('Untitled Note');
    setActiveNoteId(newId);
  };

  const handleDelete = () => {
    if (!activeNoteId) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(activeNoteId);
      setActiveNoteId(null);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="notes-wrapper">
      {/* Left Pane: List */}
      <div className="notes-sidebar">
        <div className="notes-sidebar-header">
          <h2>Notes</h2>
          <button className="btn-new-note" onClick={handleCreateNote}>+ New</button>
        </div>
        <div className="notes-search">
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="notes-list">
          {filteredNotes.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No notes found.</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div 
                key={note.id} 
                className={`note-item ${note.id === activeNoteId ? 'is-active' : ''}`}
                onClick={() => setActiveNoteId(note.id)}
              >
                <h4>{note.title || 'Untitled Note'}</h4>
                <p>{formatDate(note.updatedAt)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Pane: Editor */}
      <div className="notes-editor-pane">
        {!activeNoteId || !activeNoteData ? (
          <div className="notes-editor-empty">
            Select a note or create a new one to start writing.
          </div>
        ) : (
          <>
            <div className="notes-editor-header">
              <input 
                type="text" 
                className="note-title-input" 
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                placeholder="Note Title"
              />
              <button className="btn-delete-note" onClick={handleDelete} title="Delete Note">
                🗑
              </button>
            </div>
            <div className="notes-editor-body">
              <textarea 
                className="note-content-textarea" 
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                placeholder="Start typing your note here... (Markdown supported)"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
