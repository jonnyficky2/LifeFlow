# Log of Visual Regressions & Known UI Issues

Dokumen ini melacak seluruh isu visual, inkonsistensi desain, dan regresi antarmuka (UI/UX) yang diidentifikasi selama tahap QA, audit, maupun pengujian oleh pengguna.

---

## 1. Isu Aktif (Sedang Dipantau)

### Isu #1: Fragmentasi Gaya Input & Tombol
* **Deskripsi**: Kolom input, search box, dan tombol-tombol pada modul `Tasks`, `Notes`, dan `TaskModal` masih menggunakan styling ad-hoc (sebagian memakai inline CSS JSX) yang tidak seragam.
* **Tingkat Keparahan**: **High**
* **Rencana Perbaikan**: Standardisasi menggunakan kelas `.form-input`, `.search-input`, dan varian `.btn` terpadu (diatur dalam `[TASK-572]` dan `[TASK-575]`).

### Isu #2: Inkonsistensi Radius & Shadow Card
* **Deskripsi**: Kelengkungan sudut (radius) dan efek bayangan (elevation shadow) pada widget dashboard panel, task row, dan habit row menyimpang dari standardisasi token desain (misal: radius berkisar antara 4px s.d 24px tanpa pola yang jelas).
* **Tingkat Keparahan**: **Medium**
* **Rencana Perbaikan**: Restorasi kelengkungan sudut menggunakan token `--radius-sm`, `--radius-md`, dan `--radius-lg` secara disiplin (diatur dalam `[TASK-573]`).

### Isu #3: Kontras Warna Teks di Light Mode
* **Deskripsi**: Pada beberapa elemen berlabel sekunder (muted text/tags), rasio kontras teks abu-abu di atas latar belakang terang mode cahaya belum memenuhi kriteria minimum AA WCAG (4.5:1).
* **Tingkat Keparahan**: **Medium**
* **Rencana Perbaikan**: Penyesuaian warna `--color-muted` pada file `variables.css` untuk mode terang (diatur dalam `[TASK-574]`).

---

## 2. Isu yang Sudah Diselesaikan (Resolved Log)

### Isu #0: Spacing Collapse & Sidebar Mobile Locked (Regresi M5.5)
* **Tanggal Ditemukan**: 27 Juni 2026 (oleh UAT Human)
* **Status**: **RESOLVED**
* **Deskripsi Masalah**:
  1. Variabel token spacing & radius terlipat menjadi nol di peramban karena `index.css` tidak diimpor.
  2. Sidebar laci mobile tidak dapat diklik karena terhalang oleh overlay gelap akibat ketiadaan deklarasi `z-index` yang lebih tinggi.
  3. Bottom Navigation berada di posisi yang salah karena kehilangan identitas selektor ID `#bottomNav`.
* **Solusi**:
  - Diimpor `index.css` di entry point `main.tsx` (`[TASK-561]`).
  - Dideklarasikan `z-index: 1500` pada `.app-sidebar` di `style.css` (`[TASK-571]`).
  - Dikembalikan struktur ID `#bottomNav` pada `BottomNav.tsx` (`[TASK-571]`).
  - Dilakukan relokasi variabel warna redundan di `style.css` ke `variables.css` sebagai *single source of truth* (`[TASK-571]`).
