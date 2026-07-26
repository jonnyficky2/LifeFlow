import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from './AppContext';
import { usePersistentState } from '../hooks/usePersistentState';
import type { AppSettings } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = usePersistentState<AppSettings>(STORAGE_KEYS.SETTINGS, {});

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettingsContext must be used within SettingsProvider');
  return context;
};
