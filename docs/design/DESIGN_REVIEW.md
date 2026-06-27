# Design Review & QA Guidelines

Dokumen ini mendefinisikan panduan peninjauan desain (Design Review) dan proses penjaminan kualitas visual (Visual QA) untuk setiap fitur baru yang dikembangkan di LifeFlow sebelum dirilis.

---

## 1. Visual Regression Checklist (Daftar Periksa UAT)

Setiap pengembang atau QA harus memverifikasi poin-poin berikut pada build pengembangan lokal sebelum menyetujui rilis:

### A. Tipografi & Font Face
- [ ] Seluruh teks dirender menggunakan font **Poppins** (pastikan font termuat dari CDN di network tab).
- [ ] Judul halaman menggunakan font-weight Bold (`700`) sedangkan teks metadata menggunakan font-weight Regular (`400`).
- [ ] Ukuran font heading (H1 = 32px, H2 = 24px, H3 = 18px) konsisten di semua resolusi.

### B. Spacing & Alignments
- [ ] Tidak ada kartu panel atau item daftar yang saling berdempetan langsung tanpa gap (minimal gunakan `--space-4` = 16px atau `--space-5` = 24px).
- [ ] Semua konten di dalam grid dashboard (`.dashboard-grid`) memiliki tinggi yang sejajar dan rapi.
- [ ] Batas luar container terluar berjarak minimal 24px dari tepi layar pada mode desktop.

### C. Responsiveness & Breakpoints
- [ ] **Mode Mobile (< 768px)**:
  - Sidebar tersembunyi secara default (laci ditarik keluar dengan tombol hamburger).
  - Bottom Navigation melayang presisi di bagian bawah tengah layar (lebar 92%).
  - Peta habit grid dapat digeser secara horizontal dengan guliran tipis (scrollable habit-grid).
- [ ] **Mode Tablet (768px - 1100px)**:
  - Tata letak beralih menjadi 1 kolom yang nyaman dibaca tanpa elemen yang terpotong.
- [ ] **Mode Desktop (> 1100px)**:
  - Sidebar terkunci melekat di sisi kiri.
  - Bottom Navigation tersembunyi sepenuhnya.

### D. Kontras & Aksesibilitas (A11y)
- [ ] Kontras warna teks utama ke latar belakang memenuhi kriteria minimum AA WCAG (rasio minimal 4.5:1).
- [ ] Seluruh tombol memiliki area sentuh (hitbox target) setinggi minimal **44px** untuk pengguna perangkat sentuh (mobile).
- [ ] Menekan tombol `Tab` memunculkan outline ring warna `--color-primary` secara tebal pada elemen yang aktif (focus state).

---

## 2. Prosedur Pengujian QA Visual

1. **Local Sandbox Test**: Jalankan `npm run dev` dan buka peramban Chrome DevTools.
2. **Resizing Test**: Ubah ukuran peramban secara dinamis dari lebar 1440px ke 320px dan pastikan tidak ada teks yang menumpuk atau elemen yang bergeser berantakan.
3. **Sidebar Overlay Test**: Buka sidebar di mode mobile, pastikan bayangan overlay hitam (`.sidebar-overlay`) tidak menghalangi penekanan tombol menu di dalam sidebar (uji klik pada item menu).
4. **Theme Switch Test**: Aktifkan mode terang di pengaturan, pastikan seluruh teks di semua halaman kontras dan tidak ada teks putih di atas latar belakang putih.
