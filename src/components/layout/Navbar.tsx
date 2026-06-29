import React from 'react';
import { useAppContext } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useAppContext();

  return (
    <nav id="navbar" className="navbar">
      <div className="navbar-container">
        
        {/* Logo & Title */}
        <div className="navbar-brand">
          <img src="/assets/icons/icon.svg" alt="Logo" className="navbar-logo" />
          <span className="navbar-title sidebar-title">Life<span>Flow</span></span>
        </div>

        <div className="navbar-actions">
          <button id="navLoginBtn" type="button" className="nav-login-btn">Sign In</button>
          <img id="navUserImg" src="/assets/icons/icon.svg" alt="Profile" className="nav-user-img nav-user-img-hidden" referrerPolicy="no-referrer" loading="lazy" />
        
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
