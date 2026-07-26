import React, { lazy, Suspense } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { useSettingsContext } from './context/SettingsContext';
import { TaskProvider } from './context/TaskContext';
import { HabitProvider } from './context/HabitContext';
import { NoteProvider } from './context/NoteContext';
import { SettingsProvider } from './context/SettingsContext';

import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { TaskModal } from './components/modals/TaskModal';
import { AuthModal } from './components/modals/AuthModal';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const Tasks = lazy(() => import('./pages/Tasks/Tasks').then(m => ({ default: m.Tasks })));
const Categories = lazy(() => import('./pages/Categories/Categories').then(m => ({ default: m.Categories })));
const Calendar = lazy(() => import('./pages/Calendar/Calendar').then(m => ({ default: m.Calendar })));
const Habits = lazy(() => import('./pages/Habits/Habits').then(m => ({ default: m.Habits })));
const Notes = lazy(() => import('./pages/Notes/Notes').then(m => ({ default: m.Notes })));
const Focus = lazy(() => import('./pages/Focus/Focus').then(m => ({ default: m.Focus })));
const Settings = lazy(() => import('./pages/Settings/Settings').then(m => ({ default: m.Settings })));
const Reports = lazy(() => import('./pages/Reports/Reports').then(m => ({ default: m.Reports })));

const PageFallback = () => (
  <div className="app-page-fallback">
    <div className="skeleton app-skeleton-fallback-title" />
    <div className="skeleton app-skeleton-fallback-banner" />
    <div className="skeleton app-skeleton-fallback-content" />
  </div>
);

const AppContent: React.FC = () => {
  const { activeSection } = useAppContext();
  const { settings } = useSettingsContext();
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  React.useEffect(() => {
    // Show Auth Modal on initial load if not logged in
    if (!loading && !user) {
      // Check session storage so we only show it once per session
      if (!sessionStorage.getItem('authPrompted')) {
        setShowAuthModal(true);
        sessionStorage.setItem('authPrompted', 'true');
      }
    }
  }, [user, loading]);

  React.useEffect(() => {
    const applyTheme = (isLight: boolean) => {
      if (isLight) {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
    };

    if (settings?.theme === 'light') {
      applyTheme(true);
    } else if (settings?.theme === 'dark') {
      applyTheme(false);
    } else {
      // System default
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      applyTheme(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings?.theme]);

  return (
    <>
      <Layout>
        <Suspense fallback={<PageFallback />}>
          {activeSection === 'home' && <Dashboard />}
          {activeSection === 'tasks' && <Tasks />}
          {activeSection === 'habit' && <Habits />}
          {activeSection === 'focus' && <Focus />}
          {activeSection === 'calendar' && <Calendar />}
          {activeSection === 'categories' && <Categories />}
          {activeSection === 'stats' && <Reports />}
          {activeSection === 'notes' && <Notes />}
          {activeSection === 'settings' && <Settings />}
        </Suspense>
      </Layout>
      <TaskModal />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
      <TaskProvider>
        <HabitProvider>
          <NoteProvider>
            <AppProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AppProvider>
          </NoteProvider>
        </HabitProvider>
      </TaskProvider>
    </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
