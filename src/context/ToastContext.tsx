import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const [stage, setStage] = useState<'enter' | 'show' | 'hide'>('enter');

  useEffect(() => {
    // Trigger transition to show
    const showTimer = setTimeout(() => {
      setStage('show');
    }, 50);

    // Trigger transition to hide before removing
    const hideTimer = setTimeout(() => {
      setStage('hide');
    }, 2700);

    // Call onRemove after hide transition finishes
    const removeTimer = setTimeout(() => {
      onRemove();
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onRemove]);

  return (
    <div 
      className={`toast-message toast-message--${toast.type} ${stage === 'show' ? 'show' : stage === 'hide' ? 'hide' : ''}`}
    >
      {toast.message}
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-container">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
