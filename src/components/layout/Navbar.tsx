import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useAppContext();
  const { user, loginWithGoogle } = useAuth();

  return (
    <nav id="navbar" className="navbar">
      <div className="navbar-container">
        
        {/* Logo & Title */}
        <div className="navbar-brand">
          <img src="/assets/icons/icon.svg" alt="Logo" className="navbar-logo" />
          <span className="navbar-title sidebar-title">Life<span>Flow</span></span>
        </div>

        <div className="navbar-actions">
          {!user ? (
            <button id="navLoginBtn" type="button" className="nav-login-btn" onClick={loginWithGoogle}>Sign In</button>
          ) : (
            <img 
              id="navUserImg" 
              src={user.photoURL || "/assets/icons/icon.svg"} 
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
