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

const PageFallback = () => (
  <div style={{ padding: '24px' }}>
    <div className="skeleton" style={{ height: '40px', width: '30%', borderRadius: '8px', marginBottom: '24px', backgroundColor: 'var(--color-surface-strong)' }} />
    <div className="skeleton" style={{ height: '120px', width: '100%', borderRadius: '12px', marginBottom: '16px', backgroundColor: 'var(--color-surface-strong)' }} />
    <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: '12px', backgroundColor: 'var(--color-surface-strong)' }} />
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
          {activeSection === 'focus' && <div style={{ padding: '24px' }}>Focus Component Placeholder</div>}
          {activeSection === 'calendar' && <Calendar />}
          {activeSection === 'categories' && <Categories />}
          {activeSection === 'stats' && <div style={{ padding: '24px' }}>Stats Component Placeholder</div>}
          {activeSection === 'notes' && <Notes />}
          {activeSection === 'settings' && <div style={{ padding: '24px' }}>Settings Component Placeholder</div>}
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
