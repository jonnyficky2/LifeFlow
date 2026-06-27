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
- **Status:** DONE
- **Dependencies:** TASK-102
- **Acceptance Criteria:** Render daftar Habit, kotak grid bisa diklik (Optimistic UI Update).
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** UAT Lulus. Kode telah di-push ke main.

---

## M5 - Notes (IN PROGRESS)
*(Area catatan bebas berbasis Markdown)*

### [TASK-501] Two-Pane Notes Editor
- **Description:** Layar Notes terbagi dua (Daftar Note di Sidebar kiri, Editor Markdown di kanan).
- **Priority:** Low
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** Bisa membuat note baru, list note ter-render di kiri, mengetik di kanan akan tersimpan otomatis (auto-save).
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** UAT Lulus. M5 telah di-push ke main.

---

## M5.5 - Product Polish
*(Peningkatan Kualitas dan Stabilitas)*

Deskripsi: "Milestone ini berfokus pada peningkatan kualitas, performa, konsistensi UI/UX, maintainability, accessibility, dan kesiapan aplikasi menuju Release v1.0."

### [TASK-551] UI Consistency Audit
- **Description:** Audit spacing, typography, icon, button, modal, dan card.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** spacing konsisten, typography konsisten, icon konsisten, button konsisten, modal konsisten, card konsisten.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** CSS refactor via design tokens selesai.

### [TASK-552] Empty States & Skeleton Loading
- **Description:** Tambahkan status kosong dan loading yang baik.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** semua halaman memiliki Empty State, skeleton loading konsisten, tidak ada blank screen.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** Komponen Skeleton dan EmptyState terintegrasi ke seluruh app.

### [TASK-553] Toast & Notification System
- **Description:** Komponen notifikasi terpusat.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** success, warning, error, info menggunakan satu komponen yang sama.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** Toast global system terintegrasi dengan useTasks, useNotes, dan useHabits.

### [TASK-554] Accessibility Audit
- **Description:** Pastikan aksesibilitas aplikasi terpenuhi.
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** None
- **Acceptance Criteria:** keyboard navigation, focus indicator, aria label yang diperlukan, color contrast layak, responsive tetap baik.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-555] Performance Optimization
- **Description:** Optimalisasi tanpa optimisasi prematur.
- **Priority:** Low
- **Status:** TODO
- **Dependencies:** None
- **Acceptance Criteria:** React.memo bila diperlukan, useMemo/useCallback bila memang memberi manfaat, lazy loading halaman yang sesuai, mengurangi render yang tidak perlu.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** Jangan melakukan optimisasi prematur; hanya jika ada manfaat yang jelas.

### [TASK-556] Error Handling
- **Description:** Tangani error global dengan baik.
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** None
- **Acceptance Criteria:** Error Boundary, fallback UI, graceful error message, tidak ada white screen ketika error.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-557] Code Cleanup & Refactor
- **Description:** Merapikan struktur kode proyek.
- **Priority:** Low
- **Status:** TODO
- **Dependencies:** None
- **Acceptance Criteria:** menghapus dead code, menghapus import tidak terpakai, merapikan struktur komponen, meningkatkan readability, tidak mengubah perilaku aplikasi.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-558] Release Candidate Audit
- **Description:** Audit kelayakan pra-rilis.
- **Priority:** High
- **Status:** TODO
- **Dependencies:** TASK-551, TASK-552, TASK-553, TASK-554, TASK-555, TASK-556, TASK-557
- **Acceptance Criteria:** npm run build PASS, TypeScript PASS, lint PASS, tidak ada console error, UAT PASS, siap ditandai sebagai Release Candidate sebelum M6.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

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
