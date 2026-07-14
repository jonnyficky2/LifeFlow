import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { APP_LOGO } from './assets';

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen, activeSection, setActiveSection } = useAppContext();
  const { user, loginWithGoogle, logout } = useAuth();

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
            <span className="sidebar-title">Life<span>Flow</span></span>
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
          <nav className="sidebar-menu app-nav">
            <button type="button" className={`sidebar-item ${activeSection === 'home' ? 'is-active' : ''}`} onClick={() => handleNavClick('home')}>⌂ Dashboard</button>
            <button type="button" className={`sidebar-item ${activeSection === 'tasks' ? 'is-active' : ''}`} onClick={() => handleNavClick('tasks')}>☑ Tasks</button>
            <button type="button" className={`sidebar-item ${activeSection === 'habit' ? 'is-active' : ''}`} onClick={() => handleNavClick('habit')}>◈ Habits</button>
            <button type="button" className={`sidebar-item ${activeSection === 'focus' ? 'is-active' : ''}`} onClick={() => handleNavClick('focus')}>⏱ Focus Timer</button>
            <button type="button" className={`sidebar-item ${activeSection === 'calendar' ? 'is-active' : ''}`} onClick={() => handleNavClick('calendar')}>▦ Calendar</button>
            <button type="button" className={`sidebar-item ${activeSection === 'categories' ? 'is-active' : ''}`} onClick={() => handleNavClick('categories')}>▣ Categories</button>
            <button type="button" className={`sidebar-item ${activeSection === 'stats' ? 'is-active' : ''}`} onClick={() => handleNavClick('stats')}>▥ Reports</button>
            <button type="button" className={`sidebar-item ${activeSection === 'notes' ? 'is-active' : ''}`} onClick={() => handleNavClick('notes')}>✎ Notes</button>
            <button type="button" className={`sidebar-item ${activeSection === 'settings' ? 'is-active' : ''}`} onClick={() => handleNavClick('settings')}>⚙ Settings</button>
          </nav>

          <div className="sidebar-account">
            <p className="sidebar-label">Account</p>
            <p className="sidebar-name">{user ? user.displayName || 'LifeFlow User' : 'Guest User'}</p>
            <p className="sidebar-email">{user ? user.email : 'Login to access account'}</p>
            {!user ? (
              <button id="loginBtn" type="button" className="sidebar-item account-action" onClick={loginWithGoogle}>Sign In with Google</button>
            ) : (
              <button id="logoutBtn" type="button" className="sidebar-item account-action" onClick={logout}>Sign Out</button>
            )}
          </div>

          <div className="sidebar-streak-card">
            <p>🔥 Streak</p>
            <strong id="sidebarStreakCount">0 Days</strong>
            <span>Keep going! 🔥</span>
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
