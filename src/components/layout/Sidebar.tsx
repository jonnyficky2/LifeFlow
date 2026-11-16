import React from 'react';
import { useAppContext } from '../../context/AppContext';

import { APP_LOGO } from './assets';
import { Icon } from '../ui/Icon';

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen, activeSection, setActiveSection } = useAppContext();


  const handleNavClick = (section: string): void => {
    setActiveSection(section);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <aside id="sidebar" className={`sidebar app-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="app-sidebar-brand">
            <img src={APP_LOGO} alt="Logo" className="sidebar-profile-img" />
            <div className="sidebar-brand-text">
              <span className="sidebar-title">Life<span>Flow</span></span>
            </div>
          </div>
          <button
            id="sidebarClose"
            className="sidebar-close"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-menu app-nav" aria-label="Main Navigation">
            <div className="sidebar-group">
              <span className="sidebar-group-label">Workspace</span>
              <button type="button" className={`sidebar-item ${activeSection === 'home' ? 'is-active' : ''}`} onClick={() => handleNavClick('home')}><Icon name="home" /> Dashboard</button>
              <button type="button" className={`sidebar-item ${activeSection === 'tasks' ? 'is-active' : ''}`} onClick={() => handleNavClick('tasks')}><Icon name="tasks" /> Tasks</button>
              <button type="button" className={`sidebar-item ${activeSection === 'notes' ? 'is-active' : ''}`} onClick={() => handleNavClick('notes')}><Icon name="notes" /> Notes</button>
            </div>

            <div className="sidebar-group">
              <span className="sidebar-group-label">Planning</span>
              <button type="button" className={`sidebar-item ${activeSection === 'calendar' ? 'is-active' : ''}`} onClick={() => handleNavClick('calendar')}><Icon name="calendar" /> Calendar</button>
              <button type="button" className={`sidebar-item ${activeSection === 'habit' ? 'is-active' : ''}`} onClick={() => handleNavClick('habit')}><Icon name="habits" /> Habits</button>
              <button type="button" className={`sidebar-item ${activeSection === 'focus' ? 'is-active' : ''}`} onClick={() => handleNavClick('focus')}><Icon name="focus" /> Focus Timer</button>
            </div>

            <div className="sidebar-group">
              <span className="sidebar-group-label">Insights</span>
              <button type="button" className={`sidebar-item ${activeSection === 'stats' ? 'is-active' : ''}`} onClick={() => handleNavClick('stats')}><Icon name="reports" /> Reports</button>
            </div>

            <div className="sidebar-group">
              <span className="sidebar-group-label">System</span>
              <button type="button" className={`sidebar-item ${activeSection === 'settings' ? 'is-active' : ''}`} onClick={() => handleNavClick('settings')}><Icon name="settings" /> Settings</button>
            </div>
          </nav>



          <div className="sidebar-streak-card">
            <p><Icon name="habits" /> Streak</p>
            <strong id="sidebarStreakCount">0 Days</strong>
            <span>Keep going!</span>
            <i></i>
          </div>
        </div>
      </aside>

      <div
        id="sidebarOverlay"
        className={`sidebar-overlay ${isSidebarOpen ? 'sidebar-overlay-show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
    </>
  );
};
