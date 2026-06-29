import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNotes } from '../../hooks/useNotes';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import './Notes.css';

export const Notes: React.FC = () => {
  const { notes, isAppLoading } = useAppContext();
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

  const getNoteDateGroup = (isoString: string): string => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const groupedNotes = useMemo(() => {
    const groups: { [key: string]: typeof notes } = {};
    
    // Sort notes by updatedAt desc
    const sorted = [...filteredNotes].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    sorted.forEach(note => {
      const key = getNoteDateGroup(note.updatedAt);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(note);
    });

    return Object.entries(groups).map(([title, notesList]) => ({
      title,
      notesList
    }));
  }, [filteredNotes]);

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
            aria-label="Search notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="notes-list">
          {isAppLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="note-item">
                <Skeleton type="title" width="70%" />
                <Skeleton type="text" width="40%" style={{ marginTop: '8px' }} />
              </div>
            ))
          ) : filteredNotes.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No notes found.</p>
            </div>
          ) : (
            groupedNotes.map(group => (
              <div key={group.title} className="notes-group-section">
                <div className="notes-group-header">{group.title}</div>
                {group.notesList.map(note => (
                  <div 
                    key={note.id} 
                    className={`note-item ${note.id === activeNoteId ? 'is-active' : ''}`}
                    onClick={() => setActiveNoteId(note.id)}
                  >
                    <h4>{note.title || 'Untitled Note'}</h4>
                    <p>{formatDate(note.updatedAt)}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Pane: Editor */}
      <div className="notes-editor-pane">
        {isAppLoading ? (
          <div style={{ padding: '40px' }}>
            <Skeleton type="title" width="40%" height={32} />
            <Skeleton type="block" height={1} style={{ margin: '24px 0' }} />
            <Skeleton type="text" width="100%" />
            <Skeleton type="text" width="90%" />
            <Skeleton type="text" width="95%" />
            <Skeleton type="text" width="80%" />
          </div>
        ) : !activeNoteId || !activeNoteData ? (
          <EmptyState 
            icon="📝" 
            title="Your Notes" 
            description="Select a note from the sidebar or create a new one to start writing." 
          />
        ) : (
          <>
            <div className="notes-editor-header">
              <input 
                type="text" 
                className="note-title-input" 
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                placeholder="Untitled Note"
                onKeyDown={(e) => {
                  if (localTitle === 'Untitled Note') {
                    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                      e.preventDefault();
                      setLocalTitle(e.key);
                    }
                  }
                }}
              />
              <button className="btn-delete-note" onClick={handleDelete} title="Delete Note" aria-label="Delete note">
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
