# Legacy Feature Parity Audit

Dokumen ini mendokumentasikan hasil audit keselarasan fitur (Feature Parity) antara versi React + TypeScript dengan versi JavaScript Legacy yang menjadi Single Source of Truth (SSoT).

---

## Dashboard

### Status: PARTIAL

### Legacy Features:
- Menghitung LEVEL & XP secara dinamis dari database/local state.
- Menampilkan quotes motivasi secara acak yang diimpor dari [quotes.js](file:///Users/jofi/Documents/PROJECT/LifeFlow/legacy_html_version/js/core/quotes.js) setiap kali halaman dimuat/di-refresh.
- Menampilkan streak harian dinamis berdasarkan panjang array `streakData`.
- Panel ringkasan statistik (All Tasks, Pending, Done, Today).
- Activity Panel (Heatmap 30 hari) yang merepresentasikan riwayat produktivitas harian.
- Tombol Undo & Redo global.
- Tombol desktop theme toggle.

### React TS Features:
- Menghitung LEVEL & XP dinamis.
- Quote motivasi bersifat hardcoded (`const [quote] = useState({ text: 'Stay focused, stay consistent.', author: 'LifeFlow' })`).
- Menampilkan streak harian dinamis.
- Panel ringkasan statistik (All Tasks, Pending, Done, Today).
- Activity Panel (Heatmap 30 hari) menggunakan render statis box (`day-active` untuk index `< streakData.length`).
- Tombol Undo & Redo di header Dashboard.
- Tombol desktop theme toggle (terang/gelap).

### Gap Analysis:
- **Quotes**: Versi React tidak memuat daftar kutipan dinamis dari file database quotes.
- **Heatmap**: Versi React merender heatmap secara buatan (hanya mencocokkan jumlah hari streak dengan jumlah box aktif), bukan membaca persentase penyelesaian tugas harian dari `historyData` seperti versi legacy.

### Recommendation:
- Pindahkan daftar kutipan dari [quotes.js](file:///Users/jofi/Documents/PROJECT/LifeFlow/legacy_html_version/js/core/quotes.js) ke dalam utility React dan gunakan randomizer saat Dashboard di-mount.
- Sesuaikan pemetaan heatmap agar membaca data tanggal/persentase riwayat nyata dari `historyData`.

---

## Tasks

### Status: COMPLETE

### Legacy Features:
- CRUD kategori dan CRUD tugas.
- Filter status (All, Pending, Done).
- Input pencarian (Search).
- Task Modal dengan field lanjutan (Deadline, Time, Priority, Tags, Location, Reminder, Subtasks).

### React TS Features:
- CRUD kategori & tugas terintegrasi (dilengkapi input inline interaktif dan dialog konfirmasi kustom).
- Filter status (All, Pending, Done) dan pencarian fungsional.
- Task Modal dengan fungsionalitas penuh (Deadline, Time, Priority, Tags, Location, Reminder, Subtasks).

### Gap Analysis:
- Fungsionalitas inti telah setara 100%. Field reminder di modal tugas saat ini tersimpan di state namun API Notifikasi browser belum diaktifkan (sama seperti di legacy yang memiliki placeholder `notification.js`).

### Recommendation:
- Pertahankan struktur saat ini.

---

## Categories

### Status: COMPLETE

### Legacy Features:
- Daftar seluruh kategori tugas.
- Edit nama kategori via prompt.
- Hapus kategori beserta seluruh tugas di dalamnya via confirm.
- Input tambah kategori baru di panel bawah.

### React TS Features:
- Daftar kategori tugas dinamis.
- Edit nama kategori secara inline (tanpa native prompt).
- Hapus kategori dengan custom confirmation modal.
- Input tambah kategori di bagian bawah panel.

### Gap Analysis:
- Tidak ada gap fungsional. Versi React TS memiliki UX yang lebih baik karena tidak menggunakan dialog native browser.

### Recommendation:
- Pertahankan struktur saat ini.

---

## Notes

### Status: PARTIAL

### Legacy Features:
- Tombol tambah catatan baru.
- Daftar catatan tersimpan.
- Note Modal untuk menulis catatan dengan field: Title, Content, Deadline, Time, Reminder, dan checkmark Pinned Note (📌 Pin Note).

### React TS Features:
- Fitur penulisan catatan menggunakan layout Two-Pane (Daftar catatan di kiri, Editor Markdown di kanan).
- Auto-save saat mengetik catatan.
- Tombol Delete note di pojok kanan atas editor dengan dialog konfirmasi kustom.

### Gap Analysis:
- **Tampilan**: Versi React menggunakan layout Two-Pane modern, sedangkan versi legacy menggunakan modal popup. Ini adalah peningkatan UX (UI Improvement).
- **Fitur Lanjutan**: Versi React saat ini kehilangan field Deadline, Time, Reminder, dan opsi Pin Note (📌 Pin Note) untuk catatan yang ada di legacy modal.

### Recommendation:
- Tambahkan panel opsi di atas/bawah editor Markdown di halaman Notes React untuk menampung field Deadline, Time, Reminder, dan Pin Note agar memiliki fungsionalitas yang setara dengan legacy.

---

## Habits

### Status: PARTIAL

### Legacy Features:
- Mendukung Kategori Habit (CRUD Habit Category).
- Tombol "+ Habit" per kategori yang membuka Habit Modal.
- Habit Modal mendukung: Nama Habit, Repeat Interval (Daily, Weekly, Monthly, Custom/Certain day), hari-hari berulang, tanggal berulang, dan waktu pengingat (Reminder Time).
- Menampilkan habit harian yang terjadwal aktif pada hari berjalan.

### React TS Features:
- Menyimpan habit di flat array (tanpa kategori).
- Pembuatan habit kustom (Nama, Ikon Emoji) menggunakan React Modal.
- Menampilkan habit dalam bentuk kontribusi grid 90 hari ala GitHub.
- Klik grid mengaktifkan/menonaktifkan status selesai habit pada tanggal tersebut.

### Gap Analysis:
- **Struktur Data**: Data habit versi React sangat disederhanakan dan tidak memiliki relasi kategori.
- **Sistem Pengulangan (Scheduling)**: Versi React kehilangan fitur Repeat Interval (Daily/Weekly/Monthly/Custom Days) yang memfilter habit apa saja yang aktif hari ini.
- **Waktu Pengingat**: Kehilangan kolom input jam/waktu pengingat habit.

### Recommendation:
- Refaktor state dan data model Habits di `AppContext` untuk mengadopsi properti kategori dan penjadwalan berulang (repeat interval) agar fungsionalitas penjadwalan habit kembali aktif.

---

## Calendar

### Status: COMPLETE

### Legacy Features:
- Grid kalender bulanan.
- Navigasi bulan (Previous / Next).
- Klik cell tanggal membuka Modal Daftar Tugas pada hari tersebut.

### React TS Features:
- Grid kalender bulanan dinamis.
- Navigasi bulan (Previous / Next).
- Klik cell menampilkan daftar tugas terpilih di bagian bawah layar secara interaktif.

### Gap Analysis:
- Tidak ada gap fungsional. Tampilan interaktif di bawah layar versi React menggantikan modal daftar tugas dengan lebih bersih dan responsif.

### Recommendation:
- Pertahankan struktur saat ini.

---

## Statistics (Reports)

### Status: MISSING

### Legacy Features:
- Halaman Laporan Produktivitas terdedikasi (`#statsSection`).
- Progress ring visual pencapaian tugas harian ("Productivity Score").
- Kartu perbandingan kemajuan produktivitas harian dan mingguan ("Daily & Weekly Improve").
- Grafik bar tugas diselesaikan 7 hari terakhir menggunakan Chart.js (`statsChart`).
- Grafik bar konsistensi habit mingguan menggunakan Chart.js (`habitChart`).
- Tombol "Share to IG Story" yang menghasilkan gambar canvas gabungan (Level, Streak, Productivity Score) di atas gambar latar belakang pilihan pengguna dan memicu Web Share API / fallback download.

### React TS Features:
- Hanya berupa placeholder teks: `<div className="app-placeholder-section">Stats Component Placeholder</div>`.

### Gap Analysis:
- Seluruh visualisasi statistik, grafik Chart.js, kartu komparasi produktivitas, progress ring, dan fitur generator gambar Instagram Share tidak ada di versi React TS.

### Recommendation:
- Rancang halaman `Reports.tsx` kustom di `src/pages/` dan pasang library Chart.js (atau gunakan visualisasi SVG murni jika tidak ingin menambah dependensi luar) serta porting logika generator Canvas Share.

---

## Focus Timer

### Status: MISSING

### Legacy Features:
- Halaman Pomodoro Focus Timer (`#focusSection`).
- Progress ring countdown SVG.
- Pilihan durasi preset: 25, 50, 15, dan 5 menit.
- Aksi Start, Pause, dan Reset.
- Menyelesaikan sesi Pomodoro memberikan hadiah +5 XP, memicu animasi kembang api (confetti), menampilkan toast notifikasi, dan menyimpan data.

### React TS Features:
- Hanya berupa placeholder teks: `<div className="app-placeholder-section">Focus Component Placeholder</div>`.

### Gap Analysis:
- Seluruh logika penghitung waktu mundur, visualisasi progress ring, pemberian hadiah XP Pomodoro, dan pemicu confetti belum diimplementasikan di versi React.

### Recommendation:
- Bangun halaman `FocusTimer.tsx` di `src/pages/` dengan state internal `setInterval` untuk memanage countdown, integrasikan dengan `addXP` di context, dan impor library confetti atau gunakan visualisasi kustom.

---

## Settings

### Status: MISSING

### Legacy Features:
- Halaman pengaturan terdedikasi (`#settingsSection`).
- Bagian Profil Akun (Detail user Google, Sign In / Register, Sign Out, Edit Profile, Change Password, Email Verification).
- Tampilan (Appearance): Pilihan tema dropdown (System Default, Dark Mode, Light Mode).
- Notifikasi: Toggle switch untuk Habit Reminders, Task Reminders, Daily Summary, dan Sound Notification.
- Produktivitas: Pilihan Start of Week (Monday/Sunday), Default Task Priority, Default Calendar View, dan Habit Goal Display.
- Manajemen Data: Backup ekspor data ke file JSON, restore data dari file JSON, status sinkronisasi awan.
- Statistik Ringkasan: Total tasks, completed tasks, total habits, streak, dll.
- Help & Support: Dialog FAQ, Report Bug modal, Request Feature modal, serta tautan sosial media kontak pengembang.
- Legal & Informasi: Modal Privacy Policy, Terms of Service, Open Source Licenses.
- Danger Zone: Tombol hapus akun permanen.

### React TS Features:
- Hanya berupa placeholder teks: `<div className="app-placeholder-section">Settings Component Placeholder</div>`.

### Gap Analysis:
- Seluruh opsi konfigurasi preferensi pengguna, ekspor/impor data JSON, menu bantuan, legal document viewer, dan opsi hapus data permanen belum diimplementasikan.

### Recommendation:
- Bangun halaman `Settings.tsx` di `src/pages/` untuk memfasilitasi konfigurasi ini secara terorganir.

---

## Authentication / Sign In

### Status: MISSING

### Legacy Features:
- Integrasi Firebase Auth (Google Provider).
- Sinkronisasi status login di navbar (foto profil dinamis) dan sidebar (email & nama user).
- Membuka Auth Modal pilihan login (Google atau Skip/Guest) saat pertama kali membuka aplikasi.
- Menyimpan status session ke `sessionStorage.guestMode`.

### React TS Features:
- Struktur HTML/CSS tombol login dan profil statis ada di `Sidebar.tsx` dan `Navbar.tsx`, namun seluruh fungsinya mati/hardcoded.

### Gap Analysis:
- Firebase Authentication belum dihubungkan ke project React TS. Pengguna tidak bisa login dengan Google dan data tidak tersambung dengan Firebase.

### Recommendation:
- Pasang firebase SDK di project React TS (`npm install firebase`), inisialisasi konfigurasi proyek Firebase, dan hubungkan auth state listener di `AppProvider` untuk mengaktifkan user profile dinamis.

---

## Theme Support

### Status: PARTIAL

### Legacy Features:
- Pilihan tema: Light, Dark, dan System Default (mendeteksi setelan preferensi warna sistem OS via `prefers-color-scheme`).

### React TS Features:
- Toggle tema terang/gelap mengubah kelas CSS `light-mode` pada `document.body`.

### Gap Analysis:
- Belum mendukung opsi "System Default" yang mendeteksi setelan OS secara dinamis dan memperbaruinya secara otomatis saat tema sistem berubah.

### Recommendation:
- Tambahkan media query listener `window.matchMedia('(prefers-color-scheme: light)')` di dalam penanganan tema `App.tsx` untuk mendukung setelan tema sistem dinamis.

---

## Undo / Redo

### Status: COMPLETE

### Legacy Features:
- Menyimpan riwayat perubahan state maksimal 30 langkah.
- Tombol Undo (↩) dan Redo (↪) di header dashboard.

### React TS Features:
- Menyimpan state snapshot lengkap (`appData`, `xp`, `habits`, `habitHistory`, `streakData`, `historyData`, `notes`) di state stack.
- Tombol fungsional Undo & Redo di header Dashboard.

### Gap Analysis:
- Tidak ada gap fungsional. Fitur ini sudah berjalan sempurna.

### Recommendation:
- Pertahankan struktur saat ini.

---

## Local Storage

### Status: COMPLETE

### Legacy Features:
- Menyimpan seluruh data secara persisten ke LocalStorage secara otomatis saat terjadi perubahan data.

### React TS Features:
- Menggunakan hook `useEffect` terpusat di `AppContext.tsx` untuk menyimpan data secara otomatis ke LocalStorage setiap ada pembaruan pada state aplikasi.

### Gap Analysis:
- Tidak ada gap fungsional.

### Recommendation:
- Pertahankan struktur saat ini.

---

## PWA (Progressive Web App)

### Status: MISSING

### Legacy Features:
- Service Worker (`sw.js`) untuk caching offline.
- Dokumen fallback offline (`offline.html`).
- File `manifest.json` agar aplikasi dapat diinstal di Android/iOS/Desktop.
- Banner/Card PWA Install di menu Settings.

### React TS Features:
- Tidak memiliki manifest, service worker, atau aset offline di dalam folder `public/` maupun konfigurasi Vite PWA.

### Gap Analysis:
- Seluruh dukungan Progressive Web App (instalasi aplikasi di home screen, caching offline, dan penanganan status jaringan offline) hilang di versi React TS.

### Recommendation:
- Tambahkan berkas `manifest.json` dan service worker dasar ke dalam direktori `public/` atau pasang plugin `vite-plugin-pwa` untuk menangani pembuatan PWA secara otomatis saat build.

---

## Modals (Task, Habit, Note, Report, Auth, Legal)

### Status: PARTIAL

### Legacy Features:
- CSS modal overlay yang ditampilkan/sembunyikan dengan mengubah class `.show` pada DOM.
- Modals: Task Modal, Habit Modal, Note Modal, Report Bug Modal, Auth Modal, Legal Modal.

### React TS Features:
- React-controlled custom modals (seperti `TaskModal` global dan modal kustom di halaman Habits/Tasks/Notes).

### Gap Analysis:
- Modals yang terkait dengan fitur yang belum dipindahkan (Report Bug Modal, Auth Modal, Legal Modal, detail Habit Modal) belum dibuat di React TS.

### Recommendation:
- Buat komponen modal kustom tersebut seiring dengan diimplementasikannya fitur Settings, Authentication, dan Habits.
