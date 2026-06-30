import React, { lazy, Suspense } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { TaskModal } from './components/modals/TaskModal';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const Tasks = lazy(() => import('./pages/Tasks/Tasks').then(m => ({ default: m.Tasks })));
const Categories = lazy(() => import('./pages/Categories/Categories').then(m => ({ default: m.Categories })));
const Calendar = lazy(() => import('./pages/Calendar/Calendar').then(m => ({ default: m.Calendar })));
const Habits = lazy(() => import('./pages/Habits/Habits').then(m => ({ default: m.Habits })));
const Notes = lazy(() => import('./pages/Notes/Notes').then(m => ({ default: m.Notes })));
const Settings = lazy(() => import('./pages/Settings/Settings').then(m => ({ default: m.Settings })));

const PageFallback = () => (
  <div className="app-page-fallback">
    <div className="skeleton app-skeleton-fallback-title" />
    <div className="skeleton app-skeleton-fallback-banner" />
    <div className="skeleton app-skeleton-fallback-content" />
  </div>
);

const AppContent: React.FC = () => {
  const { activeSection, settings } = useAppContext();

  React.useEffect(() => {
    if (settings?.theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [settings?.theme]);

  return (
    <>
      <Layout>
        <Suspense fallback={<PageFallback />}>
          {activeSection === 'home' && <Dashboard />}
          {activeSection === 'tasks' && <Tasks />}
          {activeSection === 'habit' && <Habits />}
          {activeSection === 'focus' && <div className="app-placeholder-section">Focus Component Placeholder</div>}
          {activeSection === 'calendar' && <Calendar />}
          {activeSection === 'categories' && <Categories />}
          {activeSection === 'stats' && <div className="app-placeholder-section">Stats Component Placeholder</div>}
          {activeSection === 'notes' && <Notes />}
          {activeSection === 'settings' && <Settings />}
        </Suspense>
      </Layout>
      <TaskModal />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
