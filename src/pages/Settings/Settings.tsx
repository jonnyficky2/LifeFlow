import React, { useRef, useState } from 'react';
import './Settings.css';
import { SettingsSection } from './components/SettingsSection';
import { SettingsItem } from './components/SettingsItem';
import { useAppContext, STORAGE_KEYS } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/ui/Modal';
import { privacyPolicy, termsOfService, openSourceLicenses } from '../../data/legalContent';
import packageJson from '../../../package.json';

export const Settings: React.FC = () => {
  const { 
    isAppLoading, appData, xp, habits, habitHistory, streakData, historyData, notes, settings, setSettings 
  } = useAppContext();
  const { showToast } = useToast();
  const { user, loginWithGoogle, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLegalModalOpen, setLegalModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');

  const showLegalModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setLegalModalOpen(true);
  };

  const showPrivacyPolicy = () => {
    showLegalModal('Privacy Policy', privacyPolicy);
  };

  const showTermsOfService = () => {
    showLegalModal('Terms of Service', termsOfService);
  };

  const showOpenSourceLicenses = () => {
    const licenses = openSourceLicenses(packageJson.dependencies, packageJson.devDependencies);
    showLegalModal('Open Source Licenses', licenses);
  };


  // Basic mock stats for now
  const allTasks = appData ? appData.flatMap(cat => cat.tasks) : [];
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.done).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleExport = () => {
    const exportPayload = {
      appData,
      xp,
      habits,
      historyData,
      habitHistory,
      streakData,
      notes
    };

    const dataString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([dataString], { type: "application/json" });
    const a = document.createElement("a");
    
    a.href = URL.createObjectURL(blob);
    a.download = `lifeflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(a.href);
    showToast("Data exported successfully!", 'success');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);

        localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(imported.appData || []));
        localStorage.setItem(STORAGE_KEYS.XP, (Number(imported.xp) || 0).toString());
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(imported.habits || []));
        localStorage.setItem(STORAGE_KEYS.HISTORY_DATA, JSON.stringify(imported.historyData || {}));
        localStorage.setItem(STORAGE_KEYS.HABIT_HISTORY, JSON.stringify(imported.habitHistory || {}));
        localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(imported.streakData || []));
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(imported.notes || []));

        showToast("Data restored successfully! Reloading...", 'success');
        
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        console.error("Import error:", err);
        showToast("Corrupted or invalid file.", 'error');
      }
    };

    event.target.value = "";
    reader.readAsText(file);
  };

  const handleResetData = () => {
    setConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev: any) => ({ ...prev, theme: e.target.value }));
  };

  if (isAppLoading) {
    return (
      <div className="settings-wrapper" style={{ padding: '24px' }}>
        <div className="skeleton-title" style={{ width: '200px', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '200px', borderRadius: '12px', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '150px', borderRadius: '12px', marginBottom: '16px' }} />
      </div>
    );
  }

  return (
    <div className="settings-wrapper" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--color-text)' }}>⚙ Settings</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-muted)' }}>Manage your preferences, account, and data</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* 1. Account */}
        <SettingsSection title="Account" icon="👤">
          <div className="settings-profile">
            <img
              src={user?.photoURL || '/assets/icons/people.png'}
              alt="Profile"
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }}
            />
            <div className="settings-profile-info">
              <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--color-text)' }}>
                {user ? (user.displayName || 'LifeFlow User') : 'Guest User'}
              </h4>
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px' }}>
                {user ? user.email : 'Local Data Only'}
              </p>
              {user && (
                <span style={{ fontSize: '12px', color: '#48d66d', marginTop: '4px', display: 'inline-block' }}>● Signed In</span>
              )}
            </div>
          </div>
          <SettingsItem title="">
            {!user ? (
              <button id="settingsLoginBtn" className="settings-btn outline" style={{ width: '100%', marginTop: '8px' }} onClick={loginWithGoogle}>
                Sign In with Google
              </button>
            ) : (
              <button id="settingsLogoutBtn" className="settings-btn outline" style={{ width: '100%', marginTop: '8px' }} onClick={logout}>
                Sign Out
              </button>
            )}
          </SettingsItem>
        </SettingsSection>

        {/* 2. Appearance */}
        <SettingsSection title="Appearance" icon="🎨">
          <SettingsItem title="Theme" description="Select your app theme" rightElement={
            <select className="settings-select" value={settings?.theme || 'system'} onChange={handleThemeChange}>
              <option value="system">System Default</option>
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          } />
        </SettingsSection>

        {/* 3. Notifications */}
        <SettingsSection title="Notifications" icon="🔔">
          <SettingsItem title="Habit Reminders" description="Get notified for incomplete habits" rightElement={
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          } />
          <SettingsItem title="Task Reminders" description="Get notified for upcoming tasks" rightElement={
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          } />
          <SettingsItem title="Daily Summary" description="Morning overview of your day" rightElement={
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          } />
          <SettingsItem title="Sound Notification" description="Play sound on completion" rightElement={
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          } />
        </SettingsSection>

        {/* 4. Productivity */}
        <SettingsSection title="Productivity" icon="⚡">
          <SettingsItem title="Start of Week" description="First day of the calendar" rightElement={
            <select className="settings-select" defaultValue="monday">
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          } />
          <SettingsItem title="Default Task Priority" description="When creating new tasks" rightElement={
            <select className="settings-select" defaultValue="medium">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          } />
          <SettingsItem title="Default Calendar View" description="Initial view for calendar" rightElement={
            <select className="settings-select" defaultValue="month">
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
          } />
          <SettingsItem title="Habit Goal Display" description="How to show progress" rightElement={
            <select className="settings-select" defaultValue="percentage">
              <option value="percentage">Percentage</option>
              <option value="count">Count (e.g., 2/5)</option>
            </select>
          } />
        </SettingsSection>

        {/* 5. Data Management */}
        <SettingsSection title="Data Management" icon="💾">
          <SettingsItem title="Sync Status" description="Not synced" rightElement={
            <button className="settings-btn">Sync Now</button>
          } />
          <SettingsItem title="Backup Data" description="Download a backup JSON" rightElement={
            <button className="settings-btn outline" onClick={handleExport}>Export</button>
          } />
          <SettingsItem title="Restore Data" description="Restore from JSON backup" rightElement={
            <>
              <button className="settings-btn outline" onClick={() => fileInputRef.current?.click()}>Import</button>
              <input type="file" ref={fileInputRef} accept=".json" style={{ display: 'none' }} onChange={handleImport} />
            </>
          } />
        </SettingsSection>

        {/* 6. Statistics Summary */}
        <SettingsSection title="Your Statistics" icon="📊">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Total Tasks</span>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>{totalTasks}</div>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Completion Rate</span>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>{completionRate}%</div>
            </div>
          </div>
        </SettingsSection>

        {/* Legal & Information */}
        <SettingsSection title="Legal & Information" icon="📄" style={{ marginTop: '24px' }}>
          <SettingsItem title="Privacy Policy" description="Privacy policy and user data protection." rightElement={
            <button className="settings-btn outline" onClick={showPrivacyPolicy}>View</button>
          } />
          <SettingsItem title="Terms of Service" description="Terms and conditions for using LifeFlow." rightElement={
            <button className="settings-btn outline" onClick={showTermsOfService}>View</button>
          } />
          <SettingsItem title="Open Source Licenses" description="Licenses for third-party libraries used." rightElement={
            <button className="settings-btn outline" onClick={showOpenSourceLicenses}>View</button>
          } />
        </SettingsSection>

        {/* App Installation */}
        <SettingsSection title="App Installation" icon="📱" style={{ marginTop: '24px' }}>
          <SettingsItem title="PWA Application" description="Install LifeFlow on your device for offline access." rightElement={
            <button className="settings-btn outline">Install App</button>
          } />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Danger Zone" icon="⚠️" style={{ marginTop: '24px', border: '1px solid var(--color-danger)' }}>
          <SettingsItem title="Reset Data" description="Clear all local data and restore defaults" rightElement={
            <button className="settings-btn danger" style={{ background: 'var(--color-danger)', color: '#ffffff' }} onClick={handleResetData}>Reset Application Data</button>
          } />
        </SettingsSection>

      </div>

      {/* Reset Data Confirmation Modal */}
      {confirmOpen && (
        <div className="modal show">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '24px', borderRadius: '12px' }}>
            <h3>Reset Application Data</h3>
            <p style={{ margin: '16px 0', color: 'var(--color-muted)' }}>Are you sure you want to permanently delete all your tasks, habits, and notes? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={handleConfirmReset}>Reset Data</button>
              <button className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isLegalModalOpen} onClose={() => setLegalModalOpen(false)} title={modalTitle}>
        {modalContent}
      </Modal>
    </div>
  );
};
