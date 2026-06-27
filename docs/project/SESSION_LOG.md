# Session Log

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
