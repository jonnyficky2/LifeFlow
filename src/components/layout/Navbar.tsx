import { Icon } from '../ui/Icon';
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { APP_LOGO, DEFAULT_AVATAR } from './assets';

export const Navbar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen, setActiveSection, setAiChatOpen, setUnifiedSearchOpen } = useAppContext();
  const { user, loginWithGoogle } = useAuth();

  return (
    <nav id="navbar" className="navbar">
      <div className="navbar-container">
        
        {/* Logo & Title */}
        <div 
          className="navbar-brand"
          onClick={() => setActiveSection('home')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveSection('home');
            }
          }}
          aria-label="Go to LifeFlow Dashboard"
        >
          <img src={APP_LOGO} alt="Logo" className="navbar-logo" />
          <span className="navbar-title sidebar-title">Life<span>Flow</span></span>
        </div>

        <div className="navbar-actions">
          <button type="button" className="btn btn--icon navbar-search-btn" title="Cari (⌘K / Ctrl+K)" aria-label="Cari tugas, catatan, kategori" onClick={() => setUnifiedSearchOpen(true)}><Icon name="search" /></button>
          <button type="button" className="btn btn--icon ai-chat-trigger" title="Buka LifeFlow AI (⌘J / Ctrl+J)" aria-label="Buka LifeFlow AI (⌘J / Ctrl+J)" onClick={() => setAiChatOpen(true)}><Icon name="spark" /></button>

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
              role="button"
              tabIndex={0}
              onClick={() => setActiveSection('settings')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveSection('settings');
                }
              }}
              aria-label="Open Settings"
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
