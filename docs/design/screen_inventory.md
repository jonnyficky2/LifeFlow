# Screen Inventory & Page Details

This document details all pages within the LifeFlow app.

## 1. Dashboard
* **Tujuan**: Memberikan overiew cepat (bird's-eye view) tentang apa yang harus dilakukan hari ini, habit yang harus dicentang, dan ringkasan AI.
* **Informasi**: Today's tasks, Habit streaks, Quick Notes, AI Daily Brief.
* **Komponen UI**:
  * Greeting Header (e.g., "Good morning, Jofi")
  * Summary Widgets (Cards)
  * Quick Add Button (Floating/Top right)
  * AI Insights Panel
* **User Flow**: Buka app -> Lihat Dashboard -> Klik Quick Add untuk tambah task/note -> Centang habit hari ini -> Klik task untuk melihat detail.
* **Empty State**: "You have a blank canvas today. [Add a Task] or [Start a Habit]". Ilustrasi minimalis.
* **Loading State**: Skeleton loaders untuk widget cards.
* **Error State**: "Failed to load your daily overview. [Retry]".

## 2. Tasks
* **Tujuan**: Manajemen tugas yang mendalam, melihat deadline, backlog, dan project.
* **Informasi**: List of tasks (To Do, In Progress, Done), Due dates, Tags/Projects, Priority flags.
* **Komponen UI**:
  * Kanban Board / List View toggle
  * Task Card (Checkbox, Title, Due Date, Tag)
  * Filter/Sort Dropdown
  * Task Detail Modal (Description, Subtasks)
* **User Flow**: Buka Tasks -> Filter berdasarkan "Today" atau "Project" -> Tambah task baru -> Edit detail task -> Tandai selesai.
* **Empty State**: "No tasks here. Enjoy your free time or [Add a new task]."
* **Loading State**: Skeleton rows.
* **Error State**: Inline error message, "Unable to sync tasks."

## 3. Notes
* **Tujuan**: Tempat menangkap ide dengan cepat, mencatat materi kuliah, menggunakan markdown.
* **Informasi**: Folders/Tags list, Note list, Editor area.
* **Komponen UI**:
  * Two-pane layout (Sidebar list + Main Editor)
  * Rich Text / Markdown Editor
  * Search Bar
  * Last edited timestamp
* **User Flow**: Buka Notes -> Cari note atau buat baru -> Ketik menggunakan markdown -> AI auto-tagging (opsional) -> Note tersimpan otomatis.
* **Empty State**: (Left pane) "No notes found." (Main pane) "Select a note or create a new one."
* **Loading State**: Editor spinner / Skeleton text lines.
* **Error State**: "Changes not saved. You are offline." (Peringatan dengan warna Amber).

## 4. Habits
* **Tujuan**: Membangun konsistensi harian.
* **Informasi**: Habit list, weekly progress grid (GitHub-style contribution graph), Current streak, Best streak.
* **Komponen UI**:
  * Habit Tracker Grid/Row (7 hari terakhir)
  * Progress Bar (Mingguan)
  * Confetti animation (saat habit tercapai)
* **User Flow**: Buka Habits -> Tap pada hari ini untuk mencentang habit -> Lihat animasi success -> Cek statistik bulanan.
* **Empty State**: "What habit do you want to build? [Create Habit]"
* **Loading State**: Skeleton grid.
* **Error State**: "Could not update habit. [Retry]"

## 5. AI Assistant
* **Tujuan**: Chat interface untuk meminta AI menjadwalkan tugas, merangkum notes, atau memberi saran produktivitas.
* **Informasi**: Chat history, Suggested prompts.
* **Komponen UI**:
  * Chat Window (Message bubbles)
  * Prompt Input (dengan auto-resize)
  * Suggestion Chips ("Summarize my tasks today", "Draft an email")
  * Typing indicator
* **User Flow**: Buka AI -> Pilih suggestion chip ATAU ketik prompt -> AI merespon -> User mengklik action di dalam respon AI (misal: tombol "Add to Tasks" dari text AI).
* **Empty State**: "I'm your LifeFlow Assistant. How can I help you be productive today?" beserta suggestion chips.
* **Loading State**: AI typing indicator (3 dots bouncing).
* **Error State**: "Sorry, my brain is taking a break (Connection Error). [Try again]"

## 6. Settings
* **Tujuan**: Mengatur preferensi app, tema, akun, dan integrasi.
* **Informasi**: Profile info, Theme settings, Data export, App integrations.
* **Komponen UI**:
  * Vertical Tabs (Account, Appearance, Notifications, Integrations)
  * Toggle Switches
  * Danger Zone (Delete Account / Clear Data)
* **User Flow**: Klik profile avatar -> Settings -> Ubah theme ke Dark Mode -> Simpan.
* **Empty State**: N/A.
* **Loading State**: Overlay spinner.
* **Error State**: "Failed to save preferences."