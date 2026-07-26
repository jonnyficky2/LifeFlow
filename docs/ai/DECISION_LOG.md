# AI Architecture Decision Log (DECISION_LOG)

Dokumen ini adalah rekaman sejarah mengenai **MENGAPA** sebuah keputusan arsitektur diambil dalam LifeFlow. AI, terutama dalam peran *Software Architect*, wajib mencatat setiap pergeseran (pivot) teknologi atau pola desain ke dalam format log ini. 

Hal ini krusial agar agen AI di masa depan tidak mengulangi perdebatan yang sama atau merombak sistem yang sudah disepakati (contoh: "Kenapa kita tidak pakai Tailwind saja?").

## Format Pencatatan (Architecture Decision Record - ADR)

Setiap entri harus menggunakan format *Markdown Header* (H3) seperti ini:

```markdown
### [DEC-XXX] Judul Singkat Keputusan
**Date**: YYYY-MM-DD
**Author**: [Nama Anda / Nama AI (Contoh: Architect AI - Claude Opus)]
**Status**: [ PROPOSED | ACCEPTED | REJECTED | DEPRECATED ]

**1. Deskripsi Masalah (Context):**
Apa pemicu (trigger) keputusan ini? Masalah teknis atau batasan bisnis apa yang sedang kita hadapi? (Maks. 2 paragraf).

**2. Keputusan yang Diambil (Decision):**
Pilihan spesifik teknologi atau arsitektur yang disetujui. (Maks. 1 paragraf).

**3. Alasan (Rationale):**
Mengapa opsi ini menang dibanding alternatif lain? Sebutkan perbandingan (trade-offs) teknis secara transparan.

**4. Dampak (Consequences):**
- **Positif (+)**: Apa yang diuntungkan? (Performa, kemudahan developer, keamanan).
- **Negatif (-)**: Apa konsekuensi buruknya yang harus ditanggung (*Technical debt*, waktu *compile* yang naik, migrasi basis data).
```

---

## Log Keputusan Aktif

### [DEC-001] Penetapan Penyimpanan Lokal Klien (Client-Side Local Storage)
**Date**: 2026-06-25
**Author**: Human Lead
**Status**: ACCEPTED

**1. Deskripsi Masalah (Context):**
LifeFlow membutuhkan mekanisme penyimpanan state aplikasi (tugas, kebiasaan) agar persistensi data terjamin meski halaman ditutup (refresh). Di tahap awal (MVP), kita menghindari pembuatan backend database jarak jauh.

**2. Keputusan yang Diambil (Decision):**
Kita menggunakan API `window.localStorage` peramban untuk menyimpan data JSON dalam fase M1 hingga M9, sebelum akhirnya bermigrasi ke `IndexedDB`.

**3. Alasan (Rationale):**
LocalStorage sangat sederhana (Zero-setup) dan sangat cukup untuk membangun antarmuka dan membuktikan fungsionalitas CRUD secara instan, menghormati filosofi "Simplicity over Complexity" dan "Offline First".

**4. Dampak (Consequences):**
- **Positif (+)**: Kecepatan pengembangan maksimal, nol latensi jaringan.
- **Negatif (-)**: Limit kuota hanya ~5MB, operasi baca/tulis adalah pemblokir utas sinkron (*synchronous blocking*).

---

### [DEC-002] Menghapus Kebergantungan (Dependency) Chart.js
**Date**: 2026-07-20
**Author**: UI/UX AI
**Status**: ACCEPTED

**1. Deskripsi Masalah (Context):**
Modul statistik dan pelaporan produktivitas memerlukan visualisasi (grafik). Penggunaan `Chart.js` atau Recharts diajukan.

**2. Keputusan yang Diambil (Decision):**
Dilarang menggunakan Chart.js/Recharts. Grafik harus dibuat secara manual menggunakan HTML/CSS fleksibel (Flexbox) atau komponen kustom SVG asli (Native SVG).

**3. Alasan (Rationale):**
Grafik kita tidak membutuhkan interaksi interaktif tinggi (hanya bar dasar untuk 7 hari). Library grafik berat akan menambah *bundle size* puluhan kilobyte yang sia-sia, melanggar *Performance Budget* MVP.

**4. Dampak (Consequences):**
- **Positif (+)**: Performa *loading* sangat cepat, CSS murni mudah dimodifikasi agar menyatu dengan *Design Token* aplikasi.
- **Negatif (-)**: Menulis HTML DOM/SVG dari nol untuk grafik memakan waktu *coding* sedikit lebih lama.

---

### [DEC-003] Peralihan Eksekusi AI ke WebLLM (WebGPU)
**Date**: 2026-07-26
**Author**: Principal AI Architect
**Status**: ACCEPTED

**1. Deskripsi Masalah (Context):**
Perencanaan fitur *AI Workspace* awalnya menargetkan penggunaan agen Ollama (AI Desktop lokal). Hal ini merusak pengalaman *Progressive Web App* (PWA) di mana aplikasi web harus bisa memanggil asisten AI tanpa meminta pengguna menginstal *software server* CLI (Command Line Interface).

**2. Keputusan yang Diambil (Decision):**
Arsitektur AI lokal wajib dibangun menggunakan pustaka WebLLM (atau teknologi inferensi WebAssembly/WebGPU sejenis) yang mengeksekusi model (misal: Llama-3-8B) langsung di dalam batas memori *browser* pengguna, dengan pengelompokan (*Fallback*) ke Cloud API (*Bring Your Own Key*) jika WebGPU tidak tersedia.

**3. Alasan (Rationale):**
Ini mempertahankan prinsip *Privacy First* 100% tanpa gesekan instalasi (Zero Friction Onboarding). Pengguna hanya perlu mengakses web, model diunduh ke *cache* peramban, dan inferensi AI bisa dijalankan di atas infrastruktur OPFS yang aman.

**4. Dampak (Consequences):**
- **Positif (+)**: PWA sepenuhnya dapat mendistribusikan pengalaman "Asisten AI Privat" murni tanpa *server cloud*. 
- **Negatif (-)**: Beban memori peramban (*RAM Usage*) pengguna akan membengkak, sehingga rendering antarmuka *Widget* harus diisolasi ke *Web Worker* demi mencegah tabrakan *Main Thread*.
