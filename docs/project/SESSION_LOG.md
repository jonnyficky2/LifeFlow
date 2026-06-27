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
    - Status `[TASK-571]` dipindahkan menjadi **TESTING** untuk proses UAT oleh user.
  - Berhasil menjalankan `npm run build` dan `npm run lint` dengan status PASS 100% (bebas error).

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
