# Praktik Terbaik Bekerja dengan Multi-Agent AI (Best Practices)

Dokumen ini adalah panduan harian untuk berkolaborasi dengan AI secara efisien, aman, dan tanpa frustrasi.

## 1. Kapan Menggunakan AI?
* **Bootstrapping (Mulai Cepat)**: Meminta AI menyiapkan komponen React kosong (Boilerplate) lengkap dengan interface TypeScript dan file CSS terkait.
* **Refactoring Rutin**: Mengubah gaya komponen kelas lama menjadi komponen fungsional dengan *Hooks*.
* **Pencarian Bug Kompleks**: Menyerahkan tumpukan jejak galat (*Stack trace* error) dan meminta RCA (Root Cause Analysis).
* **Pembuatan Data Palsu (Mock Data)**: Meminta AI membuat 50 data JSON yang realistis untuk menguji *UI Layout* dari *Widget System*.
* **Automated Tests**: Meminta AI membuatkan blok *test cases* (*Playwright/Jest*) berdasarkan kriteria penerimaan (Acceptance Criteria).

## 2. Kapan TIDAK Menggunakan AI?
* **Keputusan Bisnis Final**: Jangan membiarkan AI menetapkan metrik keberhasilan bisnis; itu tugas manusia.
* **Penilaian Estetika Abstrak**: Menanyakan "Apakah warna ini terlihat cantik?" AI seringkali akan menjawab normatif (setuju dengan Anda). Manusia harus menilai UI.
* **Perbaikan Kode Sensitif Keamanan (Kriptografi Kustom)**: Jangan menyerahkan logika enkripsi klien (*Client-Side AES-GCM*) sepenuhnya pada kode yang digeneralisasi AI tanpa audit manusia baris-demi-baris.

## 3. Cara Meminta Refactor
Jangan katakan: *"Perbaiki file ini agar lebih bagus."*
Katakan (Prompt):
> **Role:** Performance Engineer.
> **Task:** Refactor komponen `Dashboard.tsx` terlampir. Pisahkan logika perhitungan metrik XP ke dalam custom hook `useLevelStats.ts`. Gunakan `useMemo` pada list tugas agar komponen tidak melakukan *re-render* setiap detiknya.

## 4. Cara Meminta Review (Code Review)
Jangan katakan: *"Apakah kodenya sudah benar?"*
Katakan (Prompt):
> **Role:** Senior QA dan Security Engineer.
> **Task:** Lakukan review kode untuk Pull Request ini. Berikan skor (1-10) untuk: 1) Clean Code, 2) Performa, 3) Celah Keamanan (XSS). Tuliskan laporan singkat yang berisi potensi *Memory Leak* jika ada.

## 5. Cara Meminta Debugging (RCA - Root Cause Analysis)
Jangan katakan: *"Kodenya error, tolong betulkan."*
Katakan (Prompt):
> **Role:** Backend Engineer.
> **Context:** Ketika widget kalender memuat data di atas 1000 entri, browser crash dengan error "Out of memory".
> **Task:** Lakukan RCA. Jelaskan 3 kemungkinan teratas yang menyebabkan hal ini. Jangan tulis kodenya dulu, jelaskan strateginya (misal: Virtualisasi UI vs Pagination).

## 6. Cara Meminta Dokumentasi
Katakan (Prompt):
> **Role:** Technical Writer.
> **Task:** Baca file fungsi sinkronisasi IndexedDB terlampir. Buat dokumen penjelasan API teknis, parameter, dan diagram *Mermaid* sederhana yang menggambarkan alur aliran datanya.

## 7. Cara Menjaga Konsistensi Hasil dari Banyak AI
Bekerja dengan model AI lintas penyedia (OpenAI, Anthropic, Google) berpotensi menghasilkan varian kode (*style drift*).
**Solusi:**
1. Pertahankan `MASTER_SOURCE_OF_TRUTH.md` dan `CONTEXT_SYSTEM.md` sebagai **jangkar/sauh (anchor)**. Model yang berbeda, jika diberi jangkar konteks yang sama, akan menghasilkan kesimpulan dan struktur kode yang konvergen (mirip).
2. Terapkan konfigurasi *Prettier* dan *ESLint* di dalam proyek secara ketat. Jadi, meskipun AI menulis dengan indentasi atau gaya berbeda, *Git Hooks* (Husky) akan menyelaraskannya ke standar manusia secara otomatis saat di-commit.
