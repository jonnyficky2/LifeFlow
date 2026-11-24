# Session Log

---

## 2026-11-24 — Firestore Rules Fix & setState-in-Render Fix (TASK-1505, TASK-1507)
- **Status:** `[TASK-1505]` dan `[TASK-1507]` **DONE** (Manual UAT PASS oleh pengguna, 2026-11-24); `[TASK-1508]` tetap `TESTING` (90%).
- **Pekerjaan Sesi Ini:**
  - Diagnosis `permission-denied` pada 8 dokumen `users/{uid}/state/*`: rule `request.time < timestamp.date(2026, 7, 4)` sudah kedaluwarsa dan rule `request.auth.uid == userId` dipasang di `match /{document=**}` yang tidak mendefinisikan `userId`. Pengguna mengganti rules dengan `match /users/{userId}/{document=**} { allow read, write: if request.auth != null && request.auth.uid == userId; }` dan simulator `get`/`create`/`update`/`delete` menjadi allowed.
  - Perbaikan warning React "Cannot update a component (`AppProvider`) while rendering a different component (`TaskProvider`)" di `src/hooks/useTasks.ts`: `toggleTask` tidak lagi memanggil `setAppData` dengan updater yang di dalamnya memanggil `setStreakData`/`setHistoryData`/`setXp`; data baru dihitung dari `appData` lalu `setAppData(newData)` dan setter provider lain dipanggil di luar updater.
  - Verifikasi otomatis (Chrome headless CDP): tambah task via quick-add → toggle checkbox → task masuk `.task.done`. Hasil: 0 warning `setState-in-render`, 0 console error.
  - Catatan sisa: log `Fetch API cannot load https://firestore.googleapis.com/... due to access control checks` bukan penolakan rules (tidak ada kode `permission-denied`), melainkan blokir transport di browser; perlu diuji ulang dengan extension/privacy blocker dimatikan.
- **Rencana Berikutnya:** `[TASK-1508]` (import backup + reset data) menunggu Manual UAT; `[TASK-1506]` (browser QA) dan `[TASK-1504]` (ikon/logo) belum dimulai.
- **Build/Lint:** `npm run build` PASS; `npm run lint` 0 error (1 warning lama `react-hooks/exhaustive-deps` di `useHabits.ts`).

---

## 2026-11-23 — TASK-1505 Responsive & Theme Parity Verification
- **Status:** `[TASK-1505]` di status `TESTING` (menunggu Manual UAT); `[TASK-1508]` tetap `TESTING`.
- **Pekerjaan Sesi Ini:**
  - Audit responsive + theme menggunakan Chrome headless (CDP) pada viewport 375x812, 390x844, 768x1024, 1024x768, 1280x800, dan 1440x900 untuk halaman Dashboard, Tasks, Notes, Calendar, Habits, Focus, Reports, dan Settings, baik dark maupun light mode.
  - Hasil: tidak ada horizontal overflow (`documentElement.scrollWidth === innerWidth`) dan tidak ada console error/uncaught exception pada semua kombinasi viewport × halaman. Modal Add Task (termasuk Advanced Options), Unified Search, dan Sidebar muat dalam viewport 375px.
  - Perbaikan responsive:
    - `Habits.css`: header Habits di ≤640px stacked, judul rata kiri dengan ikon sebaris, tombol `+ Add habit` full-width.
    - `Calendar.css`: judul bulan di ≤480px diperkecil ke 1.1rem dan `nowrap` agar tidak terpotong dua baris di antara tombol Prev/Next.
  - Perbaikan theme parity:
    - `style.css`: tab `All/Pending/Done` kembali flat (tanpa gradient/border) di light mode dan underline aktif dipertahankan.
    - `style.css`: tombol bottom nav light mode tidak lagi mendapat border dari aturan generik, sehingga identik dengan dark mode.
  - Keyboard `focus-visible` (outline 2px) terverifikasi pada seluruh Tab stop navbar, sidebar, dan bottom nav.
  - **Verifikasi**: `npm run build` PASS; `npm run lint` 0 error (1 warning lama `react-hooks/exhaustive-deps` di `useHabits.ts`).
- **Rencana Berikutnya:**
  - Manual UAT `[TASK-1505]` oleh pengguna pada 6 viewport target (dark + light).
  - Sebelum UAT `[TASK-1507]`, verifikasi Firestore rules untuk path `users/{uid}/state/*`.

---

## 2026-11-16 — Milestone M14 Completion & TASK-1501 Task-First Dashboard Implementation
- **Status:** M14 (`TASK-1403`, `TASK-1404`) **DONE** (lulus validasi UAT pengguna); M15 `[TASK-1501]` di status `TESTING` siap untuk Manual UAT.
- **Pekerjaan Sesi Ini:**
  - Menandai Milestone M14 (AI Companion & Retrieval) sebagai `DONE` di [TASK_BOARD.md](docs/project/TASK_BOARD.md) dan [MODULES.md](docs/project/MODULES.md) berdasarkan konfirmasi UAT pengguna.
  - Implementasi **`[TASK-1501]` (Define Task-First Dashboard and Navigation Hierarchy)**:
    - **Task-First Dashboard (`Dashboard.tsx`)**:
      - Header dengan dynamic greeting waktu & nama pengguna, tanggal terformat jelas, dan primary action `+ Add task`.
      - Panel **Today & Overdue**: menyaring task pending terpenting (overdue di posisi teratas dengan tag merah, task deadline hari ini, atau inbox pending).
      - Interaktivitas langsung: checkbox di row dashboard untuk menyelesaikan task secara instan (memperbarui XP, streak, dan histori), serta tombol judul task untuk membuka modal detail/edit `TaskModal`.
      - Indikator status terstandar: `.dashboard-task-tag--overdue`, `.dashboard-task-tag--today`, waktu, dan nama kategori.
      - **Quick Stats Simetris (4 Kartu)**: Remaining, Completed today, Due today, dan Habits today (konsistensi habit harian).
    - **Navigation Hierarchy (`Sidebar.tsx` & `BottomNav.tsx`)**:
      - Mengelompokkan navigasi Sidebar desktop secara semantik: **Workspace** (Dashboard, Tasks, Notes), **Planning** (Calendar, Habits, Focus Timer), **Insights** (Reports), dan **System** (Settings).
      - Menambahkan styling label grup navigasi `.sidebar-group-label` dan perbaikan `min-height: 44px` serta scroll container pada sidebar.
      - Menambahkan ikon SVG `more` di `Icon.tsx` dan menerapkannya pada tombol "More options" di `BottomNav.tsx` untuk konsistensi sistem ikon tanpa teks simbol/emoji.
  - **Verifikasi**: `npm run lint` (0 error) dan `npm run build` (lulus bersih dalam 86ms).
- **Rencana Berikutnya:**
  - Melakukan Manual UAT untuk `[TASK-1501]` (uji aksi checklist di Dashboard, klik edit task, dan grouped navigasi sidebar).
  - Melanjutkan pengerjaan ke **`[TASK-1502]` (Standardize Primary Actions, Search, Profile, and Utility Controls)**.

---
- **Status:** M14 (`TASK-1403`, `TASK-1404`) di status `TESTING` menunggu konfirmasi Manual UAT; M15 siap dikerjakan.
- **Pekerjaan Sesi Ini:**
  - Audit dan verifikasi status implementasi `AiChatDrawer.tsx` dan `UnifiedSearchModal.tsx`.
  - Mendaftarkan global keyboard shortcut `⌘J` / `Ctrl+J` untuk membuka/menutup LifeFlow AI Assistant Drawer langsung dari mana saja.
  - Memperbarui tooltip dan `aria-label` tombol AI di Navbar (`⌘J / Ctrl+J`).
  - Membersihkan file komponen redundan `AiAssistantModal.tsx` dan stylesheet terpisah agar tidak terjadi double-mount dengan `AiChatDrawer`.
  - Verifikasi linting (`oxlint` 0 error) dan build (`tsc -b && vite build` lolos dalam 68ms).
  - Push commit ke branch `main`: `d3cf1a6`.
- **Rencana Berikutnya:**
  - Melakukan pengujian Manual UAT bersama pengguna untuk `TASK-1403` & `TASK-1404` (Actionable Cards & AI Assistant Integration).
  - Melanjutkan pengerjaan ke **Milestone M15** (Post-Release UX Simplification & Responsive Remediation), diawali dengan `[TASK-1501]` (Define Task-First Dashboard and Navigation Hierarchy).

---

## 2026-11-13 — M15 Post-Release UX Audit Documentation
- **Status:** Documentation updated; implementation and Manual UAT not started.
- **Scope:** Recorded static audit findings for Dashboard hierarchy, navigation discoverability, primary actions, profile-to-Settings flow, compact task feedback, icon/logo consistency, CSS/token ownership, responsive behavior, theme parity, and accessibility.
- **Updated documents:** `TASK_BOARD.md`, `UI_AUDIT.md`, `DESIGN_REVIEW.md`, `COMPONENT_LIBRARY.md`, `USER_FLOWS.md`, `WIREFRAMES.md`, `REQUIREMENTS.md`, and `UAT_CHECKLIST_FINAL.md`.
- **New work:** Added M15 tasks `TASK-1501` through `TASK-1506`, all `NOT_STARTED`; no previous UAT result was rewritten.
- **Verification:** `npm run build` PASS; `npm run lint` PASS before documentation edits.
- **Evidence limit:** Browser clicks, input journeys, runtime console/network, screenshots, and cross-device visual comparison remain UNVERIFIED because browser automation is unavailable in this session.
- **Next action:** Start with `TASK-1501` after reviewing the M15 design direction in `docs/design/DESIGN_REVIEW.md`.

id: SESSION-001
type: Session Log
parent: docs/project/DEVELOPMENT_WORKFLOW.md
child: None
reference: docs/project/TASK_BOARD.md
---

## 2026-07-25
- **Mobile Responsive Audit & Fixes (Status: TESTING):**
  - Melakukan audit responsivitas layar mobile dan tablet (320px - 1024px) untuk seluruh modul aplikasi.
  - Memperbaiki layout utama dengan mengubah viewport height `100vh` menjadi `100dvh` pada body, sidebar, dan error boundary untuk performa optimal di browser mobile modern.
  - Menyelaraskan padding and height untuk `.navbar` dan `.app-main` agar mendukung area aman (safe area insets) pada iPhone (notch compatibility).
  - Menyesuaikan `#bottomNav` dengan safe-area-inset-bottom dan menstandarkan touch target size tombol menu minimal 44x44px.
  - Mengubah layout grid statistik `#quickStats` dan ukuran kartu di mobile untuk menghindari pemotongan teks.
  - Memperbaiki modal overlay agar menggunakan scrolling overflow (`align-items: flex-start`, `overflow-y: auto`) ketika tinggi modal melebihi tinggi layar ponsel.
  - Memperbaiki layout Notes metadata bar dan Settings row agar stack secara vertikal/wrap di layar kecil (320px - 480px) untuk menghindari horizontal scroll.
  - Memastikan seluruh modul terkompilasi bersih (`npm run build`) dan lulus pemeriksaan linting (`npm run lint`).

## 2026-06-30
- **Legacy Feature Parity Audit & Restoration Plan Completed (Status: DONE):**
  - Melakukan audit keselarasan fitur (Feature Parity) secara menyeluruh antara proyek JavaScript Legacy (Single Source of Truth) dan React + TypeScript.
  - Membandingkan status implementasi dari seluruh halaman, modul, komponen UI/UX, database, dan pengaturan.
  - Menemukan gap utama: fungsionalitas menu `Focus Timer`, `Statistics/Reports`, `Settings` (sebagian besar), `Authentication` (Firebase Auth Google login), dan dukungan `PWA` masih berupa placeholder atau belum dipindahkan.
  - Mendokumentasikan seluruh temuan secara detail di [LEGACY_PARITY_AUDIT.md](file:///Users/jofi/Documents/PROJECT/LifeFlow/docs/project/LEGACY_PARITY_AUDIT.md).
  - Menyusun usulan milestone baru beserta pemecahan task-task kecil yang mendetail untuk setiap gap fitur (deskripsi, prioritas, dependensi, kriteria penerimaan, estimasi risiko, estimasi file terdampak, dan skenario manual UAT) di dalam [LEGACY_RESTORATION_PLAN.md](file:///Users/jofi/Documents/PROJECT/LifeFlow/docs/project/LEGACY_RESTORATION_PLAN.md).

## 2026-06-29
- **[TASK-575] Final UI Polish & Dialog Migrations Completed (Status: TESTING):**
  - Menghapus semua static inline styles (`style={{...}}`) dari seluruh komponen JSX/TSX: `Dashboard.tsx`, `Tasks.tsx`, `Habits.tsx`, `Notes.tsx`, `Categories.tsx`, `TaskModal.tsx`, `Sidebar.tsx`, `ErrorBoundary.tsx`, `Calendar.tsx`, `App.tsx`, `EmptyState.tsx`, dan `Navbar.tsx`.
  - Memindahkan seluruh gaya inline statis tersebut ke kelas CSS yang terorganisir di dalam file stylesheet yang sesuai (`style.css`, `Habits.css`, `Notes.css`, `Calendar.css`, `forms.css`, `empty-states.css`, `index.css`).
  - Menyediakan transition tokens terstandar (`--transition-micro`, `--transition-smooth`, `--transition-drawer`) di `variables.css` sesuai spesifikasi `docs/design/INTERACTIONS.md`.
  - Menyeragamkan ukuran tombol edit/delete beserta penataan margin, padding, border, dan transition pendukung pada Categories list agar sejalan dengan task item list.
  - Mengeliminasi 100% pemanggilan dialog native browser (`window.prompt`, `window.confirm`) di seluruh codebase: pengeditan kategori kini menggunakan form inline text input, pembuatan habit menggunakan custom React modal dialog, dan konfirmasi penghapusan (tasks, habits, notes, categories, reset app) diganti dengan custom React confirmation modal overlay yang sejalan dengan Design System.
  - Berhasil memverifikasi build akhir (`npm run build`) dan linting (`npm run lint`) bebas error dan regresif.
- **[TASK-573] Card & Layout Standardization Completed (Status: DONE / UAT PASS):**
  - Membersihkan `src/index.css` dengan menghapus deklarasi `:root` variabel radius dan spacing redundan yang menimpa nilai standar di `variables.css`.
  - Mengubah `#levelBox` agar menggunakan `border-radius: var(--radius-lg)` (24px), `box-shadow: var(--shadow-lg)`, dan `backdrop-filter: blur(18px)` secara konsisten.
  - Memperbarui `.dashboard-panel` agar memiliki `box-shadow: var(--shadow-lg)` yang adaptif di tema gelap maupun terang.
  - Menyamakan `.stat-card` dengan panel utama dashboard menggunakan `border-radius: var(--radius-lg)` (24px) dan `box-shadow: var(--shadow-lg)`.
  - Mengubah `.sidebar-streak-card` di `style.css` dan `navbar.css` ke radius Medium `var(--radius-md)` (18px) dan bayangan halus `var(--shadow-sm)`.
  - Menghubungkan `.task` (kartu tugas) ke `border-radius: var(--radius-sm)` (8px) dan `box-shadow: var(--shadow-sm)`.
  - Mengisolasi `.habit-row` di `style.css` dan `Habits.css` agar secara independen menggunakan `border-radius: var(--radius-md)` (18px) dan `box-shadow: var(--shadow-md)` (serta `var(--shadow-lg)` dan translasi Y saat hover).
  - Menambahkan kelengkungan sudut halus `border-radius: var(--radius-sm)` (8px) pada item catatan sidebar `.note-item` di `Notes.css`.
  - **Resolusi Bug Manual UAT**:
    - **BUG-001**: Ganti prompt pembuatan kategori dengan input inline interaktif dan tombol Create/Cancel di bawah daftar tugas `Tasks.tsx` serta menghubungkan action edit kategori ke AppContext.
    - **BUG-002**: Menambahkan CSS Reset layer untuk `input[type="checkbox"]` dan `input[type="radio"]` di `forms.css` untuk mencegah tabrakan style input 44px global dan mengaktifkan kembali checkmark (✓) bawaan browser.
    - **BUG-003**: Memindahkan panggilan toast notification `showToast` ke luar dari callback state update `setAppData` di `useTasks.ts` untuk mencegah duplikasi pemanggilan di React Strict Mode.
    - **BUG-004**: Menambahkan style `body.light-mode .habit-cell.is-completed` di `Habits.css` agar status habit selesai tetap berwarna hijau/warna habit di Light Theme.
    - **BUG-005**: Mengubah nilai inisial `activeSection` di `AppContext.tsx` dari `'dashboard'` ke `'home'` agar Dashboard ter-render otomatis saat pertama membuka project dan menghindari blank screen.
    - **BUG-006**: Menambahkan event `onKeyDown` pada input judul catatan di `Notes.tsx` agar teks `"Untitled Note"` langsung terhapus dan digantikan dengan karakter pertama yang diketik secara instan tanpa perlu seleksi/penghapusan manual.
  - Sukses memverifikasi hasil build (`npm run build`) dan linting (`npm run lint`) bebas dari error.

## 2026-06-27
- **UI Regression Audit, TASK-561, TASK-569, TASK-570, and TASK-571 (Restore UI Consistency) Completed:**
  - Melakukan audit investigasi atas regresi visual di Release Candidate v1 (M5.5) dan mengubah statusnya menjadi **FAILED**.
  - Menginisiasi Milestone **M5.6 - UI Restoration** dengan tiket TASK-561 sampai TASK-568.
  - **Menyelesaikan `[TASK-561] Restore Layout Wrapper`**:
    - Menghubungkan font Poppins dari Google Fonts CDN ke dalam `index.html`.
    - Mengimpor `src/index.css` di `src/main.tsx`.
    - Membersihkan `src/index.css` dari global body background dan font style overrides.
  - **Menyelesaikan `[TASK-569] Simplify Task Creation UX`**:
    - Menyederhanaan UI dengan menghapus tombol `⤢` dan menambahkan "+" trailing icon absolut.
  - **Menyelesaikan `[TASK-570] Design System & UX Consistency Audit`**:
    - Menulis dokumentasi sistem desain terpadu di `docs/design/DESIGN_SYSTEM.md`.
    - Menulis daftar temuan audit di `docs/project/UI_AUDIT.md`.
  - **Menyelesaikan `[TASK-571] Restore UI Consistency`**:
    - Menyatukan sistem warna global (Light & Dark), spacing, radius, dan shadows di dalam `variables.css`.
    - Mengimpor `variables.css` ke `index.css` agar terdistribusikan secara global di bundler.
    - Menonaktifkan tiga blok `:root` redundan dan saling menabrak di `style.css` demi variables.css sebagai *single source of truth*.
    - Menambahkan `z-index: 1500` pada `.app-sidebar` di `style.css` agar tidak tertutup overlay gelap `z-index: 1400` di mobile.
    - **Resolusi Regresi Visual Hasil UAT 1**:
      - *Bottom Navigation*: Menghubungkan ID `#bottomNav` di `BottomNav.tsx` dan menstrukturkan tombol nav-item agar memiliki default, active, dan hover states berbasis Design Tokens tanpa warna hardcoded, serta mencegah overlap teks.
      - *Level Box & Badge*: Menyematkan styling warna teks (`var(--color-text)`, `var(--color-muted)`) dan warna bar (`var(--color-bg-deep)`) secara eksplisit di Light Mode untuk menghindari teks menyatu dengan latar belakang terang.
      - *Notes Sidebar Grouping*: Menerapkan sistem pengelompokan tanggal notes (Today, Yesterday, date strings) dengan visual header divider yang terstandar di `Notes.tsx` dan `Notes.css`.
      - *Calendar Borders*: Mendeklarasikan alias CSS variables (`--bg-secondary`, `--border-color`, dll.) di `variables.css` agar visual borders & backgrounds pada sel kalender di Light/Dark themes terender tajam dan konsisten.
    - **Resolusi Regresi Visual Hasil UAT 2**:
      - *Task Inline Input*: Menghapus inline style background/border/color pada input "What needs to be done today?" di `Tasks.tsx` dan memindahkannya ke kelas `.inline-task-input` di `style.css` agar secara dinamis mewarisi styling input global (warna background, border kontras tinggi, focus glow, dan placeholder standar) pada kedua tema.
      - *Task Search Container*: Menambahkan kelas kontainer `.search-box`, `.toolbar`, `.backup-box`, dan `.filter-box` ke daftar override Light Mode di `style.css` untuk mencegah penggunaan latar belakang gelap/hardcoded di Light Theme.
      - *Habit List Container*: Menghubungkan kelas `.habit-row` (card Habit) ke styling global card (`.habit-card`/`.category`) di `style.css` untuk Dark/Light mode dan hover transition, sehingga latar belakangnya berubah menjadi putih transparan yang serasi di Light Theme.
    - **Resolusi Regresi Visual Hasil UAT 3**:
      - *CSS Variables Engine*: Memaksa re-evaluasi CSS variable aliases (seperti `--bg-primary`, `--bg-secondary`, `--border-color`, `--text-color`, `--text-secondary`, `--card`, `--card-border`) dengan mendeklarasikannya ulang di dalam blok `body.light-mode` di `variables.css`. Ini mengatasi kendala warisan (*inheritance quirk*) pada peramban yang menahan nilai *computed* Dark Theme.
      - *Habit Icon*: Menambahkan pemilih eksplisit `.habit-icon`, `.habit-cell` (empty state), dan `.habit-cell.is-future` di bawah aturan `body.light-mode` di `Habits.css` agar terender dengan warna latar belakang dan border terang yang selaras.
      - *Notes Wrapper*: Menambahkan override eksplisit `body.light-mode` untuk seluruh elemen Notes (`.notes-wrapper`, `.notes-sidebar`, editor panel, notes list, active states, textareas) di `Notes.css` agar tidak ada warna gelap yang tersisa.
      - *Calendar Grid & States*: Menambahkan aturan override eksplisit `body.light-mode` untuk sel kalender (`.calendar-cell`, hover state, `.is-today`, `.is-selected`, `.is-empty`, dan panel detail pilihan) di `Calendar.css` guna memastikan visualnya 100% akurat terhadap Design Tokens.
    - **Resolusi Regresi Visual Hasil UAT 4**:
      - *Category List*: Memperbaiki kartu item Category di `Categories.tsx` dengan mengganti inline style `background: 'var(--dash-bg)'` dan `var(--dash-text-muted)` (yang tidak terdefinisi secara dinamis di Light Mode) menjadi variabel standar Design System: `background: 'var(--color-bg-deep)'`, `border: '1px solid var(--color-border)'`, `color: 'var(--color-text)'`, dan `color: 'var(--color-muted)'`. Hal ini memastikan visualnya rapi, kontras tinggi, dan adaptif di kedua tema.
    - **Resolusi Audit Regresi Tema UI Menyeluruh (Full UI Theme Regression Audit)**:
      - *Standardisasi Variabel Boilerplate*: Menambahkan pemetaan `--danger-color`, `--success-color`, dan `--warning-color` pada `:root` dan `body.light-mode` di `variables.css`.
      - *Perbaikan Overrides style.css*: Menggantikan seluruh warna hardcoded pada selektor `body.light-mode` (seperti `#172033` -> `var(--color-text)`, `#5d6b82` -> `var(--color-muted)`, `#ffffff` -> `var(--color-surface)`) dan gradien latar belakang body (`#eef4ff`/`#f8fbff` -> `var(--bg-light-2)`/`var(--bg-light-1)`) agar 100% konsisten dengan Design Tokens.
      - *Clean up Legacy xp-bar*: Menghapus deklarasi kelas `.light-mode .xp-bar` duplikat yang memiliki style hardcoded, agar progress bar level di dashboard murni ter-render dengan design tokens.
      - *Standardisasi Tombol*: Mengganti warna latar belakang gradien dan border tombol light mode (`#ffffff`, `#e2e8f0`, `#d1d5db`) dengan tokens (`var(--color-surface)`, `var(--color-bg-deep)`, `var(--color-border)`).
      - *BottomNav & DayBox*: Mengubah warna latar belakang aktif Bottom Navigation dan kontainer `.day-box` menjadi `var(--color-bg-deep)` alih-alih nilai hardcoded.
      - *React Inline Styles & Modals*: Mengganti fallback hardcoded `#f0f0f0` dan inline styles border `rgba(...)` pada subtask list dan advanced options di `TaskModal.tsx` dengan `var(--color-bg-deep)` and `var(--color-border)`. Serta memperbarui item tugas terpilih pada `Calendar.tsx` dengan variabel token standar.
      - *Modular CSS Cleanup*: Menggantikan hex warna fungsional status (`#EF4444`, `#10B981`, `#F59E0B`) di `Habits.css`, `Notes.css`, dan `Calendar.css` dengan variabel CSS (`var(--color-danger)`, `var(--color-success)`, `var(--color-warning)`).
      - *Audit Sidebar & Navbar*: Mengganti warna teks, hover state, active state, close button, label, dan border pada sidebar (`.sidebar-item`, `.sidebar-close`, `.sidebar-label`, `.sidebar-email`, `.sidebar-profile-img`) serta border navbar profil user (`.nav-user-img`) dan background `.sidebar-toggle span` dari hardcoded hex ke Design Tokens (`var(--color-text)`, `var(--color-muted)`, `var(--color-border)`, `var(--color-primary)`).
    - Status `[TASK-571]` tetap dalam status **TESTING** untuk proses UAT ulang oleh user.
  - Berhasil menjalankan `npm run build` and `npm run lint` dengan status PASS 100% (bebas error).

## 2026-06-26
- **Audit Tahap 2 & Resolusi Bug:**
  - Melakukan identifikasi perbedaan class CSS antara `legacy_html_version` dan `React`.
  - Memperbaiki `Sidebar.tsx` untuk toggle CSS classes: `sidebar-open` dan overlay `sidebar-overlay-show`.
  - Memperbaiki class Navbar toggle dari `is-active` menjadi `active`.
  - Mengonversi elemen `BottomNav.tsx` untuk sepenuhnya mengikuti pola class DOM dari versi legacy.
  - Memperbaiki layout `Tasks.tsx` dan `Dashboard.tsx` dengan memberikan padding class `section-page` dan `dashboard-wrapper`.
  - Mengubah cara render `TaskModal.tsx` agar menggunakan `.show` toggle sesuai `modal.css`, menghindari bug bertumpuk *z-index*.
  - Menyambungkan fungsionalitas UI krusial yang tertinggal (Undo/Redo History Stack dan Theme Toggle Dark/Light) menggunakan `AppContext.tsx`.
- **Hasil:** Build sukses. Seluruh 15 Poin 'Definition of Done' untuk Fase 2 adalah [PASS]. Status dialihkan ke [DONE].

- **Repository Housekeeping (Documentation Freeze v1.0):**
  - Melakukan audit struktural atas duplikasi dan file usang.
  - Mengamankan file legacy tanpa menghapus histori dengan memindahkannya ke `docs/archive/`.
  - Menganalisis `package.json` dan `.gitignore`, lalu menambahkan folder-folder `build`, `cache`, dan temporary.
  - Menulis laporan kebersihan di `REPOSITORY_AUDIT.md`.
  - Persiapan akhir sebelum fokus penuh ke fase testing/implementasi lanjutan.

- **M2 Bug Fix & M3 Calendar Foundation (Execution Mode v1.0):**
  - Memperbaiki *bug* duplikasi pembuatan *task* yang disebabkan oleh mutasi referensi objek pada *React Strict Mode* (TASK-201 disahkan ke DONE).
  - Mengimplementasikan `Calendar.tsx` dan `Calendar.css` untuk pondasi Milestone 3.
  - Mengintegrasikan data sinkron dari `appData` (berdasarkan `deadline`) ke dalam bentuk *grid* bulanan.
  - Menyelesaikan dua gesekan UX dari *feedback* UAT:
    1. Menyambungkan `TaskModal` ke tugas di Kalender agar dapat diedit langsung.
  - TASK-301 telah di-commit, push, dan statusnya resmi menjadi DONE.

- **M4 Habit Tracker (Execution Mode v1.0):**
  - Mengimplementasikan `[TASK-401] Habit Tracker Grid UI`.
  - Merancang arsitektur data `Habit` dan `HabitHistory` berbasis Record di `AppContext.tsx`.
  - Membuat `useHabits.ts` untuk menangani toggle habit dengan fitur *Undo/Redo* bawaan.
  - Membangun UI *Github-style contribution grid* sepanjang 90 hari di komponen `<Habits />` dengan dukungan *Optimistic Update*.
  - Menerima *"PASS"* pada saat UAT manual. Melakukan Commit & Push ke branch main. Tugas selesai (DONE).

- **M5 Notes Editor (Execution Mode v1.0):**
  - Mengimplementasikan `[TASK-501] Two-Pane Notes Editor`.
  - Membuat `Note` interface dan hook `useNotes.ts` di dalam `AppContext.tsx`.
  - Merancang *Split Layout* murni menggunakan `<textarea>` native untuk menjaga performa dan kesederhanaan sistem.
  - Memasang logika *Debounced Auto-Save* 500ms agar aplikasi tidak memuat ulang (*re-render*) secara membabi buta ketika pengguna mengetik dengan cepat.
  - Menerima *"PASS"* pada saat UAT manual. Melakukan Commit & Push ke branch main. Tugas selesai (DONE).
- Selesai mengimplementasikan TASK-601 (Settings Page Foundation).
- Menyelesaikan Manual UAT BUG-001 (Tombol Danger Zone missing label).
- Melakukan finalisasi TASK-574 dan TASK-601 di documentation.
- Selesai mengimplementasikan TASK-602 (Import / Export JSON Backup).
- Menyelesaikan Manual UAT TASK-602 dengan hasil PASS.
- Melakukan finalisasi TASK-602 di documentation.
- Selesai mengimplementasikan TASK-603 (Reset Application Data).
- Menyelesaikan Manual UAT TASK-603 dengan hasil PASS setelah fix regresi (mengganti native window.confirm dengan React modal).
- Melakukan finalisasi TASK-603 di documentation.
- Selesai mengimplementasikan TASK-604 (Theme Preferences).
- Menyelesaikan Manual UAT TASK-604 dengan hasil PASS.
- Melakukan finalisasi TASK-604 di documentation.
- Selesai mengimplementasikan TASK-605 (Dashboard Feature Parity).
- Menyelesaikan Manual UAT TASK-605 dengan hasil PASS.
- Melakukan finalisasi TASK-605 di documentation.
- Selesai mengimplementasikan TASK-701 (Notes Metadata).
- Menyelesaikan Manual UAT TASK-701 dengan hasil PASS.
- Melakukan finalisasi TASK-701 di documentation.
- Selesai mengimplementasikan TASK-702 (Notes Pinning).
- Menyelesaikan Manual UAT TASK-702 dengan hasil PASS.
- Melakukan finalisasi TASK-702 di documentation.
- Selesai mengimplementasikan TASK-703 (Habit Repeat Rules).
- Menyelesaikan Manual UAT TASK-703 dengan hasil PASS.
- Melakukan finalisasi TASK-703 di documentation.
- Selesai mengimplementasikan TASK-704 (Habit Scheduling).
- Menyelesaikan Manual UAT TASK-704 dengan hasil PASS.
- Melakukan finalisasi TASK-704 di documentation.
- Selesai mengimplementasikan TASK-801 (Focus Timer).
- Selesai mengimplementasikan TASK-802 (XP Integration).
- Menyelesaikan Manual UAT TASK-801 dengan hasil PASS.
- Melakukan finalisasi TASK-801 dan TASK-802 di documentation.
- Selesai mengimplementasikan TASK-803 (Confetti & Sound).
- Menyelesaikan Manual UAT TASK-803 dengan hasil PASS.
- Selesai mengimplementasikan TASK-804 (Dashboard Dynamic Quotes) menggunakan arsitektur QuoteProvider (Local First).
- Menyelesaikan Manual UAT TASK-804 dengan hasil PASS.
- Menyelesaikan Milestone 8 (M8 - Focus Timer & Gamification).

## 2026-07-15
- **Logo Size Adjustment (Status: DONE):**
  - Mengubah ukuran logo Navbar (`.navbar-logo`) menjadi 28px x 28px dengan `object-fit: contain` di `src/assets/css/style.css` dan `src/assets/css/navbar.css`.
  - Mengubah ukuran logo Sidebar (`.app-sidebar-brand .sidebar-profile-img`) menjadi 36px x 36px dengan `object-fit: contain` di `src/assets/css/style.css` dan `src/assets/css/navbar.css`.
  - Menyinkronkan perubahan yang sama ke stylesheet legacy di `legacy_html_version/css/style.css` dan `legacy_html_version/css/navbar.css`.
- **CSS Lint Warnings Clean Up (Status: DONE):**
  - Menghapus ruleset kosong `.navbar__login-btn` yang tidak digunakan di `src/assets/css/navbar.css` dan `legacy_html_version/css/navbar.css` untuk menyelesaikan peringatan linting "Do not use empty rulesets".
- **Startup Blur & PWA Icon Standardization (Status: DONE):**
  - Menyelesaikan **BUG 1 (Startup Blur)**: Mengubah kelas `.modal` pada dialog card di `AuthModal.tsx` menjadi `.modal-content` agar tidak disembunyikan secara default (`display: none;`) oleh ruleset `.modal`, sehingga login modal dapat terlihat dan tidak menyisakan layar blur kosong.
  - Menyelesaikan **BUG 2 (PWA & APK Checklist Icon)**: Menghapus file checklist hijau lama (`public/assets/icons/icon.svg` dan `icon2.svg`), memperbarui `index.html` dan `vite.config.ts` untuk menggunakan `/favicon.svg` (logo petir ungu) sebagai satu-satunya source of truth ikon aplikasi (Favicon browser, Safari/iOS Touch Icon, manifest PWA, Android APK, dan maskable icon).
- **Deployment Safari Caching & Google Auth Audit (Status: DONE):**
  - Menyelesaikan **BUG 1 (Safari Favicon "G")**: Menambahkan parameter cache-buster `?v=2` pada rujukan ikon dan apple-touch-icon di `index.html` guna memaksa Safari memperbarui cache favicon domain-wide-nya untuk sub-path `/LifeFlow/`.
  - Menyelesaikan **BUG 2 (Google Login Referrer Blocked)**: Melakukan audit menyeluruh dan menyusun laporan panduan konfigurasi authorized domains pada konsol Firebase dan pembatasan HTTP Referrers API Key pada konsol Google Cloud Platform (GCP) untuk membuka blokir permintaan otentikasi dari domain GitHub Pages (`jonnyficky2.github.io`).
- **Safari Favicon Compatibility Fix (Status: DONE):**
  - Menyalin logo petir ungu terbaru dari `public/favicon.svg` ke `public/assets/icons/icon.svg`.
  - Mengonversi `public/assets/icons/icon.svg` menjadi file multiresolusi `public/favicon.ico` menggunakan generator Node.js `svg-to-ico` via npx.
  - Memperbarui tag link favicon dan apple-touch-icon di `index.html` with base path `/LifeFlow/`, urutan spesifik, dan parameter cache-busting `?v=2` untuk memaksa Safari macOS/iOS memperbarui cache favicon-nya.
  - Memverifikasi hasil build akhir (`npm run build`) sukses tanpa error dan warning.
- **Default Avatar/Logo Fallback Audit (Status: DONE):**
  - Melakukan audit seluruh proyek terhadap referensi `people.svg`, `icon.svg`, `favicon.svg`, `"/assets/icons/"`, dan `photoURL`.
  - Mengubah fallback avatar di `Settings.tsx` dari `'/assets/icons/people.png'` menjadi `APP_LOGO`.
  - Memastikan seluruh proyek menggunakan `APP_LOGO` sebagai satu-satunya fallback ikon logo aplikasi ketika pengguna belum masuk (guest) atau masuk tanpa URL foto profil (`photoURL`).

## 2026-07-17
- **Milestone Phase 1 & 2 Execution (Status: DONE):**
  - Menyelesaikan perbaikan bug z-index overlay di mobile dengan mengubah `.app-sidebar` dari `z-index: 1500` menjadi `1600` agar berada di atas `.sidebar-overlay` (`z-index: 1400`) secara konsisten.
  - Meningkatkan aksesibilitas (a11y) interaksi keyboard pada grid sel Habit (`Habits.tsx`) dan sel Kalender/badge tugas (`Calendar.tsx`) dengan menambahkan `tabIndex={0}`, `role="checkbox"/"button"`, `aria-label`, serta handler `onKeyDown` (Space & Enter).
  - Melakukan pembersihan file CSS mati di `src/assets/css/` (14 file CSS yang sudah tidak di-import dihapus) dan `src/App.css`.
  - Melakukan pembersihan aset sampah untuk mengurangi beban PWA: menghapus `L.jpg` (**479 KB**), `people.png`, `icons.svg`, dan boilerplate Vite (`hero.png`, `react.svg`, `vite.svg`).
  - Menghapus direktori usang/kosong: `folder-kosong/`, `data/`, `design/`, `docs/governance/`, `docs/future/`, dan `project-plan/` (arsip perencanaan lama).
  - Merapikan konfigurasi Git dengan memperbarui `.gitignore` agar memblokir `.DS_Store` secara rekursif (`**/.DS_Store`).
  - Mengganti `README.md` default bawaan template Vite dengan dokumentasi developer LifeFlow yang lengkap (arsitektur local-first, panduan instalasi, dan struktur folder).
  - Memverifikasi build akhir (`npm run build`) 100% lulus tanpa kendala.

## 2026-10-30
- **[TASK-562] Restore Sidebar Layout & Responsive Fix (Status: DONE):**
  - Mengembalikan padding safe-area iPhone notch pada `.app-sidebar` (`calc(var(--space-6) + env(safe-area-inset-top)) 16px 24px calc(16px + env(safe-area-inset-left))`).
  - Menyelaraskan tata letak `.sidebar-header` dengan `display: flex; align-items: center; justify-content: space-between;` agar brand logo dan tombol close ter-align secara vertikal.
  - Memperbaiki tombol `.sidebar-close` pada media query mobile agar tetap `display: flex` (mencegah override `display: block` yang menyebabkan ikon × tidak terpusat).
  - Memverifikasi build lolos 100% tanpa error TypeScript dan Vite build.
  - Manual UAT divalidasi dan dinyatakan PASS oleh user.
  - Status tiket di TASK_BOARD.md diperbarui menjadi DONE.
- **[TASK-563] Restore Header & Navbar Alignment (Status: DONE):**
  - Menyelaraskan tinggi header/navbar 96px di desktop dan 70px di mobile dengan kalkulasi `env(safe-area-inset-top)`.
  - Menjadikan `.navbar-brand` interaktif (dapat diklik/di-Enter untuk kembali ke Dashboard) dan memastikan `pointer-events: auto;`.
  - Mengimplementasikan styling kelas `.btn--icon` terpadu untuk tombol Undo, Redo, dan Theme Toggle (ukuran 40px, rounded corners, hover/active elevation, dan dukungan Dark/Light mode).
  - Standarisasi tinggi tombol Auth login dan avatar menjadi 40px agar sejajar harmonis dengan ikon aksi lainnya.
  - Menghapus inline style `style={{marginRight: '12px'}}` pada JSX Navbar.
  - Menambahkan penyesuaian breakpoint responsive di 640px, 480px, dan 360px serta efek glassmorphism backdrop pada mobile agar konten scroll tidak bertabrakan dengan navbar.
  - Memverifikasi build akhir (`npm run build`) sukses 100% tanpa error.
  - Manual UAT divalidasi dan dinyatakan PASS oleh user.
  - Status tiket di TASK_BOARD.md diperbarui menjadi DONE.
- **[TASK-564] Restore Dashboard Layout, Level Box & Heatmap (Status: TESTING):**
  - Mengubah layout `#levelBox` dari 3-kolom kaku (`140px 1fr 140px`) menjadi 2-kolom proporsional (`minmax(180px, auto) 1fr`), menghilangkan void kosong sebelah kanan dan membuat judul level serta progress XP presisi.
  - Memulihkan Activity Panel (`.activity-panel`) yang sebelumnya tertimpa `display: none;`, mengembalikan tampilan activity heatmap 30 hari di halaman utama.
  - Merapikan susunan grid `#heatmap` menjadi 10 kolom × 3 baris di desktop dan 6 kolom × 5 baris di mobile (total 30 kotak simetris tanpa kotak yatim).
  - Menyeimbangkan `.dashboard-grid` menjadi 2-kolom seimbang (`1fr 1fr`) sehingga Activity Panel dan Motivation Panel memiliki tinggi dan batas border sejajar.
  - Memperbaiki tipografi dan styling quote motivasi (`#quoteText`) agar responsif penuh dan kontras jelas di mode terang maupun gelap.
  - Memverifikasi build lulus 100% tanpa error TypeScript dan Vite build.
  - Menyiapkan skenario Manual UAT untuk validasi user.
- **[TASK-565] Restore Bottom Navigation (Status: TESTING):**
  - Menghapus seluruh label teks tombol (`Home`, `Calendar`, `Habits`, `Stats`, `Notes`) pada komponen `BottomNav.tsx` dan mempertahankan ikon emoji terpusat.
  - Mengembalikan emoji legacy `🏠` untuk menu Home serta menyematkan ID tombol legacy (`#navHomeBtn`, `#navCalendarBtn`, `#navHabitBtn`, `#navStatsBtn`, `#navNotesBtn`) dan `aria-label` untuk mempertahankan standar aksesibilitas web.
  - Memperbarui styling `#bottomNav button` menjadi tombol berukuran 52x52px dengan `border-radius: 16px`, ukuran emoji 24px, dan efek interaktif mikro saat aktif/ditekan (`transform: scale(0.92)`).
  - Menyelaraskan padding `#bottomNav` (8px 12px) agar melayang proporsional di atas safe-area mobile (`calc(var(--space-3) + env(safe-area-inset-bottom))`) dan tetap tersembunyi secara otomatis di tampilan desktop (> 1100px).
  - Memverifikasi build akhir (`npm run build`) sukses tanpa TypeScript atau Vite error.
- **[TASK-567] Pixel Perfect Audit (Status: TESTING):**
  - Melakukan visual audit komparatif menyeluruh antara versi React + TypeScript dengan rancangan HTML/CSS legacy.
  - Memverifikasi keterbacaan dan penerapan font Poppins secara global di seluruh komponen teks, tombol, judul, dan angka statistik.
  - Mengonfirmasi konsistensi background gradient, border colors, dan shadow tokens di mode gelap (`dark-mode`) dan terang (`light-mode`).
  - Memeriksa kestabilan layout responsif di desktop (> 1100px), tablet (768px - 1100px), dan mobile (< 640px) tanpa clipping, overflow horizontal, atau tabrakan elemen.
  - Memverifikasi hasil build (`npm run build`) dan linting (`npm run lint`) bersih dengan 0 error.
- **[TASK-568] Release Candidate v2 (Status: TESTING):**
  - Menjalankan serangkaian pengujian integrasi akhir untuk Milestone UI Restoration: pemeriksaan linting (`npm run lint`), validasi tipe TypeScript (`tsc -b`), dan kompilasi production bundle (`vite build`).
  - Memverifikasi penataan Service Worker dan precache manifest PWA (`workbox`, `dist/sw.js`).
  - Seluruh kriteria penerimaan teknis terpenuhi tanpa error atau peringatan kritis.
  - Mempersiapkan rilis UI Restoration (M5) untuk validasi Manual UAT final oleh pengguna.
- **[TASK-1203] Final Manual UAT Preparation (Status: TESTING):**
  - Menyusun panduan dan matriks uji regresi menyeluruh untuk 9 modul utama aplikasi: Dashboard, Tasks & Categories CRUD, Habits Tracker, Calendar, Notes, Focus Timer, Reports & Statistics, Settings (Backup/Restore/Reset), serta Autentikasi dan PWA Offline.
  - Memverifikasi tidak adanya console error dan kompatibilitas penuh antar platform (Mobile & Desktop).
  - Menyiapkan langkah UAT bertahap bagi pengguna sebelum rilis publik akhir v1.0 (TASK-1204).
- **[TASK-1204] Release Candidate v1.0 (Status: TESTING):**
  - Menjalankan final build check: `tsc -b && vite build` PASS, `oxlint` PASS (0 errors), service worker & PWA precache tergenerasi.
  - Menyusun commit penutup Milestone dan menyiapkan tag rilis `v1.0` di git repository.
  - Aplikasi siap didistribusikan ke channel publik.

## 2026-11-18
- **[TASK-1503] Compact Task Completion Feedback (Status: DONE / UAT PASS):**
  - Menghapus border-left (garis aksen tipis) pada toast notifikasi untuk menghilangkan gaya AI-slop dan menjaga estetika *Calm UI*.
  - Membatasi jumlah pop-up toast aktif secara bersamaan di sudut kanan bawah menjadi maksimal 2 toast untuk mencegah tumpukan berlebih.
  - Menambahkan animasi pop-up feedback inline `+3 XP` pada baris task (`Tasks.tsx` & `Dashboard.tsx`) saat tugas diselesaikan.
  - Merapikan urutan tombol preset Focus Timer (`Focus.tsx`) secara kronologis dari kecil ke besar (`5, 10, 15, 25, 50 Min`).
  - Memverifikasi hasil build (`npm run build`) dan linting (`npm run lint`) sukses 100% tanpa error.
  - Manual UAT divalidasi dan dinyatakan PASS oleh user. Status tiket resmi diperbarui menjadi DONE.
- **Project Review & Next Task Planning:**
  - Membaca dokumen prinsip produk, visi, module registry, task board, dan development workflow.
  - Memeriksa status repository; tidak ada perubahan kode lokal yang belum tercatat.
  - Menemukan ketidaksinkronan dokumentasi: TASK-558 berstatus FAILED meski dependensinya selesai; TASK-1302 hingga TASK-1304 ditandai DONE di bagian "PENDING TASKS"; MODULES.md tampak belum diperbarui terhadap roadmap task board.
  - Kandidat lanjutan paling relevan adalah analisis ulang TASK-558, karena audit release sebelumnya gagal pada inspeksi visual UAT. Belum ada perubahan tiket atau implementasi; rencana scope dan penyebab kegagalan perlu disepakati sebelum coding sesuai workflow.
  - **[TASK-558] Re-audit:** Riwayat SESSION_LOG menunjukkan regresi M5.5 berasal dari import `index.css` yang hilang, override global yang menimpa style legacy, dan selector/layout UI yang tidak selaras. Pemulihan tercatat pada TASK-561 hingga TASK-571.
  - Pemeriksaan ulang teknis: `npm run build` PASS (termasuk TypeScript dan PWA bundle); `npm run lint` selesai dengan exit code 0 dan 10 warning. Status TASK-558 dipindahkan ke TESTING untuk menunggu Manual UAT akhir; belum dinyatakan DONE.
  - User menyatakan Manual UAT TASK-558 PASS. Status tiket diperbarui menjadi DONE dengan progress 100%.

## 2026-11-06
- **[TASK-202] Inline Task Input (Status: TESTING):**
  - Menambahkan quick-add satu baris di atas halaman Tasks dengan pilihan kategori; Enter membuat task melalui `addTask` dan mengosongkan input.
  - Menghapus input duplikat di bagian bawah setiap kategori.
  - `npm run build` PASS. `npm run lint` exit code 0 dengan 10 warning yang sudah ada pada context, Focus, dan `usePersistentState`; tidak ada warning di file TASK-202.
  - Manual UAT PASS oleh user; status tiket diperbarui menjadi DONE.
- **Code Hygiene & Documentation Synchronization (Status: DONE):**
  - Menyelesaikan warning linting `exhaustive-deps` pada `Focus.tsx` dengan membungkus `handleComplete` menggunakan `useCallback` dan memasukkannya ke dependency array `useEffect`.
  - Menghapus parameter error yang tidak terpakai pada block catch di `usePersistentState.ts`.
  - Mengonfigurasi rule override pada `.oxlintrc.json` untuk folder `src/context/` agar ekspor provider dan hook tidak memicu warning Fast Refresh.
  - Hasil linting (`npm run lint`) dan build (`npm run build`) kini 100% bersih (0 error, 0 warning).
- **[TASK-701] Invisible AI: Extract Tasks from Notes (Status: DONE):**
  - Membuat utility ekstraksi aksi [src/utils/aiExtractor.ts](src/utils/aiExtractor.ts) yang mengimplementasikan arsitektur *Invisible AI* & *Local-First* (mendeteksi checkbox markdown `- [ ]`, `TODO:`, frasa aksi Bahasa Indonesia/Inggris, deteksi prioritas cepat, dan opsi integrasi Google Gemini API via REST fetch).
  - Menambahkan metode `batchAddTasks` di [src/hooks/useTasks.ts](src/hooks/useTasks.ts) untuk penambahan tugas terstruktur sekaligus secara atomik dengan satu notifikasi toast dan snapshot history.
  - Menambahkan tombol tenang `✨ Extract Tasks` di header editor Notes [src/pages/Notes/Notes.tsx](src/pages/Notes/Notes.tsx) beserta modal review interaktif (memilih/mengedit nama tugas, mengubah prioritas, memilih kategori target, select/deselect all, dan menambahkan tugas terpilih).
  - Menambahkan opsi konfigurasi `Gemini API Key` opsional di halaman Pengaturan [src/pages/Settings/Settings.tsx](src/pages/Settings/Settings.tsx) di bawah bagian AI Workspace.
  - Memperbarui styling interaktif dan modal review di [src/pages/Notes/Notes.css](src/pages/Notes/Notes.css) yang adaptif terhadap Dark dan Light mode.
  - Memastikan hasil build (`npm run build`) dan linter (`npm run lint`) 100% lulus tanpa kendala (0 error, 0 warning).
  - Manual UAT divalidasi dan dinyatakan PASS oleh user. Status tiket resmi dialihkan ke DONE.

## 2026-11-07
- **[TASK-1401] Diagnosis error panggilan Gemini (Status: DONE / UAT PASS):**
  - Akar masalah pada pesan yang dilaporkan: semua error HTTP selain 401/403/404/429 (termasuk HTTP 400, respons umum untuk API key tidak valid) dipetakan ke pesan seolah koneksi internet bermasalah.
  - Menambahkan pembacaan aman atas detail error HTTP Gemini tanpa mencatat API Key; balasan kini membedakan key tidak valid, format request, billing, kuota, izin, model, layanan Gemini, dan kegagalan jaringan browser.
  - Pengguna memberikan bukti HTTP 503. Sesuai status layanan sementara overload/down, request kini mencoba satu kali ke model stabil Gemini 3.5 Flash-Lite setelah 503 dari Gemini 3.8 Flash.
  - Pengguna mengonfirmasi pertanyaan umum berhasil dijawab dan memberikan UAT PASS. TASK-1401 dialihkan ke DONE.
  - Build, lint, dan pemeriksaan diff diverifikasi; pengujian langsung API tidak dilakukan karena memakai API Key pribadi pengguna.
- **[M14] Hybrid Conversational AI (Status: DONE / UAT PASS):**
  - Mengimplementasikan sapaan dan identitas Jofi AI, daftar ringkas untuk permintaan area umum, serta klarifikasi task berdasarkan prioritas atau pilihan dari daftar sebelumnya.
  - Menjaga riwayat percakapan dalam memori sesi; pertanyaan umum ke Gemini tidak membawa konteks Tasks/Notes/Habits.
  - Pertanyaan LifeFlow dapat memakai Gemini dengan ringkasan konteks saat API Key tersedia, dan tetap memakai pencarian lokal saat offline/tanpa API Key.
  - Memperbarui kedua jalur Gemini dari model `gemini-1.5-flash` yang tidak lagi direkomendasikan ke `gemini-3.8-flash`; menambahkan pesan kegagalan khusus untuk timeout, API Key, izin, model, dan kuota.
  - Build dan lint PASS; pengguna menyatakan UAT fitur assistant PASS setelah jawaban umum berhasil diterima.
- **[TASK-1401] UAT lanjutan dan rancangan perilaku AI percakapan:**
  - Pengguna mengonfirmasi pencarian task “hari ini” kini berfungsi; TASK-1401 tetap TESTING sampai seluruh skenario UAT disetujui.
  - Menambahkan rancangan hybrid untuk sapaan, permintaan data yang ambigu, klarifikasi multi-turn, fallback lokal, dan privasi konteks Gemini ke [USER_FLOWS.md](../design/USER_FLOWS.md). Rancangan menunggu persetujuan sebelum implementasi.
- **Roadmap Expansion: M14 - AI Companion & Intelligent Retrieval (Personal OS Assistant):**
  - Menerima arahan produk dari pengguna untuk menghadirkan fitur AI Chat Assistant berbasis konteks data aplikasi (mampu menjawab pertanyaan seputar Tasks, Notes, dan kategori).
  - Menyepakati arah desain UI/UX: Mengusung estetika Glassmorphism khas LifeFlow (translusen, micro-border, blur halus, menyatu dengan tema Dark & Light mode) dan menjauh dari tampilan generic chatbot yang kaku (*Calm & Minimal UX*).
  - Memetakan 4 tiket baru pada TASK_BOARD.md:
    - [TASK-1401] Context-Aware Knowledge & Retrieval Engine (Local-first pattern matcher & Gemini fallback)
    - [TASK-1402] LifeFlow Glassmorphic AI Chat Interface
    - [TASK-1403] Deep-Linking & Actionable Result Cards
- **[TASK-1401] Context-Aware Knowledge & Retrieval Engine (Status: TESTING):**
  - Mengembangkan modul retrieval cerdas [src/utils/aiAssistant.ts](src/utils/aiAssistant.ts) untuk mengolah pertanyaan bahasa alami pengguna seputar Tasks, Notes, Habits, dan Jadwal/Deadline.
  - Mengimplementasikan `searchLocalKnowledge`: parser lokal offline (zero latency, privacy-first) dengan ekstraksi kata kunci cerdas, boundary word matching untuk single-character query (contoh: "Tugas A", "Task B"), serta algoritma skoring relevansi multi-faktor.
  - Mengimplementasikan `queryGeminiWithContext`: integrasi Gemini 1.5 Flash yang merangkum data aktif ke dalam prompt terstruktur, lengkap dengan penanganan fallback otomatis ke mesin pencari lokal jika offline atau terjadi kendala jaringan.
  - Menyediakan API terpadu `askAssistant` yang mengembalikan pesan balasan beserta referensi data terstruktur (ID, judul, tipe, kategori, dan section target).
  - Memverifikasi hasil build (`npm run build`) dan linting (`npm run lint`) sukses 100% tanpa error dan tanpa warning.

- **[TASK-1402] LifeFlow Glassmorphic AI Chat Interface (Status: DONE / UAT PASS):**
  - Menambahkan drawer chat glassmorphic dengan adaptasi tema Dark/Light, transisi buka, backdrop, dan layout penuh pada viewport ponsel.
  - Menambahkan tombol LifeFlow AI pada Navbar; drawer dapat ditutup dengan tombol, klik backdrop, atau Escape.
  - Menghubungkan komposer ke `askAssistant` menggunakan data Tasks, Notes, Habits dan Gemini API Key opsional; hasil menampilkan referensi non-klik untuk cakupan TASK-1403.
  - Verifikasi `npm run build`, `npm run lint`, dan `git diff --check` lulus; pengguna mengonfirmasi Manual UAT PASS.

- **[TASK-1401] Perbaikan pencarian task "hari ini" (Status: TESTING):**
  - Menemukan akar masalah: retrieval lokal sebelumnya mencocokkan kata kueri hanya terhadap nama, kategori, tag, dan catatan task, tanpa memeriksa deadline.
  - Menambahkan pengenalan frasa "hari ini"/"today" dan filter task berdasarkan deadline tanggal lokal perangkat.

## 2026-11-10
- **[TASK-1403] Deep-Linking & Actionable Result Cards (Status: TESTING):**
  - Mengimplementasikan deep-linking interaktif pada kartu referensi di [src/components/layout/AiChatDrawer.tsx](src/components/layout/AiChatDrawer.tsx): mengklik referensi task langsung membuka `TaskModal` dengan state task terpilih (`setEditingTask`), mengklik referensi note membuka halaman Notes dan memuat catatan yang sesuai via `activeNoteId` di [src/context/NoteContext.tsx](src/context/NoteContext.tsx), serta mengklik habit menavigasikan pengguna ke halaman Habit Tracker.
  - Menambahkan kelas modifikasi `.ai-chat-result--note` di [src/components/layout/AiChatDrawer.css](src/components/layout/AiChatDrawer.css) dengan warna latar belakang soft amber/warm tint yang berbeda dari task dan habit, lengkap dengan efek hover dan transisi mikro.
- **[TASK-1404] Offline Natural Language Task Commands & Unified Global Search (Status: TESTING):**
  - Mengembangkan parser perintah bahasa alami offline [src/utils/aiAssistant.ts](src/utils/aiAssistant.ts) (`parseOfflineTaskCommand`) yang bekerja 100% luring (zero network latency):
    - **Buat/Tambah Task:** Mengekstraksi nama task, waktu (contoh: "jam 9", "pukul 14.30"), batas waktu/deadline ("hari ini", "besok", "lusa", atau tanggal ISO), dan kategori tujuan (default: `"Inbox"`).
    - **Deteksi Task Eksis:** Jika task yang dibuat sudah ada di database lokal, asisten tidak membuat duplikat melainkan memberi tahu pengguna secara tepat: *"Tugas '[Nama]' sudah ada di jam [Waktu] (kategori [Kategori])."*
    - **Ubah/Update:** Mendukung perintah seperti "update task A jam 10" atau "ubah task A pukul 15.00" dan menerapkan perubahan waktu/deadline.
    - **Selesaikan/Mark Done & Undone:** Mendukung perintah "mark done task A", "tandai task A selesai", "selesaikan task A", dan "belum selesai task A".
    - **Pindahkan Kategori:** Mendukung perintah "pindah task A ke Kerja" / "pindahkan task A ke kategori Pribadi".
  - Menambahkan mutator helper di [src/hooks/useTasks.ts](src/hooks/useTasks.ts) (`addTaskWithDetails`, `updateTaskFields`, `setTaskDone`, `moveTask`, `executeAssistantAction`) yang menjaga konsistensi XP reward (+3 XP), daily history, status streak, dan snapshot undo/redo.
  - Membangun komponen modal pencarian global [src/components/modals/UnifiedSearchModal.tsx](src/components/modals/UnifiedSearchModal.tsx) & [src/components/modals/UnifiedSearchModal.css](src/components/modals/UnifiedSearchModal.css) yang mencari sekaligus di **Tasks**, **Notes**, dan **Categories** secara instan:
    - Dilengkapi shortcut keyboard global `Cmd+K` / `Ctrl+K`, tombol pencarian 🔍 di Navbar [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx), navigasi keyboard panah atas/bawah, dan tombol Enter untuk membuka hasil.
    - Membersihkan search bar per-halaman yang redundan di [src/pages/Tasks/Tasks.tsx](src/pages/Tasks/Tasks.tsx) dan [src/pages/Notes/Notes.tsx](src/pages/Notes/Notes.tsx) sehingga pengalaman pencarian LifeFlow terpadu menjadi satu pintu.
  - Memperbarui status [TASK-1403] dan [TASK-1404] di [docs/project/TASK_BOARD.md](docs/project/TASK_BOARD.md) menjadi TESTING untuk persiapan validasi Manual UAT oleh pengguna.
  - Menemukan dan memperbaiki root cause mis-klaim perintah offline: ketika user meminta *buat note/catatan* atau *buat habit*, parser offline sebelumnya terlalu longgar sehingga mengarah ke aksi *create_task*.
  - Menambahkan `parseOfflineNoteCommand` dan `parseOfflineHabitCommand` (dijalankan sebelum `parseOfflineTaskCommand`) serta menegaskan trigger harus mengandung kata kunci `note/catatan` atau `habit/kebiasaan`.
  - Menambahkan parsing deadline untuk format *"tanggal 18 november"* / *"18 november"* agar deadline bisa diekstrak benar.
  - Memperluas eksekusi aksi di [src/components/layout/AiChatDrawer.tsx](src/components/layout/AiChatDrawer.tsx) agar `create_note`, `update_note`, dan `create_habit` benar-benar memutasi state di modul Notes & Habits.
  - Membuat skrip regresi lokal (TSX via tsx) untuk verifikasi parser offline: [aiAssistant_offline_commands.test.ts] dan tes spesifik note/habit.

## 2026-11-17
- **[TASK-1502] Standardize Primary Actions, Search, Profile & Utility Controls (Status: DONE, UAT PASS):**
  - Audit menemukan implementasi awal sudah ada (avatar → Settings via click/keyboard, `aria-label` pada search ⌘K dan AI ⌘J, Categories dihapus dari sidebar, Undo/Redo pindah ke header Tasks), tetapi menyisakan 3 celah konsistensi:
    - `src/pages/Habits/Habits.tsx`: primary action memakai `.btn` biasa dan label "+ New Habit" → diubah menjadi `.btn.btn-primary` dengan label "+ Add habit".
    - `src/pages/Notes/Notes.tsx`: label "+ New" ambigu → "+ Add note".
    - `src/assets/css/style.css`: `.dashboard-header` dan `.dashboard-header-actions` tidak punya `flex-wrap` sehingga utility controls (Undo/Redo/Add task) meluber horizontal di 360px → ditambahkan `flex-wrap: wrap`.
  - Build PASS, lint 0 error (2 warning lama di `useHabits.ts` dan `useTasks.ts`).
- **Perbaikan temuan UAT pada [TASK-1502]:**
  - `src/pages/Notes/Notes.css`: textarea catatan terlalu pendek karena `.app-main` bertinggi `auto` sehingga `height: 100%` di `.notes-wrapper` tidak punya acuan dan textarea jatuh ke tinggi default browser. Diganti tinggi definit `calc(100dvh - 116px - var(--space-6) - safe-area)` (desktop) dan `calc(100dvh - 90px - 120px - safe-area)` (≤640px), plus `min-height: 0` pada `.notes-editor-body`. Hasil: list catatan dan editor sama-sama penuh sampai bawah dengan scroll internal masing-masing.
  - `src/assets/css/style.css`: logo LifeFlow menyatu dengan dark mode karena `lifeflow-mark.svg` memakai `stroke="currentColor"` yang di dalam `<img>` selalu resolve ke hitam. Ditambahkan `filter: brightness(0) invert(1)` untuk `body:not(.light-mode)` pada `.navbar-logo` dan `.app-sidebar-brand .sidebar-profile-img`. Light mode tetap hitam karena sidebar light mode berlatar terang.
  - Aset brand: `favicon.svg`, `favicon.ico`, dan `assets/icons/icon.svg` ternyata masih logo template Vite dan dipakai sebagai favicon, apple-touch-icon, serta ikon PWA manifest. Dibuat `public/assets/icons/lifeflow-favicon.svg` (tile navy `#0F172A` + mark putih agar terbaca di tab terang/gelap) dan `lifeflow-favicon-180.png` (180×180 via `qlmanage`) untuk iOS. `index.html` dan `manifest.icons`/`includeAssets` di `vite.config.ts` diarahkan ke aset baru; ketiga aset Vite dihapus.
  - Root cause favicon "petir" masih muncul di address bar: `href` di `index.html` memakai path absolut `/LifeFlow/...` sehingga Vite dev server menambahkan `base` lagi menjadi `/LifeFlow/LifeFlow/...` (404). Browser lalu jatuh ke `favicon.ico` lama. Diperbaiki dengan path relatif (`assets/icons/...`), terverifikasi 200 di dev dan build.

## 2026-11-21
- **[TASK-1508] Import backup & Reset Data (Status: TESTING):**
  - Root cause: kedua jalur menulis ke kunci yang salah. `handleImport` hanya `localStorage.setItem`, sedangkan `usePersistentState` memprioritaskan IndexedDB → hasil import diabaikan setelah reload. `handleConfirmReset` hanya `localStorage.clear()` → IndexedDB tidak tersentuh sehingga data kembali. Setelah sync cloud aktif, keduanya juga langsung tertimpa data cloud.
  - [src/services/db.ts](src/services/db.ts): tambah konstanta `UPDATED_AT_SUFFIX` (dipakai bersama hook) dan `writeLocalState(key, value, at)` yang menulis nilai + stempel waktu ke `localStorage` dan IndexedDB.
  - [src/pages/Settings/Settings.tsx](src/pages/Settings/Settings.tsx): `applyStateSnapshot` menulis snapshot ke penyimpanan lokal lalu mendorong nilai yang sama ke `users/{uid}/state/*` bila user login, sehingga reload tidak memulihkan data lama. Import memakai helper ini dan menolak file yang tidak memuat satu pun key backup LifeFlow. Reset memakai `EMPTY_STATE` (Inbox kosong, riwayat kosong) dan sengaja tidak menyentuh key `settings` agar tema dan API key tetap. Teks Danger Zone diperbarui: reset berlaku di semua device yang login.
  - Build PASS, `tsc -b` PASS, lint 0 error (1 warning lama di `useHabits.ts`). Belum di-UAT.
- **[TASK-1507] Perbaikan pasca-UAT:** [src/services/firebase.ts](src/services/firebase.ts) memakai `initializeFirestore(app, { ignoreUndefinedProperties: true })`. `addHabit`/`addHabits` menyimpan `repeat` dan `time` sebagai `undefined`; Firestore menolak `undefined` sehingga seluruh dokumen `state/habits` (termasuk penghapusan) gagal ditulis tanpa pesan di UI.
- **Ikon habit diganti dari emoji ke ikon SVG:**
  - `src/pages/Habits/Habits.tsx`: input teks "Icon (Emoji)" di modal Create Habit diganti icon picker 12 pilihan (target, book, dumbbell, droplets, moon, sun, heart, brain, coffee, bike, footprints, apple) dengan `aria-pressed` dan `role="group"`. Nilai disimpan sebagai nama ikon di field `Habit.icon` yang sudah ada, jadi tidak perlu migrasi data.
  - Habit lama yang masih menyimpan emoji tetap tampil sebagai emoji (fallback di render), habit baru memakai `<Icon>`.
  - `src/components/ui/Icon.tsx`: menambahkan 12 ikon habit ke map `icons`.
  - `src/pages/Habits/Habits.css`: style `.habit-icon-picker`, `.habit-icon-option`, `.habit-field-label`.
  - `src/components/layout/AiChatDrawer.tsx`: habit yang dibuat lewat AI assistant memakai ikon `target`, bukan `🎯`.
  - Build PASS, lint tanpa warning baru.
- **Migrasi ikon ke `lucide-react` + sistem tombol terpusat (belum UAT):**
  - `lucide-react@1.74.0` dipasang; sebelumnya hanya ada di project PORTOFOLIO/RESTAURANT, bukan di LifeFlow.
  - [src/components/ui/Icon.tsx](src/components/ui/Icon.tsx): 19 nama ikon dipetakan ke ikon lucide (`House`, `ListChecks`, `Repeat`, `Timer`, `ChartLine`, `ChartColumn`, `StickyNote`, `Pin`, dst) dengan `strokeWidth={1.8}`. API `<Icon name size className>` dipertahankan sehingga 50 call site tidak berubah. Bundle index +8 KB.
  - [src/pages/Habits/Habits.tsx](src/pages/Habits/Habits.tsx), [src/pages/Settings/Settings.tsx](src/pages/Settings/Settings.tsx), [src/pages/Notes/Notes.tsx](src/pages/Notes/Notes.tsx): emoji UI (🌱 judul & empty state, ✨, ⏳, 📌 grup, 📍 toggle) diganti `<Icon>`; emoji ikon habit milik user (🎯) tidak disentuh.
  - [src/assets/css/forms.css](src/assets/css/forms.css): sistem `.btn` jadi single source of truth (`.btn`, `.btn-primary` solid, `.btn-secondary`, `.btn--outline`, `.btn-danger`, `:disabled`). Token `--color-primary-fill`/`--color-primary-fill-hover` (`#1d4ed8`/`#1e40af`) dipilih agar teks putih tetap 6,5:1; `--color-primary` (`#0a84ff`) gagal AA untuk teks putih.
  - [src/index.css](src/index.css): boilerplate Vite `.btn` / `.btn-secondary` (slate `#334155` tanpa versi light mode) dihapus — akar masalah Undo/Redo tetap gelap di light mode.
  - [src/assets/css/style.css](src/assets/css/style.css): `.btn--icon` dinaikkan ke `.btn.btn--icon`; dua `body.light-mode button` diubah ke `button:not([class*="btn"])`; blok `!important` `body.light-mode .dashboard-header-actions button` dihapus sehingga Add Task memakai `.btn-primary` di dua tema.
  - `Tasks.tsx` & `Categories.tsx`: 6 tombol yang hanya memakai `btn-primary`/`btn-secondary` tanpa `.btn` ditambahkan base class-nya.
  - Build PASS (119ms), lint 0 error (2 warning lama). Butuh Manual UAT visual light/dark.

- **[TASK-1507] Cross-device cloud sync (Status: IN_PROGRESS / menunggu UAT):**
  - Root cause: `usePersistentState` hanya menulis ke IndexedDB. Firestore sebelumnya dipakai HabitContext untuk koleksi `users/{uid}/habits` saja (definisi habit), sehingga task, note, habit history, streak, XP, dan settings tidak pernah meninggalkan device.
  - [src/services/cloudSync.ts](src/services/cloudSync.ts) baru: baca/tulis/dengarkan dokumen `users/{uid}/state/{key}` berisi `{ value, updatedAt }`, plus migrasi habit lama dari `users/{uid}/habits`. `geminiApiKey` dibuang sebelum kirim ke cloud.
  - [src/hooks/usePersistentState.ts](src/hooks/usePersistentState.ts): hidrasi lokal dulu, lalu tarik cloud. Bandingkan `updatedAt` per key; edit offline yang lebih baru diunggah, bukan ditimpa. Tulis lokal di-debounce 800 ms. `onSnapshot` menerapkan perubahan device lain; array ditulis utuh sehingga penghapusan task/habit/note ikut tersinkron.
  - Akun berbeda di device yang sama: jika akun baru belum punya data cloud, state lokal di-reset ke default agar data akun lama tidak terbawa. Penanda akun disimpan di `localStorage` (`lifeflow:lastUid`) dan dibaca sekali per uid agar 8 hook tidak saling menimpa.
  - `HabitContext` tidak lagi punya sinkronisasi Firestore sendiri (dihapus) untuk menghindari dua penulis pada data yang sama.
  - [src/pages/Settings/Settings.tsx](src/pages/Settings/Settings.tsx): tombol "Sync Now" yang tidak punya handler diganti status nyata (`Auto-sync active for <email>` / `Off`).
  - Build PASS, `tsc -b` PASS, lint 0 error (1 warning lama di `useHabits.ts`).
  - Catatan risiko: Firestore rules untuk `users/{uid}/state/*` belum diverifikasi (tidak ada `firestore.rules` di repo); bentrok tulis memakai last-write-wins berbasis jam device; satu dokumen `notes` dibatasi 1 MiB oleh Firestore.














