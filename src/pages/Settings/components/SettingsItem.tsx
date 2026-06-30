import React from 'react';

interface SettingsItemProps {
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  children?: React.ReactNode;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({ title, description, rightElement, children }) => {
  return (
    <div className="settings-row">
      <div className="settings-row-label">
        <span className="settings-row-title">{title}</span>
        {description && <span className="settings-row-desc">{description}</span>}
        {children}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};
