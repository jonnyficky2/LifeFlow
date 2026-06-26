# UAT Checklist: Phase 2 (Task Module & App Shell Integration)

Gunakan checklist ini untuk menguji secara manual aplikasi LifeFlow sebelum mengubah status Tahap 2 menjadi `[DONE]`.
Beri tanda `[ ] PASS`, `[ ] FAIL`, atau biarkan default `[ ] NOT TESTED` untuk setiap item.

---

## 1. General
- [ ] NOT TESTED | Aplikasi berhasil dibuka
- [ ] NOT TESTED | Tidak ada blank page
- [ ] NOT TESTED | Tidak ada console error
- [ ] NOT TESTED | Tidak ada runtime error

## 2. Sidebar
- [ ] NOT TESTED | Sidebar dapat dibuka (via toggle pada layar kecil atau selalu tampil di desktop)
- [ ] NOT TESTED | Sidebar dapat ditutup (via toggle, tombol tutup, atau klik pada overlay)
- [ ] NOT TESTED | Semua menu dapat diklik
- [ ] NOT TESTED | Menu aktif berubah visualnya (`is-active` / `active` class) dengan benar

## 3. Navigation
- [ ] NOT TESTED | Bisa pindah ke halaman Dashboard
- [ ] NOT TESTED | Bisa pindah ke halaman Tasks
- [ ] NOT TESTED | Bisa pindah ke halaman Categories
- [ ] NOT TESTED | Semua halaman dan komponen (termasuk bottom nav di versi mobile) dapat diakses dan di-render

## 4. Dashboard
- [ ] NOT TESTED | Statistik (All Tasks, Pending, Done, Today) tampil akurat sesuai data Task
- [ ] NOT TESTED | XP Level Bar berubah saat Task diselesaikan / batal
- [ ] NOT TESTED | Streak / Heatmap berubah sesuai histori hari penyelesaian task
- [ ] NOT TESTED | Tampilan status aplikasi (layout, visual grid) stabil dan empty state tampil baik

## 5. Tasks
- [ ] NOT TESTED | Tambah Task baru berfungsi
- [ ] NOT TESTED | Edit Task yang sudah ada berfungsi
- [ ] NOT TESTED | Delete Task berfungsi
- [ ] NOT TESTED | Toggle Complete (checklist box ditekan) berjalan
- [ ] NOT TESTED | Search / pencarian teks berhasil menemukan tasks
- [ ] NOT TESTED | Filter (All, Pending, Done) memilah tugas dengan benar
- [ ] NOT TESTED | Priority (visual prioritas / dropdown) tesimpan
- [ ] NOT TESTED | Reminder tersimpan
- [ ] NOT TESTED | Subtask dapat ditambah, dihapus, dan di-toggle selesainya
- [ ] NOT TESTED | Deadline & peringatan tanggal tersimpan dan ter-render

## 6. Categories
- [ ] NOT TESTED | Tambah Kategori baru dengan nama custom berhasil
- [ ] NOT TESTED | Edit Kategori (mengubah nama) berhasil
- [ ] NOT TESTED | Delete Kategori (beserta seluruh task di dalamnya) berjalan aman
- [ ] NOT TESTED | Task dapat diasosiasikan atau difilter sesuai kategorinya dengan benar pada tampilan utama Tasks

## 7. Modal (Task / Add)
- [ ] NOT TESTED | Buka modal sukses (tombol `+ Add Task`)
- [ ] NOT TESTED | Tutup modal sukses (via tombol cancel)
- [ ] NOT TESTED | Escape key (keyboard shortcut) untuk menutup (Opsional/Jika ada)
- [ ] NOT TESTED | Klik di luar form / overlay click menutup modal (Opsional/Jika diimplementasi)

## 8. LocalStorage (Data Persistence)
- [ ] NOT TESTED | Lakukan aksi pada Tasks, lalu *Refresh browser*
- [ ] NOT TESTED | Pastikan seluruh data (Task, XP, dll.) tetap ada dan tidak hilang

## 9. Responsive Layout
- [ ] NOT TESTED | Desktop: Sidebar terlihat penuh, layout grid dashboard tidak pecah
- [ ] NOT TESTED | Tablet: Padding stabil, navbar proporsional
- [ ] NOT TESTED | Mobile: Sidebar sembunyi, Bottom Nav muncul, toggle sidebar menampilkan sidebar menutupi layar sebagian

## 10. Theme (Dark / Light Mode)
- [ ] NOT TESTED | Mode Light berfungsi (tombol toggle bekerja dan mengubah skema warna CSS)
- [ ] NOT TESTED | Mode Dark berfungsi (warna teks, *background*, *card* kembali ke tema gelap)

## 11. Undo / Redo
- [ ] NOT TESTED | Fungsi Undo mengembalikan aksi terakhir (cth. setelah ceklis, di-undo ceklis hilang)
- [ ] NOT TESTED | Fungsi Redo mengulangi aksi (cth. undo pembatalan ceklis, lalu redo membuat tugas selesai kembali)
- [ ] NOT TESTED | Tombol di Dashboard untuk Undo/Redo bekerja normal
