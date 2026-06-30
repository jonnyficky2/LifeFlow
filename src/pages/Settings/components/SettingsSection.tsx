import React from 'react';

interface SettingsSectionProps {
  id?: string;
  title: string;
  icon?: React.ReactNode | string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ id, title, icon, children, style }) => {
  return (
    <div className="settings-card" id={id} style={style}>
      <h3>{icon && <span style={{ marginRight: '8px' }}>{icon}</span>}{title}</h3>
      {children}
    </div>
  );
};
