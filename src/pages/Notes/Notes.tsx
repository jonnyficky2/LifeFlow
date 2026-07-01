import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNotes } from '../../hooks/useNotes';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import './Notes.css';

export const Notes: React.FC = () => {
  const { notes, isAppLoading } = useAppContext();
  const { addNote, updateNote, deleteNote } = useNotes();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes.length > 0 ? notes[0].id : null);

  // Local state for the editor to avoid laggy keystrokes
  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [localDeadline, setLocalDeadline] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [localReminder, setLocalReminder] = useState('none');

  const activeNoteData = useMemo(() => {
    return notes.find(n => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // Sync local state when changing selected note
  useEffect(() => {
    if (activeNoteData) {
      setLocalTitle(activeNoteData.title);
      setLocalContent(activeNoteData.content);
      setLocalDeadline(activeNoteData.deadline || '');
      setLocalTime(activeNoteData.time || '');
      setLocalReminder(activeNoteData.reminder || 'none');
    } else {
      setLocalTitle('');
      setLocalContent('');
      setLocalDeadline('');
      setLocalTime('');
      setLocalReminder('none');
    }
    // We purposefully only run this when activeNoteId changes to populate the form.
    // We DO NOT run this when notes change, otherwise the debounce would overwrite keystrokes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNoteId]);

  // Debounced auto-save
  useEffect(() => {
    if (!activeNoteId) return;

    // Check if there is actually a change to save
    if (activeNoteData && (
      activeNoteData.title !== localTitle || 
      activeNoteData.content !== localContent ||
      (activeNoteData.deadline || '') !== localDeadline ||
      (activeNoteData.time || '') !== localTime ||
      (activeNoteData.reminder || 'none') !== localReminder
    )) {
      const handler = setTimeout(() => {
        updateNote(activeNoteId, { 
          title: localTitle, 
          content: localContent,
          deadline: localDeadline,
          time: localTime,
          reminder: localReminder
        });
      }, 500);

      return () => clearTimeout(handler);
    }
  }, [localTitle, localContent, localDeadline, localTime, localReminder, activeNoteId, updateNote, activeNoteData]);

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
      const key = note.isPinned ? '📌 Pinned' : getNoteDateGroup(note.updatedAt);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(note);
    });

    const result = Object.entries(groups).map(([title, notesList]) => ({
      title,
      notesList
    }));

    const pinnedIndex = result.findIndex(g => g.title === '📌 Pinned');
    if (pinnedIndex > -1) {
      const pinnedGroup = result.splice(pinnedIndex, 1)[0];
      result.unshift(pinnedGroup);
    }

    return result;
  }, [filteredNotes]);

  const handleCreateNote = () => {
    const newId = addNote('Untitled Note');
    setActiveNoteId(newId);
  };

  const handleDelete = () => {
    if (!activeNoteId) return;
    setConfirmOpen(true);
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
                <Skeleton type="text" width="40%" className="notes-skeleton-margin" />
              </div>
            ))
          ) : filteredNotes.length === 0 ? (
            <div className="notes-empty-state-padding">
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
          <div className="notes-editor-loading-padding">
            <Skeleton type="title" width="40%" height={32} />
            <Skeleton type="block" height={1} className="notes-editor-divider" />
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
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={`btn-pin-note ${activeNoteData.isPinned ? 'active' : ''}`} 
                  onClick={() => updateNote(activeNoteId, { isPinned: !activeNoteData.isPinned })}
                  title={activeNoteData.isPinned ? "Unpin Note" : "Pin Note"}
                  aria-label="Pin note"
                >
                  {activeNoteData.isPinned ? '📍' : '📌'}
                </button>
                <button className="btn-delete-note" onClick={handleDelete} title="Delete Note" aria-label="Delete note">
                  🗑
                </button>
              </div>
            </div>
            <div className="notes-metadata-bar">
              <input type="date" className="form-input" value={localDeadline} onChange={(e) => setLocalDeadline(e.target.value)} title="Deadline" />
              <input type="time" className="form-input" value={localTime} onChange={(e) => setLocalTime(e.target.value)} title="Time" />
              <select className="form-input" value={localReminder} onChange={(e) => setLocalReminder(e.target.value)} title="Reminder">
                <option value="none">No Reminder</option>
                <option value="0">At time of event</option>
                <option value="5">5 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="1440">1 day before</option>
              </select>
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

      {confirmOpen && (
        <div className="modal show">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '24px', borderRadius: '12px' }}>
            <h3>Delete Note</h3>
            <p style={{ margin: '16px 0', color: 'var(--color-muted)' }}>
              Are you sure you want to delete the active note? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => {
                if (activeNoteId) {
                  deleteNote(activeNoteId);
                  setActiveNoteId(null);
                }
                setConfirmOpen(false);
              }}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
