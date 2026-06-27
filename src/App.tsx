import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Tasks } from './pages/Tasks/Tasks';
import { Categories } from './pages/Categories/Categories';
import { TaskModal } from './components/modals/TaskModal';
import { Calendar } from './pages/Calendar/Calendar';
import { Habits } from './pages/Habits/Habits';
import { Notes } from './pages/Notes/Notes';

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
        {activeSection === 'home' && <Dashboard />}
        {activeSection === 'tasks' && <Tasks />}
        {activeSection === 'habit' && <Habits />}
        {activeSection === 'focus' && <div style={{ padding: '24px' }}>Focus Component Placeholder</div>}
        {activeSection === 'calendar' && <Calendar />}
        {activeSection === 'categories' && <Categories />}
        {activeSection === 'stats' && <div style={{ padding: '24px' }}>Stats Component Placeholder</div>}
        {activeSection === 'notes' && <Notes />}
        {activeSection === 'settings' && <div style={{ padding: '24px' }}>Settings Component Placeholder</div>}
      </Layout>
      <TaskModal />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
