import React from 'react';
import {
  House,
  ListChecks,
  Repeat,
  Timer,
  Calendar,
  ChartColumn,
  ChartLine,
  FileText,
  Settings,
  Search,
  Sparkles,
  Pencil,
  Trash2,
  TriangleAlert,
  Clock,
  RotateCcw,
  StickyNote,
  Ellipsis,
  Pin,
  User,
  Palette,
  Bell,
  Zap,
  Database,
  File,
  Smartphone,
  Target,
  Book,
  Dumbbell,
  Droplets,
  Moon,
  Sun,
  Heart,
  Brain,
  Coffee,
  Bike,
  Footprints,
  Apple,
  ChevronLeft,
  Check,
  type LucideIcon,
} from 'lucide-react';

const icons = {
  home: House,
  tasks: ListChecks,
  habits: Repeat,
  focus: Timer,
  calendar: Calendar,
  reports: ChartLine,
  notes: StickyNote,
  settings: Settings,
  search: Search,
  spark: Sparkles,
  edit: Pencil,
  trash: Trash2,
  warning: TriangleAlert,
  clock: Clock,
  reset: RotateCcw,
  chart: ChartColumn,
  document: FileText,
  more: Ellipsis,
  pin: Pin,
  user: User,
  palette: Palette,
  bell: Bell,
  zap: Zap,
  database: Database,
  file: File,
  smartphone: Smartphone,
  /* Ikon habit: nama disimpan sebagai string di Habit.icon */
  target: Target,
  book: Book,
  dumbbell: Dumbbell,
  droplets: Droplets,
  moon: Moon,
  sun: Sun,
  heart: Heart,
  brain: Brain,
  coffee: Coffee,
  bike: Bike,
  footprints: Footprints,
  apple: Apple,
  back: ChevronLeft,
  check: Check,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export const Icon: React.FC<{ name: IconName; size?: number; className?: string }> = ({ name, size = 18, className }) => {
  const Component = icons[name] || icons.target;
  return (
    <Component
      size={size}
      strokeWidth={1.8}
      className={className ? `icon ${className}` : 'icon'}
      aria-hidden="true"
    />
  );
};
