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
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** keyboard navigation, focus indicator, aria label yang diperlukan, color contrast layak, responsive tetap baik.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** Indikator fokus terstandarisasi, pelabelan ARIA terpasang di semua halaman.

### [TASK-555] Performance Optimization
- **Description:** Optimalisasi tanpa optimisasi prematur.
- **Priority:** Low
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** React.memo bila diperlukan, useMemo/useCallback bila memang memberi manfaat, lazy loading halaman yang sesuai, mengurangi render yang tidak perlu.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** Code splitting menggunakan React.lazy & Suspense, serta referential stability dengan useCallback di hooks.

### [TASK-556] Error Handling
- **Description:** Tangani error global dengan baik.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** Error Boundary, fallback UI, graceful error message, tidak ada white screen ketika error.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** ErrorBoundary global terpasang di level paling tinggi dengan fallback UI yang andal.

### [TASK-557] Code Cleanup & Refactor
- **Description:** Merapikan struktur kode proyek.
- **Priority:** Low
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** menghapus dead code, menghapus import tidak terpakai, merapikan struktur komponen, meningkatkan readability, tidak mengubah perilaku aplikasi.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** Dependensi React Hooks di useTasks dirapikan untuk menghilangkan warning exhaustive-deps.

### [TASK-558] Release Candidate Audit
- **Description:** Audit kelayakan pra-rilis.
- **Priority:** High
- **Status:** FAILED
- **Dependencies:** TASK-551, TASK-552, TASK-553, TASK-554, TASK-555, TASK-556, TASK-557
- **Acceptance Criteria:** npm run build PASS, TypeScript PASS, lint PASS, tidak ada console error, UAT PASS, siap ditandai sebagai Release Candidate sebelum M6.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** Gagal pada saat visual inspection UAT oleh User (UI Regression).

---

## M5.6 - UI Restoration
*(Restorasi Tampilan & Pixel Perfect)*

Deskripsi: "Milestone ini bertujuan memperbaiki regresi visual dan layout yang pecah akibat variabel CSS tidak terdefinisi serta ketidaksesuaian DOM dengan versi HTML legacy."

### [TASK-561] Restore Layout Wrapper
- **Description:** Mengimpor index.css ke main.tsx dan menyesuaikan agar tidak menimpa background & font legacy.
- **Priority:** High
- **Status:** TESTING
- **Dependencies:** None
- **Acceptance Criteria:** Variabel spacing/radius terdefinisi secara global tanpa merusak font Poppins & gradien latar belakang.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** index.css diimpor, override global yang menimpa visual legacy dibersihkan, font Poppins dimuat di index.html.

### [TASK-562] Restore Sidebar
- **Description:** Memperbaiki layout, padding, serta urutan z-index sidebar dan overlay.
- **Priority:** High
- **Status:** TODO
- **Dependencies:** TASK-561
- **Acceptance Criteria:** Sidebar terbuka/tutup dengan transisi halus tanpa tertutup overlay.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-563] Restore Header
- **Description:** Menyelaraskan struktur header dan navbar agar sesuai dengan tinggi & layout legacy.
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** TASK-561
- **Acceptance Criteria:** Header setinggi 96px (desktop) / 70px (mobile), logo dan action terposisi tepat.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-564] Restore Dashboard
- **Description:** Memulihkan grid, gap, spacing, dan layout card pada halaman utama Dashboard.
- **Priority:** High
- **Status:** TODO
- **Dependencies:** TASK-561
- **Acceptance Criteria:** Level progress box, quick stats, activity heatmap, dan motivation quote sejajar pixel-perfect.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-565] Restore Bottom Navigation
- **Description:** Mengembalikan DOM bottom nav menggunakan ID `#bottomNav` dan menghapus teks label tombol.
- **Priority:** High
- **Status:** TODO
- **Dependencies:** TASK-561
- **Acceptance Criteria:** Bottom nav melayang di posisi yang tepat di mobile, bersembunyi di desktop, tombol memuat emoji saja.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-566] Responsive Fix
- **Description:** Menyesuaikan media query CSS agar layout konsisten di berbagai ukuran layar.
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** TASK-561
- **Acceptance Criteria:** Layout grid dan navbar merespons breakpoints 1100px, 768px, 640px dengan benar.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-567] Pixel Perfect Audit
- **Description:** Audit visual menyeluruh membandingkan versi React vs HTML legacy.
- **Priority:** High
- **Status:** TODO
- **Dependencies:** TASK-561, TASK-562, TASK-563, TASK-564, TASK-565, TASK-566
- **Acceptance Criteria:** Tidak ada penyimpangan visual, layout stabil, warna & spacing identik dengan legacy.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-568] Release Candidate v2
- **Description:** Pengujian build, lint, dan UAT akhir untuk restorasi UI.
- **Priority:** High
- **Status:** TODO
- **Dependencies:** TASK-567
- **Acceptance Criteria:** build PASS, lint PASS, UAT final PASS oleh pengguna manusia.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** -

### [TASK-569] Simplify Task Creation UX
- **Description:** Penyederhanaan alur pembuatan task inline dengan menghapus tombol detail modal dan menggantinya dengan trailing icon plus di kanan input serta menambahkan petunjuk tombol pintas (Press Enter ↵).
- **Priority:** Medium
- **Status:** TESTING
- **Dependencies:** None
- **Acceptance Criteria:** Aksi Enter dan klik ikon "+" memicu penambahan task yang sama, placeholder "What needs to be done today?", hint teks kecil muncul di bawah input.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** -

### [TASK-570] Design System & UX Consistency Audit
- **Description:** Audit menyeluruh visual hierarchy, typography, colors, inputs, buttons, cards, spacing, icons, responsive behavior, dan buat Design System.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** Dokumentasi DESIGN_SYSTEM.md dan UI_AUDIT.md dibuat lengkap dan terstruktur.
- **Progress:** 100%
- **Related Docs:** docs/design/DESIGN_SYSTEM.md, docs/project/UI_AUDIT.md
- **Notes:** Audit selesai dilakukan.

### [TASK-571] Restore UI Consistency
- **Description:** Terapkan unifikasi CSS variables di variables.css, hapus definisi root yang redundan di style.css, serta perbaiki overlay sidebar z-index.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-570
- **Acceptance Criteria:** Variabel warna konsisten di seluruh modul, sidebar mobile/overlay terlapisi dengan benar.
- **Progress:** 100%
- **Related Docs:** docs/design/DESIGN_SYSTEM.md
- **Notes:** Unifikasi warna CSS variables ke variables.css berhasil, redefinisi root di style.css dinonaktifkan, overlay mobile z-index diperbaiki.

### [TASK-572] Input & Search Standardization
- **Description:** Standardisasi input field, search box, textarea, select dropdown di Tasks, Notes, dan modal sesuai pedoman.
- **Priority:** High
- **Status:** TESTING
- **Dependencies:** TASK-570, TASK-571
- **Acceptance Criteria:** Semua input dan search box konsisten tinggi (height 44px), radius, dan visual focus ring.
- **Progress:** 100%
- **Related Docs:** docs/design/DESIGN_SYSTEM.md
- **Notes:** forms.css dijadikan Single Source of Truth. Rules duplikat di style.css dihapus. Notes.css disederhanakan. TaskModal.tsx dibersihkan dari inline style. forms.css diimport di main.tsx setelah style.css.

### [TASK-573] Card & Layout Standardization
- **Description:** Standardisasi border-radius dan shadow pada dashboard-panel, task card, habit row, dan notes sidebar item.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-570, TASK-571
- **Acceptance Criteria:** Sisi melengkung (radius) dan bayangan (shadow) konsisten di semua halaman.
- **Progress:** 100%
- **Related Docs:** docs/design/DESIGN_SYSTEM.md
- **Notes:** Standardisasi kelengkungan sudut (radius) dan bayangan (shadow) telah diterapkan. 6 bug hasil Manual UAT (BUG-001 s.d BUG-006) telah diperbaiki sepenuhnya.

### [TASK-574] Color & Contrast Improvements
- **Description:** Perbaiki warna teks, prioritas status, border contrast, dan tag agar memenuhi pedoman aksesibilitas kontras kontemporer (AA/AAA).
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** TASK-570, TASK-571
- **Acceptance Criteria:** Keterbacaan teks dan status warna tinggi, tidak ada bias kontras redup.
- **Progress:** 0%
- **Related Docs:** docs/design/DESIGN_SYSTEM.md
- **Notes:** -

### [TASK-575] Final UI Polish
- **Description:** Pembersihan inline CSS style di seluruh JSX file, penyelarasan ikonografi, transisi, dan pengujian build akhir.
- **Priority:** Low
- **Status:** TODO
- **Dependencies:** TASK-571, TASK-572, TASK-573, TASK-574
- **Acceptance Criteria:** Seluruh JSX bebas inline styles, transisi animasi halus di semua resolusi layar, build PASS.
- **Progress:** 0%
- **Related Docs:** docs/design/DESIGN_SYSTEM.md
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
