# 📌 LifeFlow Single Source of Truth: TASK BOARD

Dokumen ini adalah papan kendali operasional untuk pengembangan LifeFlow.
Task dikelompokkan berdasarkan **Milestone**. Selalu perbarui status task mengikuti [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md). Status Lifecycle fitur keseluruhan ada di [MODULES.md](./MODULES.md).

---

## 📊 Overall Progress: 74% (47/63 Tasks Completed)

---

## ✅ COMPLETED TASKS

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

---

## M5 - Notes (IN PROGRESS)
*(Area catatan bebas berbasis Markdown)*

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
- **Status:** DONE
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
- **Status:** DONE
- **Dependencies:** TASK-570, TASK-571
- **Acceptance Criteria:** Keterbacaan teks dan status warna tinggi, tidak ada bias kontras redup.
- **Progress:** 100%
- **Related Docs:** docs/design/DESIGN_SYSTEM.md
- **Notes:** Implementasi selesai dan Manual UAT dinyatakan PASS oleh User.

---

## M6 - Settings & Local Features
*(Settings Page, Theme, Import/Export, Dashboard Parity)*

### [TASK-601] Settings Page Foundation
- **Description:** Membangun antarmuka halaman Settings beserta navigasinya.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-575
- **Acceptance Criteria:** Halaman Settings dapat diakses dari Sidebar dan struktur UI tersedia.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Komponen Settings, SettingsSection, SettingsItem dibuat; ditautkan di App.tsx dan rute navigasi. Manual UAT PASS oleh User.

### [TASK-602] Import / Export JSON Backup
- **Description:** Implementasi logika pencadangan dan pemulihan data state aplikasi (appData, notes, habits) dalam format JSON.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-601
- **Acceptance Criteria:** Ekspor menghasilkan file valid `.json`, impor memulihkan seluruh data dengan aman.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Logika export menggunakan Blob URL dan import menggunakan FileReader via localStorage sudah terhubung di Settings. Manual UAT PASS oleh User.

### [TASK-603] Reset Application Data
- **Description:** Fitur "Danger Zone" untuk menghapus seluruh local storage dan mengembalikan aplikasi ke kondisi awal.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-601
- **Acceptance Criteria:** Konfirmasi ganda sebelum penghapusan, state kembali kosong.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menggunakan custom reusable React modal untuk konfirmasi ganda reset data (Offline First). Manual UAT PASS oleh User.

### [TASK-604] Theme Preferences
- **Description:** Mengakomodasi setelan preferensi tema (Light, Dark).
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-601
- **Acceptance Criteria:** Perubahan tema tersimpan di local storage dan diterapkan di seluruh komponen.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menggunakan `matchMedia` listener untuk system theme dan menghubungkannya dengan state `settings.theme`. UAT PASS oleh User.
- **Notes:** -

### [TASK-605] Dashboard Feature Parity
- **Description:** Menyempurnakan fitur heatmap 30 hari agar terhubung dengan historyData nyata.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-601
- **Acceptance Criteria:** Heatmap persentase sesuai dengan data penyelesaian harian di masa lalu.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menggunakan data persentase asli dari `historyData` dengan pengaturan CSS inline opacity berdasarkan nilai persentase penyelesaian serta atribut title. UAT PASS oleh User.

### [TASK-606] Implement Legal Information Modals
- **Description:** Menambahkan fungsionalitas pada tombol "View" di halaman Settings untuk menampilkan modal Privacy Policy, Terms of Service, dan Open Source Licenses.
- **Priority:** Low
- **Status:** DONE
- **Dependencies:** TASK-601
- **Acceptance Criteria:** Klik tombol "View" pada setiap item legal akan membuka modal yang berisi konten teks yang sesuai.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_PARITY_AUDIT.md
- **Notes:** Menggunakan komponen `LegalModal` yang reusable dan state terpusat di `AppContext`. Konten disimpan di `src/constants/legal.ts`. UAT PASS oleh User.

---

## M7 - Notes & Habits Restoration
*(Catatan & Penjadwalan Kebiasaan)*

### [TASK-701] Notes Metadata
- **Description:** Menambahkan input deadline, waktu, dan pengingat ke dalam editor Notes.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-601
- **Acceptance Criteria:** Pengguna dapat menetapkan batas waktu untuk catatan yang terhubung ke state.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menambahkan field `deadline`, `time`, `reminder` pada interface `Note`. Membuat metadata bar sejajar (flex row) di bawah input judul. Tersinkronisasi dengan debounced auto-save. UAT PASS oleh User.

### [TASK-702] Notes Pinning
- **Description:** Fitur sematkan (📌 Pin) untuk meletakkan catatan penting di urutan teratas.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-701
- **Acceptance Criteria:** Catatan yang disematkan tetap di bagian atas daftar sidebar.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menggunakan status `isPinned` pada catatan. Meng-override sorting group list menjadi "📌 Pinned" di posisi teratas indeks ke-0. UAT PASS oleh User.

### [TASK-703] Habit Repeat Rules
- **Description:** Merefaktorkan data Habit agar mendukung aturan perulangan (harian, mingguan, bulanan, hari spesifik).
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-601
- **Acceptance Criteria:** Struktur habit memiliki properti interval perulangan yang berfungsi.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menambahkan `HabitRepeatType` dan `HabitRepeatConfig` ke interface `Habit`. Replikasi modal form legacy HTML dengan dynamic input UI. UAT PASS oleh User.
- **Notes:** -

### [TASK-704] Habit Scheduling
- **Description:** Menambahkan input spesifik waktu ke dalam modal pembuatan/edit Habit untuk notifikasi/pengingat.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-703
- **Acceptance Criteria:** Daftar habit di halaman Habit membedakan habit yang aktif hari ini dan yang tidak.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menambahkan input waktu ke modal dan menyimpannya di objek Habit. UAT PASS oleh User.

---

## M8 - Focus Timer & Gamification
*(Pomodoro, XP, dan Motivasi Dinamis)*

### [TASK-801] Focus Timer
- **Description:** Membangun modul Pomodoro Focus Timer dengan ring countdown visual SVG.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-704
- **Acceptance Criteria:** Timer menghitung mundur stabil dengan preset 25, 50, 15, 5 menit.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menggunakan localStorage timestamp untuk background timer. UAT PASS.

### [TASK-802] XP Integration
- **Description:** Menghubungkan selesainya siklus Focus Timer dengan penambahan +5 XP.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-801
- **Acceptance Criteria:** Selesainya hitung mundur langsung memperbarui poin XP di dashboard.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Sudah diimplementasikan secara otomatis bersamaan dengan TASK-801 via pemanggilan `setXp`.

### [TASK-803] Confetti & Sound
- **Description:** Memainkan efek suara penyelesaian dan menembakkan kembang api (canvas confetti) ketika timer habis.
- **Priority:** Low
- **Status:** DONE
- **Dependencies:** TASK-802
- **Acceptance Criteria:** Selesainya hitung mundur memicu efek audio-visual.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menggunakan canvas-confetti dan Web Audio API untuk efek suara. UAT PASS.

### [TASK-804] Dashboard Dynamic Quotes
- **Description:** Memuat daftar kutipan motivasi dari sumber eksternal dan mengacaknya saat dashboard dibuka.
- **Priority:** Low
- **Status:** DONE
- **Dependencies:** TASK-801
- **Acceptance Criteria:** Quote berganti-ganti setiap kali halaman di-refresh.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Menggunakan QuoteProvider (Local First). UAT PASS.

---

## M9 - Reports & Statistics
*(Visualisasi Produktivitas Harian & Mingguan)*

### [TASK-901] Reports Dashboard
- **Description:** Menyusun struktur halaman Reports yang berisi kartu ringkasan progres harian.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-804
- **Acceptance Criteria:** Halaman Reports merender kerangka visual dengan data penyelesaian awal.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Komponen kerangka laporan dengan status kosong (empty state), perhitungan harian, dan UI cincin (progress ring) siap. Menunggu UAT.

### [TASK-902] Productivity Analytics
- **Description:** Menghitung tren progres mingguan tugas dan kebiasaan dari `historyData` ke dalam grafik representatif.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-901
- **Acceptance Criteria:** Visual grafik menggambarkan data akurat dari localStorage tanpa bergantung Chart.js jika merusak parity.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Bug CSS tinggi grafik flexbox dan Timezone mismatch telah berhasil diselesaikan. UAT Passed.

### [TASK-903] Share Image / Canvas
- **Description:** Menghasilkan gambar Canvas 2D yang merangkum level, streak, dan progres untuk di-share ke media sosial.
- **Priority:** Low
- **Status:** DONE
- **Dependencies:** TASK-902
- **Acceptance Criteria:** Pengguna dapat menyimpan image rekap dari statistik mereka (JPG/PNG).
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Komponen canvas utilitas telah dibangun, UAT passed.

### [TASK-904] Fix Habit Statistics Graph
- **Description:** Grafik "Habit Consistency" di halaman Laporan tidak diperbarui karena salah membaca dari `historyData` (data tugas). Perbaikan ini akan mengubah sumber data grafik untuk membaca dari `habitHistory` yang benar.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-901
- **Acceptance Criteria:** Menceklis atau membatalkan ceklis habit akan langsung tercermin pada grafik statistik habit 7 hari terakhir di halaman Laporan.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_PARITY_AUDIT.md
- **Notes:** Logika diubah untuk menghitung persentase penyelesaian dari `habitHistory` dan `habits` (untuk jadwal aktif), bukan lagi dari `historyData`. UAT PASS oleh User.

---

## M10 - Authentication
*(Akun Pengguna dan Firebase Cloud)*

### [TASK-1001] Firebase Authentication
- **Description:** Inisialisasi Firebase Web SDK di proyek React dan mengkonfigurasi mode autentikasi.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-903
- **Acceptance Criteria:** Proyek terhubung dengan Firebase Auth secara stabil.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Firebase SDK (v11) terpasang, environment keys dikonfigurasi via .env.local.

### [TASK-1002] Google Login
- **Description:** Mengaktifkan Sign-In dengan penyedia Google (popup/redirect) dan memunculkan Auth Modal di awal pembukaan aplikasi.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-1001
- **Acceptance Criteria:** Pengguna bisa login menggunakan kredensial Google.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** AuthModal dengan backdrop blur berhasil diintegrasikan. AuthContext mengelola state user. UAT Passed.

### [TASK-1003] User Profile Synchronization
- **Description:** Menyambungkan state user login dengan foto profil di Navbar dan informasi kontak di Sidebar.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-1002
- **Acceptance Criteria:** Komponen Sidebar dan Header memperbarui visualnya berdasarkan data auth pengguna.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Foto profil (photoURL) dari provider Google sukses menggantikan avatar bawaan. UAT Passed.

---

## M11 - PWA & Offline
*(Dukungan Luring dan Pemasangan Aplikasi)*

### [TASK-1101] Service Worker
- **Description:** Menyusun berkas `sw.js` untuk mendeteksi event lifecycle dan meng-cache aset dasar.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-1003
- **Acceptance Criteria:** Service worker berhasil diregistrasi di konsol browser.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** `vite-plugin-pwa` (Workbox) menghasilkan `dist/sw.js` & `dist/manifest.webmanifest` secara otomatis. `registerSW` terdaftar di `main.tsx`.

### [TASK-1102] Offline Support
- **Description:** Strategi offline fallback, memastikan localStorage tetap terisolasi dan data bisa dimodifikasi meski tak ada internet.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-1101
- **Acceptance Criteria:** Mematikan mode internet tidak menghalangi fungsionalitas CRUD di dalam aplikasi.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Arsitektur Local-First (localStorage) menjamin semua CRUD berjalan penuh tanpa koneksi. Workbox `CacheFirst` meng-cache semua aset statik (JS/CSS/HTML/SVG/Font).

### [TASK-1103] Installable PWA
- **Description:** Menyediakan `manifest.json` yang berisi ikon, nama pendek, mode tampilan (standalone), dan tema warna.
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** TASK-1102
- **Acceptance Criteria:** Muncul opsi "Install App" (prompt A2HS) di peramban pengguna.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** `manifest.webmanifest` sudah dikonfigurasi dengan `display: standalone`, `theme_color: #0F172A`, dan ikon SVG. Meta `apple-touch-icon` & `theme-color` sudah ditambahkan ke `index.html`.

---

## M12 - Final Release Candidate
*(Pra-rilis, Theme Detection, dan UAT Akhir)*

### [TASK-1201] System Theme Detection
- **Description:** Deteksi mode tema dari sistem operasi dengan opsi preferensi "System Default".
- **Priority:** Low
- **Status:** DONE
- **Dependencies:** TASK-1103
- **Acceptance Criteria:** Tema merespons pergantian OS secara live tanpa refresh.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** `window.matchMedia('prefers-color-scheme: light')` listener sudah aktif di `App.tsx`. Opsi "System Default" tersedia di Settings.

### [TASK-1202] Legacy Feature Parity Audit
- **Description:** Audit perbandingan visual 1:1 final dengan versi legacy.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-1201
- **Acceptance Criteria:** Semua celah terdeteksi sudah berhasil tertutupi tanpa kekurangan fitur inti.
- **Progress:** 100%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** Audit PASS. Tidak ada gap kritis. Perbedaan minor (notification toggle, splash screen) diterima. Semua fitur inti CRUD sudah paritas.

---

## M13 - Operation Stabilization


### [TASK-1301] Legacy Code Cleanup
- **Description:** Hapus folder `legacy_html_version/` dan script lama yang tidak dipakai.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** None
- **Acceptance Criteria:** Repository bersih dari file legacy JS/HTML/Python.

## 🔄 PENDING TASKS (TODO / TESTING / BACKLOG)

---

## M13 - Operation Stabilization


### [TASK-1302] Strict Type Safety Patch
- **Description:** Hapus penggunaan tipe `any` di seluruh project (terutama di `AppContext.tsx`) dan gunakan interface ketat.
- **Priority:** High
- **Status:** DONE
- **Dependencies:** TASK-1301
- **Acceptance Criteria:** Tidak ada peringatan `any` saat menjalankan TypeScript linting.

---

## M13 - Operation Stabilization


### [TASK-1303] IndexedDB Storage Migration
- **Description:** Pindahkan penyimpanan data dari `localStorage` sinkronus ke IndexedDB (Dexie.js) secara asinkronus. Keluarkan fungsi tulis dari *useEffect*.
- **Priority:** Critical
- **Status:** DONE
- **Dependencies:** TASK-1302
- **Acceptance Criteria:** Operasi simpan (write) berjalan asinkronus dan tidak membekukan UI saat data berjumlah besar.

---

## 🔄 PENDING TASKS

## M2 - Task Management
*(Migrasi Core Task Logic, UI Tasks, dan Modal)*

### [TASK-202] Inline Task Input (Zero-Friction)
- **Description:** Hapus sistem penambahan Task tradisional (modal panjang) untuk penambahan cepat. Buat input satu baris (command line style) persis di atas halaman Tasks.
- **Priority:** Medium
- **Status:** BACKLOG
- **Dependencies:** TASK-201
- **Acceptance Criteria:** Menekan "Enter" membuat task baru, field langsung bersih.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** Optimalisasi User Experience (UX) lanjutan.

### [TASK-558] Release Candidate Audit
- **Description:** Audit kelayakan pra-rilis.
- **Priority:** High
- **Status:** FAILED
- **Dependencies:** TASK-551, TASK-552, TASK-553, TASK-554, TASK-555, TASK-556, TASK-557
- **Acceptance Criteria:** npm run build PASS, TypeScript PASS, lint PASS, tidak ada console error, UAT PASS, siap ditandai sebagai Release Candidate sebelum M6.
- **Progress:** 0%
- **Related Docs:** None
- **Notes:** Gagal pada saat visual inspection UAT oleh User (UI Regression).

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
- **Status:** TESTING
- **Dependencies:** TASK-561
- **Acceptance Criteria:** Layout grid dan navbar merespons breakpoints 1100px, 768px, 640px dengan benar.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** Diselesaikan dengan integrasi safe-area inset (iOS notch), layout stacking di settings, wrapping di notes dan task tags/subtasks, serta modal scrollable.

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

---

## M5 - Notes (IN PROGRESS)
*(Area catatan bebas berbasis Markdown)*

### [TASK-575] Final UI Polish
- **Description:** Pembersihan inline CSS style di seluruh JSX file, penyelarasan ikonografi, transisi, dan pengujian build akhir.
- **Priority:** Low
- **Status:** TESTING
- **Dependencies:** TASK-571, TASK-572, TASK-573, TASK-574
- **Acceptance Criteria:** Seluruh JSX bebas inline styles, transisi animasi halus di semua resolusi layar, build PASS.
- **Progress:** 100%
- **Related Docs:** docs/design/DESIGN_SYSTEM.md
- **Notes:** -

---

## M12 - Final Release Candidate
*(Pra-rilis, Theme Detection, dan UAT Akhir)*

### [TASK-1203] Final Manual UAT
- **Description:** Regresi seluruh fungsi CRUD, UI interactions, performa form, auth, serta fungsionalitas offline.
- **Priority:** High
- **Status:** TODO
- **Dependencies:** TASK-1202
- **Acceptance Criteria:** Semua skenario lulus (PASS) tanpa konsol eror.
- **Progress:** 0%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** -

### [TASK-1204] Release Candidate v1.0
- **Description:** Pembungkusan komitmen akhir, penyesuaian versi rilis, pembuatan tag v1.0, dan deployment publik.
- **Priority:** High
- **Status:** TODO
- **Dependencies:** TASK-1203
- **Acceptance Criteria:** Aplikasi siap disebarluaskan di channel publik dengan branch v1.0 tercatat rapi.
- **Progress:** 0%
- **Related Docs:** docs/project/LEGACY_RESTORATION_PLAN.md
- **Notes:** -

### [TASK-1205] Post-Release UX Polishing & Habit Bug Fixes
- **Description:** Menghapus fitur share IG story, perbaikan layout header sidebar, fixing timezone Habit, dan membersihkan elemen redundan di Dashboard (UX Audit).
- **Priority:** Medium
- **Status:** TESTING
- **Dependencies:** None
- **Acceptance Criteria:** Dashboard lebih bersih tanpa teks Streak ganda, Undo/Redo di navbar, Habit stats akurat terhadap zona waktu lokal.
- **Progress:** 100%
- **Related Docs:** None
- **Notes:** Menunggu Manual UAT oleh User.

---

## M13 - Operation Stabilization


### [TASK-1304] AppContext Splitting
- **Description:** Pecah "God Context" (`AppContext`) menjadi konteks tersendiri (`TaskContext`, `HabitContext`, `NoteContext`, `SettingsContext`) untuk mencegah re-render UI global.
- **Priority:** High
- **Status:** TODO
- **Dependencies:** TASK-1303
- **Acceptance Criteria:** Mengubah status tugas (Task) tidak memicu render ulang (re-render) pada komponen kebiasaan (Habit) atau catatan (Note).

---

## Archived / Future Roadmap

> **Migration Note:** Roadmap setelah Legacy Restoration menggunakan milestone baru berdasarkan ADR. Roadmap lama di bawah ini (M6 - M8 versi awal) dipindahkan ke bagian Archived/Future Roadmap agar histori dokumentasi tetap konsisten dan dapat ditelusuri.

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
- **Notes:** Kini disupervisi oleh TASK-801 di roadmap baru.

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

---

