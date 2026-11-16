import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Icon } from '../ui/Icon';

export const BottomNav: React.FC = () => {
  const { activeSection, setActiveSection, setSidebarOpen } = useAppContext();

  return (
    <nav id="bottomNav" className="bottom-nav" aria-label="Bottom Navigation">
      <button 
        id="navHomeBtn"
        type="button" 
        className={`bottom-nav-item ${activeSection === 'home' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('home')}
        aria-label="Home"
      >
        <Icon name="home" className="nav-icon" />
      </button>
      <button
        id="navTasksBtn"
        type="button"
        className={`bottom-nav-item ${activeSection === 'tasks' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('tasks')}
        aria-label="Tasks"
      >
        <Icon name="tasks" className="nav-icon" />
      </button>
      <button
        id="navCalendarBtn"
        type="button"
        className={`bottom-nav-item ${activeSection === 'calendar' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('calendar')}
        aria-label="Calendar"
      >
        <Icon name="calendar" className="nav-icon" />
      </button>
      <button
        id="navNotesBtn"
        type="button"
        className={`bottom-nav-item ${activeSection === 'notes' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('notes')}
        aria-label="Notes"
      >
        <Icon name="notes" className="nav-icon" />
      </button>
      <button
        id="navMoreBtn"
        type="button"
        className="bottom-nav-item"
        onClick={() => setSidebarOpen(true)}
        aria-label="More options"
      >
        <Icon name="more" className="nav-icon" />
      </button>
    </nav>
  );
};

