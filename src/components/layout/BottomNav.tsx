import React from 'react';
import { useAppContext } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeSection, setActiveSection } = useAppContext();

  return (
    <nav id="bottomNav" className="bottom-nav">
      <button 
        type="button" 
        className={`bottom-nav-item ${activeSection === 'home' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('home')}
      >
        <span className="nav-icon">⌂</span>
        <span>Home</span>
      </button>
      <button 
        type="button" 
        className={`bottom-nav-item ${activeSection === 'calendar' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('calendar')}
      >
        <span className="nav-icon">📅</span>
        <span>Calendar</span>
      </button>
      <button 
        type="button" 
        className={`bottom-nav-item ${activeSection === 'habit' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('habit')}
      >
        <span className="nav-icon">🔥</span>
        <span>Habits</span>
      </button>
      <button 
        type="button" 
        className={`bottom-nav-item ${activeSection === 'stats' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('stats')}
      >
        <span className="nav-icon">📊</span>
        <span>Stats</span>
      </button>
      <button 
        type="button" 
        className={`bottom-nav-item ${activeSection === 'notes' ? 'is-active' : ''}`}
        onClick={() => setActiveSection('notes')}
      >
        <span className="nav-icon">📝</span>
        <span>Notes</span>
      </button>
    </nav>
  );
};
