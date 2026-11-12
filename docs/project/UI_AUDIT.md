# UI/UX Consistency Audit: LifeFlow

Dokumen ini berisi hasil audit menyeluruh terhadap antarmuka pengguna (UI) dan pengalaman pengguna (UX) aplikasi React LifeFlow dibandingkan dengan versi HTML legacy dan prinsip-prinsip sistem desain terpadu.

---

## 1. Daftar Inkonsistensi UI & Temuan Audit

### A. Tema & CSS Variables (Sistem Token Warna)
* **Temuan**: Kode CSS di `src/assets/css/style.css` memuat tiga lapis sistem `:root` variabel warna yang saling bertabrakan:
  1. Blok tema modern (`--bg`, `--bg2`, `--card`, `--card-border`, `--text`, `--text-soft`).
  2. Blok tema dark/light mode (`--bg-dark-1`, `--bg-dark-2`, `--card-dark`, `--border-dark`, `--text-dark`, dll).
  3. Blok dashboard redesign (`--dash-bg`, `--dash-bg-deep`, `--dash-panel`, `--dash-border`, `--dash-text`).
* **Inkonsistensi**: Halaman Dashboard menggunakan warna berbasis `--dash-panel`, halaman Notes menggunakan warna ad-hoc (`var(--bg-primary)` yang bernilai kosong atau tidak terdefinisi), dan komponen modal menggunakan `--bg2`. Hal ini menyebabkan inkonsistensi warna panel antar modul.
* **Severity**: **Critical**
* **Rekomendasi**: Unifikasi seluruh warna ke dalam satu set token global di `variables.css` (`--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-muted`) dan hapus variabel redundan lainnya.

### B. Tombol & Varian Interaksi (Buttons)
* **Temuan**: Gaya tombol sangat bervariasi di setiap halaman:
  - Tombol aksi kategori di `Tasks.tsx` menggunakan emoji mentah (`✏️`, `🗑`) tanpa kelas pembungkus yang konsisten, berukuran sangat kecil, dan tidak memiliki area klik (hitbox) yang sesuai standar a11y.
  - Tombol "Create New Category" menggunakan inline style (`style={{ padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px dashed var(--border-color)' }}`).
  - Tombol modal aksi (`#closeTaskModalBtn`, `#saveTaskModalBtn`) menggunakan gaya tombol bawaan modal lama.
* **Inkonsistensi**: Tidak ada keselarasan visual antara tombol aksi (e.g. edit/delete) di halaman Tasks, halaman Habits, dan halaman Notes.
* **Severity**: **High**
* **Rekomendasi**: Definisikan kelas tombol global: `.btn-primary`, `.btn-secondary`, `.btn-danger`, dan `.btn-action` (khusus untuk tombol emoji aksi/sirkular), lalu terapkan secara konsisten di seluruh halaman.

### C. Standardisasi Bidang Input & Search
* **Temuan**: Area pencarian (Search Input) dan input form memiliki visualisasi berbeda:
  - Kotak pencarian Tasks (`#searchInput`) dibungkus dalam `.search-box` dengan input raw tanpa border-radius token.
  - Kotak pencarian Notes (`.notes-search input`) memiliki padding dan background berbeda.
  - Form input di dalam `TaskModal.tsx` menggunakan ID langsung (`#taskNameInput`, `#taskNoteInput`) tanpa standardisasi kelas CSS input, berukuran sempit, dan memiliki border yang terlalu tipis.
* **Inkonsistensi**: Placeholder, padding, efek fokus, dan tinggi (height) input berbeda-beda antara pencarian task, pencarian catatan, dan input modal.
* **Severity**: **High**
* **Rekomendasi**: Buat standardisasi kelas input `.form-input` dan pencarian `.search-input` (dengan ikon lup absolut di kiri) sesuai spesifikasi tinggi target sentuh minimum 44px.

### D. Konsistensi Panel & Card (Layout Cards)
* **Temuan**: Kelengkungan sudut (border-radius) dan shadow menyimpang di beberapa komponen:
  - Panel utama dashboard menggunakan border-radius bervariasi.
  - `.habit-row` di halaman Habits menggunakan radius ad-hoc.
  - Baris item task (`.task`) menggunakan kelengkungan radius kecil, sedangkan `.note-item` memiliki sisi bersudut tajam tanpa kelengkungan radius.
* **Inkonsistensi**: Radius dan bayangan menyimpang dari pedoman 8px (Small) / 18px (Medium) / 24px (Large).
* **Severity**: **Medium**
* **Rekomendasi**: Terapkan kelas pembungkus card standar dan hubungkan ke variabel `--radius-sm`, `--radius-md`, dan `--radius-lg`.

### E. Sidebar overlay & Navigasi (Z-Index & Sizing)
* **Temuan**: Saat sidebar terbuka di resolusi mobile, overlay (`.sidebar-overlay`) yang bertugas menggelapkan latar belakang bertumpuk di atas sidebar itu sendiri karena urutan z-index yang salah.
* **Inkonsistensi**: Tombol menu sidebar menjadi tidak dapat ditekan jika diakses dalam mode mobile/overlay aktif.
* **Severity**: **Critical**
* **Rekomendasi**: Atur z-index `.app-sidebar` atau `.sidebar` ke `1500` (lebih tinggi dari `.sidebar-overlay` di `1400`).

---

## 2. Audit Lanjutan: Post-Release UX Review (2026-11-13)

Audit ini berasal dari static source review. Browser interaction, screenshots, runtime console, dan cross-device visual comparison belum diverifikasi; item tersebut tetap berstatus **UNVERIFIED** sampai Manual UAT.

### A. Hierarki dan navigasi

- **High — Dashboard tidak cukup task-first**: Dashboard berisi XP, statistik, heatmap, dan quote, tetapi belum menonjolkan daftar tugas hari ini atau primary action `Add task`.
- **High — Primary action tidak konsisten**: label dan posisi tombol tambah berbeda antara Tasks, Habits, Categories, dan Notes.
- **High — Navbar terlalu padat**: search, AI, undo, redo, theme, profile, dan sidebar toggle berada pada satu baris utility.
- **Medium — Sidebar terlalu panjang**: sembilan item utama tanpa grouping meningkatkan beban pemahaman pengguna baru.
- **High — Profile tidak actionable**: avatar di `src/components/layout/Navbar.tsx` belum memiliki `onClick` atau keyboard action menuju Settings.
- **Medium — Search kurang discoverable**: global search hanya berupa icon button tanpa label visual.

### B. Visual system dan feedback

- **High — Emoji/simbol dipakai sebagai icon system**: navigasi dan action memakai karakter seperti `⌂`, `☑`, `✏️`, dan `🗑`; tampilannya dapat berbeda antar platform dan tidak membentuk icon language yang konsisten.
- **High — Toast terlalu besar untuk checklist feedback**: `notifications.css` memakai padding besar, min-width 200px, max-width 300px, dan gradient; task complete/pending menjadi terlalu dominan.
- **High — CSS ownership tidak jelas**: `style.css` berisi override berulang untuk sidebar, buttons, light mode, bottom nav, dan toast sehingga perubahan mudah saling menimpa.
- **Medium — Token warna berlapis**: `variables.css` masih memiliki alias lama (`--bg`, `--primary`, `--dash-*`, dan lainnya) yang membuat sumber warna sulit dilacak.
- **Medium — Logo belum memiliki sistem brand**: `APP_LOGO` langsung menunjuk ke `favicon.svg`, tanpa pemisahan mark, wordmark, favicon, dan PWA icon.

### C. Responsive dan accessibility

- **High — Risiko overflow lintas device**: navbar, dashboard grid, heatmap, modal, dan sidebar perlu diuji pada 375, 390, 768, 1024, 1280, dan 1440px.
- **Medium — Theme parity belum terbukti**: static code menunjukkan banyak override `body.light-mode`; setiap halaman perlu diuji agar tidak ada teks putih pada surface terang atau surface gelap yang tersisa.
- **Medium — Profile dan overlay keyboard behavior belum lengkap**: avatar perlu menjadi button yang dapat difokuskan; sidebar overlay perlu memiliki dismiss behavior yang dapat diakses.

### Status evidence

| Area | Status | Bukti saat ini |
|---|---|---|
| Build dan TypeScript | PASS | `npm run build` pada 2026-11-13 |
| Lint | PASS | `npm run lint` pada 2026-11-13 |
| Browser clicks/input | UNVERIFIED | Browser automation belum tersedia di sesi ini |
| Screenshots cross-device | UNVERIFIED | Belum ada baseline baru |
| Runtime console/network | UNVERIFIED | Belum dijalankan di browser |
| Manual UAT | REQUIRED | Menunggu implementasi dan validasi user |

## 3. Prioritas Implementasi Perbaikan

Kami merekomendasikan pembagian pekerjaan perbaikan dalam urutan berikut demi meminimalkan risiko regresi visual:

1. **Prioritas 1 (Critical & High)**:
   - **Penyelarasan Warna & Unifikasi Variabel CSS**: Satukan seluruh sistem warna ke `:root` tokens baru di `variables.css`.
   - **Perbaikan Sidebar & Overlay Z-Index**: Pastikan sidebar mobile dapat diklik sepenuhnya.
   - **Restorasi Bottom Navigation DOM**: Ganti `.bottom-nav` dengan `#bottomNav` untuk mengambil properti CSS legacy secara sempurna.
2. **Prioritas 2 (High & Medium)**:
   - **Standardisasi Form Input & Search**: Terapkan `.form-input` dan `.search-input` di modul Tasks, Notes, dan Modals.
   - **Standardisasi Tombol & Aksi**: Terapkan `.btn-primary`, `.btn-secondary`, dan `.btn-action` ke semua elemen interaktif.
3. **Prioritas 3 (Medium & Low)**:
   - **Standardisasi Card & Panel Radius**: Selaraskan kelengkungan sudut dashboard panel, task row, notes sidebar item, dan habit card.
   - **Pemberantasan Inline CSS**: Pindahkan seluruh inline styles ad-hoc dari JSX ke stylesheet CSS global/lokal yang terstruktur.
