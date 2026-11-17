import React from 'react';

interface SettingsSectionProps {
  id?: string;
  title: string;
  icon?: React.ReactNode | string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ id, title, icon, children, className }) => {
  return (
    <div className={`settings-card ${className ?? ''}`.trim()} id={id}>
      <h3>{icon}{title}</h3>
      {children}
    </div>
  );
};
