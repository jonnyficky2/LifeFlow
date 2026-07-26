export interface Subtask {
  name: string;
  done: boolean;
}

export interface Task {
  name: string;
  deadline: string;
  time: string;
  location: string;
  note: string;
  priority: string;
  done: boolean;
  completedDates: string[];
  streak: number;
  lastCompleted: string | null;
  subtasks: Subtask[];
  reminder: string;
  tags: string[];
}

export interface Category {
  name: string;
  tasks: Task[];
}

export type HabitRepeatType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface HabitRepeatConfig {
  type: HabitRepeatType;
  customDays?: number[]; // [0-6] dimana 0 adalah Sunday
  customDate?: number; // [1-31] untuk monthly
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  repeat?: HabitRepeatConfig;
  time?: string;
}

export type HabitHistory = Record<string, string[]>;

export type StreakData = string[];
export type HistoryData = Record<string, number>;
export interface AppSettings {
  theme?: string;
  [key: string]: unknown;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Teks raw Markdown
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  time?: string;
  reminder?: string;
  isPinned?: boolean;
}
