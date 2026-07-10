import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./AuthModal.css";

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      // Error is logged in AuthContext
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal auth-modal glass-effect" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <h2>Welcome to LifeFlow</h2>
          <p className="auth-subtitle">Sign in to sync your progress across devices and never lose your streak.</p>
        </div>
        
        <div className="auth-body">
          <button className="google-btn" onClick={handleLogin}>
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="google-icon"
            />
            Continue with Google
          </button>
        </div>
        
        <div className="auth-footer">
          <button className="btn-secondary close-auth" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
