# M13 - Operation Stabilization Plan

Dokumen ini berisi cetak biru arsitektur (Technical Design) untuk menyelesaikan utang teknis (Technical Debt) yang diidentifikasi pada *Complete Project Audit* v1.1.

Milestone M13 adalah **prasyarat mutlak** sebelum membangun fitur AI Workspace atau Widget System. Fokusnya adalah: Pembersihan, Keamanan Tipe, dan Performa Skalabilitas.

---

## [TASK-1301] Legacy Code Cleanup

**Tujuan:** Mengurangi ukuran repositori dan menghilangkan kebingungan dari *dead code*.

**Langkah Implementasi:**
1. Hapus direktori `legacy_html_version/` beserta seluruh asetnya.
2. Hapus *script* Python di direktori *root* (misal: `fix_css.py`, `fix_radius_spacing.py`).
3. Pastikan `index.html` dan manifes PWA (yang di-generate oleh Vite) tetap utuh di `public/` atau root aplikasi baru.

---

## [TASK-1302] Strict Type Safety Patch

**Tujuan:** Mengunci struktur data dan menghilangkan perilaku deterministik ganda akibat penggunaan tipe `any`.

**Langkah Implementasi:**
1. Cari penggunaan tipe `any` di seluruh `src/` menggunakan fitur pencarian IDE. (Contoh terbesar ada di `AppContext.tsx`).
2. Definisikan tipe untuk properti yang hilang:
   - Buat antarmuka (interface) yang kuat untuk `Settings` (menyimpan *theme*, preferensi notifikasi, dll).
   - Buat antarmuka untuk `HistoryData` (misal: `Record<string, number>`).
   - Buat antarmuka untuk `StreakData`.
3. Tambahkan aturan TypeScript di lint (atau aktifkan mode ketat/`strict: true` di `tsconfig.json`).

---

## [TASK-1303] IndexedDB Storage Migration (Critical)

**Tujuan:** Mencegah **UI Freezing** saat menyimpan data dalam jumlah besar dengan mengganti API sinkronus `localStorage` menjadi API asinkronus (IndexedDB).

**Keputusan Arsitektur:** Kita akan menggunakan **Dexie.js** sebagai pembungkus (*wrapper*) IndexedDB yang berfokus pada performa. 

**Langkah Implementasi:**
1. Buat file `src/services/db.ts`.
2. Inisialisasi Dexie dengan skema tabel (*Tables*):
   ```typescript
   import Dexie, { type EntityTable } from 'dexie';

   const db = new Dexie('LifeFlowDB') as Dexie & {
     tasks: EntityTable<Task, 'id'>;
     habits: EntityTable<Habit, 'id'>;
     notes: EntityTable<Note, 'id'>;
     metadata: EntityTable<any, 'key'>; // Untuk settings & history
   };
   db.version(1).stores({
     tasks: 'id, deadline, category',
     habits: 'id, name',
     notes: 'id, title, isPinned',
     metadata: 'key'
   });
   ```
3. Di dalam *Context*, buat fungsi asinkronus untuk menulis ke DB (tidak lagi menggunakan `localStorage.setItem` di dalam `useEffect`).
4. Pastikan pemuatan awal aplikasi (initial load) memuat data (query) dari Dexie secara asinkronus, menampilkan *Skeleton Loading* saat memuat.

---

## [TASK-1304] AppContext Splitting

**Tujuan:** Menghindari masalah *"God Context"* yang memicu re-render global secara tidak perlu. Saat ini, setiap kali pengguna mencentang satu tugas, seluruh antarmuka Catatan (Notes) dan Kebiasaan (Habits) ikut di-render ulang.

**Keputusan Arsitektur:** Memecah status (*state*) menjadi domain fungsional yang lebih kecil.

**Langkah Implementasi:**
1. Buat `TaskContext.tsx` untuk menangani kategori dan daftar tugas.
2. Buat `HabitContext.tsx` untuk melacak `habits` dan `habitHistory`.
3. Buat `NoteContext.tsx` khusus untuk manajemen catatan Markdown.
4. Buat `SettingsContext.tsx` (atau biarkan di `AppContext` dasar) untuk manajemen Tema dan Preferensi sistem.
5. Bungkus (*Wrap*) `<App />` di `main.tsx` dengan urutan *Provider* yang tepat. Gunakan `useMemo` dengan bijak pada nilai yang diberikan (*provided value*) untuk memitigasi re-render (*render cascading*).

---

## Kriteria Selesai (Definition of Done)
Saat seluruh M13 selesai, aplikasi harus berjalan persis seperti sebelum migrasi dari sudut pandang pengguna (User Perspective), **NAMUN** dengan konsumsi RAM yang jauh lebih stabil dan tidak ada jeda (*lag*) visual walau mengelola 10.000 file tugas/catatan sekaligus.
