import React from 'react';

type IconName = 'home' | 'tasks' | 'habits' | 'focus' | 'calendar' | 'reports' | 'notes' | 'settings' | 'search' | 'spark' | 'edit' | 'trash' | 'warning' | 'clock' | 'reset' | 'chart' | 'document';

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-6h6v6"/></>,
  tasks: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 2 2 4-4"/><path d="M8 8h8"/></>,
  habits: <><path d="M4 12a8 8 0 1 0 8-8"/><path d="M4 4v6h6"/><path d="M12 8v4l3 2"/></>,
  focus: <><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2M9 2h6"/></>,
  calendar: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  reports: <><path d="M4 19V5M4 19h17"/><path d="m7 15 3-4 3 2 5-7"/></>,
  notes: <><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></>,
  settings: <><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m4.9 4.9 1.4 1.4M17.7 6.3l1.4-1.4M4 12H2M22 12h-2M4.9 19.1l1.4-1.4M17.7 17.7l1.4 1.4M12 2v2M12 20v2"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  spark: <><path d="m12 3 1.5 6.5L20 11l-6.5 1.5L12 19l-1.5-6.5L4 11l6.5-1.5Z"/></>,
  edit: <><path d="m4 16-.8 4.8L8 20l10.5-10.5a2.1 2.1 0 0 0-3-3Z"/><path d="m14 7 3 3"/></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/></>,
  warning: <><path d="m12 3 9 17H3Z"/><path d="M12 9v4M12 17h.01"/></>,
  clock: <><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></>,
  reset: <><path d="M4 12a8 8 0 1 0 2-5"/><path d="M4 4v5h5"/></>,
  chart: <><path d="M4 19V5M4 19h17"/><path d="M7 15v-3M11 15V8M15 15v-5M19 15v-8"/></>,
  document: <><path d="M5 3h10l4 4v14H5z"/><path d="M15 3v5h4"/></>,
};

export const Icon: React.FC<{ name: IconName; size?: number; className?: string }> = ({ name, size = 18, className }) => (
  <svg className={`icon ${className ?? ''}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
);
