import os
import re

base_dir = '/Users/jofi/Documents/PROJECT/LifeFlow/src/hooks'

# useTasks.ts
with open(f'{base_dir}/useTasks.ts', 'r') as f:
    content = f.read()
content = content.replace("import { useAppContext } from '../context/AppContext';", "import { useTaskContext } from '../context/TaskContext';")
content = content.replace("useAppContext();", "useTaskContext();")
content = content.replace("saveHistorySnapshot", "saveTaskSnapshot")
with open(f'{base_dir}/useTasks.ts', 'w') as f:
    f.write(content)

# useHabits.ts
with open(f'{base_dir}/useHabits.ts', 'r') as f:
    content = f.read()
content = content.replace("import { useAppContext } from '../context/AppContext';", "import { useHabitContext } from '../context/HabitContext';")
content = content.replace("useAppContext();", "useHabitContext();")
content = content.replace("saveHistorySnapshot", "saveHabitSnapshot")
with open(f'{base_dir}/useHabits.ts', 'w') as f:
    f.write(content)

# useNotes.ts
with open(f'{base_dir}/useNotes.ts', 'r') as f:
    content = f.read()
content = content.replace("import { useAppContext } from '../context/AppContext';", "import { useNoteContext } from '../context/NoteContext';")
content = content.replace("import type { Note } from '../context/AppContext';", "import type { Note } from '../types';")
content = content.replace("useAppContext();", "useNoteContext();")
content = content.replace("saveHistorySnapshot", "saveNoteSnapshot")
with open(f'{base_dir}/useNotes.ts', 'w') as f:
    f.write(content)

print("Hooks updated")
