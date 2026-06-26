import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Tasks } from './pages/Tasks/Tasks';
import { Categories } from './pages/Categories/Categories';
import { TaskModal } from './components/modals/TaskModal';

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
        {activeSection === 'habit' && <div style={{ padding: '24px' }}>Habit Component Placeholder</div>}
        {activeSection === 'focus' && <div style={{ padding: '24px' }}>Focus Component Placeholder</div>}
        {activeSection === 'calendar' && <div style={{ padding: '24px' }}>Calendar Component Placeholder</div>}
        {activeSection === 'categories' && <Categories />}
        {activeSection === 'stats' && <div style={{ padding: '24px' }}>Stats Component Placeholder</div>}
        {activeSection === 'notes' && <div style={{ padding: '24px' }}>Notes Component Placeholder</div>}
        {activeSection === 'settings' && <div style={{ padding: '24px' }}>Settings Component Placeholder</div>}
      </Layout>
      <TaskModal />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
