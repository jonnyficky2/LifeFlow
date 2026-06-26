# 📌 LifeFlow Single Source of Truth: TASK BOARD

Dokumen ini adalah papan kendali operasional untuk pengembangan LifeFlow.
Task dikelompokkan berdasarkan **Milestone**. Selalu perbarui status task mengikuti [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md). Status Lifecycle fitur keseluruhan ada di [MODULES.md](./MODULES.md).

---

## M1 - Foundation
*(Setup Project, App Shell, & Global CSS)*

### [TASK-101] Setup Project & Global CSS Foundation (Vite + React + TS)
- **Description:** Inisialisasi arsitektur React dan adaptasi `style.css` legacy.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** Build sukses tanpa error, global styling konsisten.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** Diselesaikan di iterasi awal.

### [TASK-102] Simplify Navigation & App Shell
- **Description:** Buat layout utama aplikasi (Sidebar + Main Content). Berdasarkan audit UX, sisakan menu Dashboard, Tasks, Notes, Habits, dan Settings.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-101
- **Acceptance Criteria:** Sidebar merender menu utama dengan visual Active/Inactive, navigasi berpindah komponen.
- **Progress:** 100%
- **Related Docs:** UI Patterns, Design System.
- **Notes:** Menggunakan background `#F9FAFB`. Mobile layout responsif diimplementasikan.

---

## M2 - Task Management
*(Migrasi Core Task Logic, UI Tasks, dan Modal)*

### [TASK-201] Migrasi Logic & Komponen UI Tasks
- **Description:** Implementasikan fitur utama CRUD tugas, integrasikan Modal, dan pasang manajemen State di AppContext dengan dukungan LocalStorage, fitur Undo/Redo, dan Dark Mode.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-102
- **Acceptance Criteria:** Fitur berjalan identik dengan legacy. UI sesuai dengan style.css.
- **Progress:** 100%
- **Related Docs:** [UAT_CHECKLIST_PHASE2.md](../testing/UAT_CHECKLIST_PHASE2.md)
- **Notes:** UAT Lulus. UX friction resolved (inline category creation).

### [TASK-202] Inline Task Input (Zero-Friction)
- **Description:** Hapus sistem penambahan Task tradisional (modal panjang) untuk penambahan cepat. Buat input satu baris (command line style) persis di atas halaman Tasks.
- **Priority:** Medium
- **Status:** BACKLOG
- **Dependencies:** TASK-201
- **Acceptance Criteria:** Menekan "Enter" membuat task baru, field langsung bersih.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** Optimalisasi User Experience (UX) lanjutan.

---

## M3 - Calendar
*(Tampilan Kalender & Sinkronisasi Deadline)*

### [TASK-301] Foundation Calendar Module
- **Description:** Implementasi halaman kalender bulanan, integrasi AppContext untuk membaca task berdasarkan deadline, highlight tanggal, dan empty state.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-201
- **Acceptance Criteria:** Render kalender bulan ini, tugas muncul di dalam tanggal yang tepat.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** UAT Lulus (Visual grid border perlu penyesuaian CSS global nanti, namun fungsionalitas kalender dan klik modal lulus).

---

## M4 - Habit Tracker (IN PROGRESS)
*(Grid Kontribusi Github-style)*

### [TASK-401] Habit Tracker Grid UI
- **Description:** Bangun antarmuka Habit berupa kalender kontribusi bergaya GitHub (grid baris mingguan) dan persentase sukses bulanan.
- **Priority:** Medium
- **Status:** BUILD PASS
- **Dependencies:** TASK-102
- **Acceptance Criteria:** Render daftar Habit, kotak grid bisa diklik (Optimistic UI Update).
- **Progress:** 95%
- **Related Docs:** None
- **Notes:** Fitur selesai di-build, menunggu UAT manual pengguna.

---

## M5 - Notes
*(Penyimpanan Jurnal dan Teks)*

### [TASK-501] Two-Pane Notes Editor
- **Description:** Layar Notes terbagi dua (Daftar Note di Sidebar kiri, Editor Markdown di kanan).
- **Priority:** Medium
- **Status:** BACKLOG
- **Dependencies:** TASK-102
- **Acceptance Criteria:** List notes di kiri bisa diklik, auto-save teks yang diketik.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** Gunakan Markdown Editor yang ringan, jangan WYSIWYG berat.

---

## M6 - Analytics
*(Global Analytics & Focus Timer)*

### [TASK-601] Focus Timer
- **Description:** Pomodoro-style timer yang terhubung langsung dengan penyelesaian Tasks.
- **Priority:** Low
- **Status:** BACKLOG
- **Dependencies:** TASK-201
- **Acceptance Criteria:** Timer dapat dihitung mundur, sesi dicatat ke data harian.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

---

## M7 - AI Workspace
*(Ekstraksi otomatis dan generative features)*

### [TASK-701] Invisible AI: Extract Tasks from Notes
- **Description:** Tambahkan tombol (✨ AI) di dalam editor Notes untuk mengekstrak paragraf menjadi To-Do list dan dikirim ke modul Tasks.
- **Priority:** Low
- **Status:** BACKLOG
- **Dependencies:** TASK-501, TASK-201
- **Acceptance Criteria:** API mendeteksi frasa aksi dan meresolusi menjadi Task Item terstruktur.
- **Progress:** 0%
- **Related Docs:** API Docs (Gemini/OpenAI)
- **Notes:** Fokus pada "Invisible AI", bukan antarmuka chatbot full-screen.

---

## M8 - Team Collaboration
*(Fase lanjut skalabilitas)*

*(Fitur berbagi dan kolaborasi ditangguhkan ke masa depan)*
