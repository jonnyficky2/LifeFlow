import { Icon } from '../ui/Icon';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import { useNoteContext } from '../../context/NoteContext';
import { noteDisplayTitle } from '../../utils/noteTitle';
import './UnifiedSearchModal.css';

export const UnifiedSearchModal: React.FC = () => {
  const { isUnifiedSearchOpen, setUnifiedSearchOpen, setActiveSection } = useAppContext();
  const { appData, setEditingTask, setTaskModalOpen } = useTaskContext();
  const { notes, setActiveNoteId } = useNoteContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isUnifiedSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isUnifiedSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isUnifiedSearchOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setUnifiedSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnifiedSearchOpen, setUnifiedSearchOpen]);

  // Search Results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const taskMatches: Array<{
      type: 'task';
      id: string;
      title: string;
      subtitle: string;
      categoryName: string;
      catIndex: number;
      taskIndex: number;
      done: boolean;
    }> = [];

    const noteMatches: Array<{
      type: 'note';
      id: string;
      title: string;
      subtitle: string;
    }> = [];

    const categoryMatches: Array<{
      type: 'category';
      id: string;
      title: string;
      subtitle: string;
      catIndex: number;
    }> = [];

    // 1. Search Tasks
    appData.forEach((cat, cIdx) => {
      (cat.tasks || []).forEach((task, tIdx) => {
        const matchName = task.name.toLowerCase().includes(q);
        const matchNote = (task.note || '').toLowerCase().includes(q);
        const matchTag = (task.tags || []).some(t => t.toLowerCase().includes(q));

        if (matchName || matchNote || matchTag) {
          const status = task.done ? 'Selesai' : 'Pending';
          const timeInfo = task.deadline ? ` • Deadline: ${task.deadline}${task.time ? ` ${task.time}` : ''}` : '';
          taskMatches.push({
            type: 'task',
            id: `task-${cIdx}-${tIdx}`,
            title: task.name,
            subtitle: `[${cat.name}] ${status}${timeInfo}`,
            categoryName: cat.name,
            catIndex: cIdx,
            taskIndex: tIdx,
            done: task.done
          });
        }
      });
    });

    // 2. Search Notes
    notes.forEach(note => {
      const matchTitle = (note.title || '').toLowerCase().includes(q);
      const matchContent = (note.content || '').toLowerCase().includes(q);

      if (matchTitle || matchContent) {
        const excerpt = note.content.replace(/[#*`\n]/g, ' ').trim().slice(0, 70);
        noteMatches.push({
          type: 'note',
          id: `note-${note.id}`,
          title: noteDisplayTitle(note),
          subtitle: excerpt ? `${excerpt}...` : 'Catatan kosong'
        });
      }
    });

    // 3. Search Categories
    appData.forEach((cat, cIdx) => {
      if (cat.name.toLowerCase().includes(q)) {
        const count = cat.tasks ? cat.tasks.length : 0;
        categoryMatches.push({
          type: 'category',
          id: `cat-${cIdx}`,
          title: cat.name,
          subtitle: `${count} task${count === 1 ? '' : 's'}`,
          catIndex: cIdx
        });
      }
    });

    return [
      ...taskMatches.slice(0, 10),
      ...noteMatches.slice(0, 10),
      ...categoryMatches.slice(0, 5)
    ];
  }, [query, appData, notes]);

  // Adjust selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  const handleSelect = (item: (typeof results)[0]) => {
    if (!item) return;

    if (item.type === 'task') {
      setEditingTask({ catIndex: item.catIndex, taskIndex: item.taskIndex });
      setTaskModalOpen(true);
      setUnifiedSearchOpen(false);
    } else if (item.type === 'note') {
      const cleanNoteId = item.id.replace(/^note-/, '');
      setActiveNoteId(cleanNoteId);
      setActiveSection('notes');
      setUnifiedSearchOpen(false);
    } else if (item.type === 'category') {
      setActiveSection('tasks');
      setUnifiedSearchOpen(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  if (!isUnifiedSearchOpen) return null;

  const totalTasks = appData.reduce((acc, cat) => acc + (cat.tasks?.length || 0), 0);
  const totalNotes = notes.length;
  const totalCategories = appData.length;

  return (
    <div
      className="unified-search-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setUnifiedSearchOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Global LifeFlow"
    >
      <div className="unified-search-dialog glass-effect">
        <header className="unified-search-header">
          <span className="unified-search-icon" aria-hidden="true"><Icon name="search" /></span>
          <input
            ref={inputRef}
            type="text"
            className="unified-search-input"
            placeholder="Cari task, catatan, kategori... (↑↓ untuk navigasi, Enter untuk pilih)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="Input pencarian global"
          />
          {query && (
            <button
              type="button"
              className="unified-search-clear"
              onClick={() => setQuery('')}
              aria-label="Hapus teks pencarian"
            >
              ×
            </button>
          )}
          <kbd className="unified-search-esc" onClick={() => setUnifiedSearchOpen(false)}>ESC</kbd>
        </header>

        <div className="unified-search-body" ref={resultsRef}>
          {!query.trim() ? (
            <div className="unified-search-empty">
              <p className="unified-search-hint">Ketik untuk mencari di semua modul LifeFlow</p>
              <div className="unified-search-stats">
                <span className="unified-stat-pill"><Icon name="tasks" size={14} /> {totalTasks} Tugas</span>
                <span className="unified-stat-pill"><Icon name="document" size={14} /> {totalNotes} Catatan</span>
                <span className="unified-stat-pill"><Icon name="file" size={14} /> {totalCategories} Kategori</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="unified-search-no-results">
              <span className="unified-no-results-icon" aria-hidden="true"><Icon name="search" size={32} /></span>
              <p>Tidak ada hasil untuk &ldquo;<strong>{query}</strong>&rdquo;</p>
              <small>Coba gunakan kata kunci lain untuk tugas, catatan, atau kategori.</small>
            </div>
          ) : (
            <ul className="unified-search-list" role="listbox">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li
                    key={item.id}
                    className={`unified-search-item unified-search-item--${item.type} ${isSelected ? 'is-selected' : ''}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="unified-item-badge">
                      {item.type === 'task' ? 'TASK' : item.type === 'note' ? 'NOTE' : 'CATEGORY'}
                    </div>
                    <div className="unified-item-content">
                      <strong className="unified-item-title">{item.title}</strong>
                      {item.subtitle && <span className="unified-item-subtitle">{item.subtitle}</span>}
                    </div>
                    <span className="unified-item-action" aria-hidden="true">↵</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="unified-search-footer">
          <span>Tekan <kbd>↵</kbd> untuk membuka</span>
          <span><kbd>↑</kbd> <kbd>↓</kbd> untuk memilih</span>
          <span><kbd>ESC</kbd> untuk menutup</span>
        </footer>
      </div>
    </div>
  );
};
