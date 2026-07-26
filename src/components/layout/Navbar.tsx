import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTaskContext } from '../../context/TaskContext';
import { useHabitContext } from '../../context/HabitContext';
import { useNoteContext } from '../../context/NoteContext';
import { useSettingsContext } from '../../context/SettingsContext';
import type { AppSettings } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { APP_LOGO, DEFAULT_AVATAR } from './assets';

export const Navbar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen, activeSection } = useAppContext();
  const { undoTask, redoTask } = useTaskContext();
  const { undoHabit, redoHabit } = useHabitContext();
  const { undoNote, redoNote } = useNoteContext();
  const { setSettings } = useSettingsContext();

  const handleUndo = () => {
    if (activeSection === 'notes') undoNote();
    else if (activeSection === 'habits') undoHabit();
    else undoTask();
  };

  const handleRedo = () => {
    if (activeSection === 'notes') redoNote();
    else if (activeSection === 'habits') redoHabit();
    else redoTask();
  };
  const { user, loginWithGoogle } = useAuth();

  const toggleTheme = () => {
    setSettings((prev: AppSettings) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  return (
    <nav id="navbar" className="navbar">
      <div className="navbar-container">
        
        {/* Logo & Title */}
        <div className="navbar-brand">
          <img src={APP_LOGO} alt="Logo" className="navbar-logo" />
          <span className="navbar-title sidebar-title">Life<span>Flow</span></span>
        </div>

        <div className="navbar-actions">
          <button id="undoBtn" type="button" className="btn btn--icon" title="Undo" aria-label="Undo last action" onClick={handleUndo}>↩</button>
          <button id="redoBtn" type="button" className="btn btn--icon" title="Redo" aria-label="Redo last action" onClick={handleRedo}>↪</button>
          <button id="desktopThemeToggle" type="button" className="btn btn--icon" aria-label="Toggle theme" onClick={toggleTheme} style={{marginRight: '12px'}}>◐</button>

          {!user ? (
            <button id="navLoginBtn" type="button" className="nav-login-btn" onClick={loginWithGoogle}>Sign In</button>
          ) : (
            <img
              id="navUserImg" 
              src={user.photoURL || DEFAULT_AVATAR}
              alt={user.displayName || "Profile"} 
              className="nav-user-img" 
              referrerPolicy="no-referrer" 
              loading="lazy" 
            />
          )}
        
          {/* Sidebar Toggle Button */}
          <button 
            id="sidebarToggle" 
            className={`sidebar-toggle ${isSidebarOpen ? 'active' : ''}`} 
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
      </div>
    </nav>
  );
};
