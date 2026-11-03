import React from 'react';
import { useAppContext } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeSection, setActiveSection } = useAppContext();

  return (
    <nav id="bottomNav" className="bottom-nav" aria-label="Bottom Navigation">
      <button 
        id="navHomeBtn"
        type="button" 
        className={`bottom-nav-item ${activeSection === 'home' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('home')}
        aria-label="Home"
      >
        <span className="nav-icon">🏠</span>
      </button>
      <button 
        id="navCalendarBtn"
        type="button" 
        className={`bottom-nav-item ${activeSection === 'calendar' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('calendar')}
        aria-label="Calendar"
      >
        <span className="nav-icon">📅</span>
      </button>
      <button 
        id="navHabitBtn"
        type="button" 
        className={`bottom-nav-item ${activeSection === 'habit' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('habit')}
        aria-label="Habits"
      >
        <span className="nav-icon">🔥</span>
      </button>
      <button 
        id="navStatsBtn"
        type="button" 
        className={`bottom-nav-item ${activeSection === 'stats' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('stats')}
        aria-label="Stats"
      >
        <span className="nav-icon">📊</span>
      </button>
      <button 
        id="navNotesBtn"
        type="button" 
        className={`bottom-nav-item ${activeSection === 'notes' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('notes')}
        aria-label="Notes"
      >
        <span className="nav-icon">📝</span>
      </button>
    </nav>
  );
};

