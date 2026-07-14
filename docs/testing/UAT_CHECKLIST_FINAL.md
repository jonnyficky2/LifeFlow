# Final Manual User Acceptance Testing (UAT) Checklist - v1.0

Dokumen ini berisi daftar skenario pengujian manual yang harus diverifikasi untuk memastikan aplikasi LifeFlow siap untuk rilis v1.0. Setiap item harus diuji untuk memastikan fungsionalitas, stabilitas, dan tidak ada regresi.

**Penguji:** Human User
**Tanggal:** `2026-07-03`
**Hasil Akhir:** `PASS`

---

## 1. Fungsionalitas Inti (CRUD)

- [x] **Kategori:**
  - [x] Berhasil membuat kategori baru.
  - [x] Berhasil mengedit nama kategori secara inline.
  - [x] Berhasil menghapus kategori (beserta tugas di dalamnya) setelah konfirmasi.
- [x] **Tugas (Tasks):**
  - [x] Berhasil membuat tugas baru via input inline cepat (tekan Enter).
  - [x] Berhasil membuka modal tugas untuk mengedit detail (deadline, prioritas, sub-tugas, dll).
  - [x] Berhasil menandai tugas sebagai selesai/belum selesai (toggle).
  - [x] Berhasil menghapus tugas setelah konfirmasi.
  - [x] Poin XP dan Toast notifikasi muncul saat tugas diselesaikan.
  - [x] Fitur filter (All, Pending, Done) berfungsi dengan benar.
  - [x] Fitur pencarian (Search) berhasil menemukan tugas yang relevan.
- [x] **Catatan (Notes):**
  - [x] Berhasil membuat catatan baru.
  - [x] Auto-save berfungsi saat mengetik di editor.
  - [x] Berhasil menghapus catatan setelah konfirmasi.
  - [x] Berhasil menyematkan (Pin) catatan dan catatan tersebut pindah ke atas.
  - [x] Berhasil mengatur metadata (Deadline, Time) pada catatan.
- [x] **Kebiasaan (Habits):**
  - [x] Berhasil membuat kebiasaan baru dengan aturan pengulangan (harian, hari tertentu, dll).
  - [x] Hanya kebiasaan yang dijadwalkan untuk hari ini yang muncul di daftar.
  - [x] Berhasil menandai kebiasaan sebagai selesai/belum selesai pada grid kontribusi.
  - [x] Berhasil menghapus kebiasaan.

---

## 2. Interaksi UI & UX

- [x] **Navigasi:**
  - [x] Sidebar berfungsi untuk berpindah antar halaman (Dashboard, Tasks, Notes, dll).
  - [x] Bottom Navigation berfungsi di tampilan mobile.
- [x] **Tema (Theme):**
  - [x] Pengaturan tema (Light, Dark) di halaman Settings berfungsi dan tersimpan.
  - [x] Opsi "System Default" secara otomatis menyesuaikan tema aplikasi saat tema OS diubah.
- [x] **Dashboard:**
  - [x] Kutipan motivasi (quotes) berubah setiap kali halaman dimuat ulang.
  - [x] Heatmap aktivitas 30 hari terakhir menampilkan data persentase yang benar dari `historyData`.
  - [x] Tombol Undo/Redo berfungsi untuk membatalkan/mengulangi aksi terakhir.
- [x] **Kalender (Calendar):**
  - [x] Tugas dengan deadline muncul di tanggal yang benar pada kalender.
  - [x] Navigasi bulan (sebelumnya/berikutnya) berfungsi.
- [x] **Focus Timer:**
  - [x] Timer berjalan stabil dan dapat di-pause/reset.
  - [x] Setelah selesai, poin XP bertambah, suara notifikasi dan animasi confetti muncul.
- [x] **Laporan (Reports):**
  - [x] Grafik produktivitas tugas dan konsistensi kebiasaan menampilkan data 7 hari terakhir dengan benar.
  - [x] Fitur "Share" berhasil membuat dan mengunduh gambar statistik (canvas).
- [x] **Responsivitas:**
  - [x] Tampilan tetap rapi dan fungsional di layar desktop, tablet, dan mobile.
  - [x] Tidak ada elemen yang tumpang tindih atau keluar dari layar.

---

## 3. Manajemen Data & Pengaturan

- [x] **Settings Page:**
  - [x] Tombol "Export Data" berhasil mengunduh file `LifeFlow_Backup.json`.
  - [x] Tombol "Import Data" berhasil memulihkan data dari file JSON yang valid.
  - [x] Tombol "Reset Application" menampilkan modal konfirmasi dan berhasil menghapus semua data setelah dikonfirmasi.
  - [x] Modal informasi legal (Privacy Policy, ToS) dapat dibuka.

---

## 4. Otentikasi (Authentication)

- [x] **Login/Logout:**
  - [x] Modal otentikasi muncul saat pengguna belum login.
  - [x] Pengguna dapat login menggunakan akun Google.
  - [x] Setelah login, foto profil dan nama pengguna muncul di Navbar/Sidebar.
  - [x] Pengguna dapat logout dari halaman Settings.
- [x] **Perilaku Offline-First:**
  - [x] Aplikasi tetap 100% fungsional bahkan sebelum pengguna login (mode tamu).

---

## 5. PWA & Fungsionalitas Offline

- [x] **Instalasi:**
  - [x] Browser menampilkan prompt untuk "Install App" (Add to Home Screen).
  - [x] Aplikasi dapat diinstal dan berjalan dalam jendela sendiri (standalone).
- [x] **Mode Offline:**
  - [x] Matikan koneksi internet (misal: via DevTools atau mode pesawat).
  - [x] Aplikasi tetap dapat dibuka dan diakses.
  - [x] Semua operasi CRUD (tambah/edit/hapus tugas, catatan, dll) masih berfungsi dan data tersimpan di Local Storage.
  - [x] Setelah koneksi internet kembali, tidak ada data yang hilang.

---

## 6. Penanganan Error & Kestabilan

- [x] **Konsol Browser:**
  - [x] Tidak ada `console.error` atau `console.warn` yang muncul selama pengujian normal.
- [x] **Error Boundary:**
  - [x] (Opsional, jika bisa disimulasikan) Memastikan aplikasi menampilkan UI fallback yang ramah jika terjadi error render, bukan layar putih kosong.
- [x] **Performa:**
  - [x] Interaksi terasa cepat dan responsif, tidak ada lag saat mengetik atau berpindah halaman.

---

## Catatan Tambahan

*(Area untuk mencatat bug atau perilaku tak terduga yang ditemukan selama UAT)*

- **BUG-1203-01:** Tombol Undo/Redo hanya muncul di halaman Dashboard. Seharusnya tombol ini bersifat global dan selalu terlihat di Navbar utama di semua halaman.