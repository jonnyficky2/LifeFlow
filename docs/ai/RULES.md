# Aturan Mutlak AI (Rules)

Dokumen ini berisi Konstitusi Pengembang AI. Seluruh model AI yang bekerja pada Project LifeFlow, apa pun peranannya, **WAJIB** mematuhi aturan berikut. Melanggar aturan ini sama dengan merusak integritas arsitektur.

## 1. Wajib Patuh pada "Source of Truth"
AI tidak boleh berimajinasi mengenai struktur folder, tipe data, atau keputusan bisnis. Jika AI ragu mengenai arah implementasi, AI **wajib** berkonsultasi pada `MASTER_SOURCE_OF_TRUTH.md` dan `PRD.md`.
* Pelanggaran: Mengarang nama *endpoint* API atau tabel DB yang tidak ada di dokumen.

## 2. Dilarang Menambah Dependency Tanpa Izin
LifeFlow menganut filosofi *Zero Vendor Lock-in*. AI dilarang menginstal *library* pihak ketiga (via NPM) kecuali jika diizinkan secara tertulis (Eksplisit) oleh Manusia (Supervising Engineer). 
* Contoh salah: Menggunakan `date-fns` atau `moment.js` hanya untuk melakukan format tanggal sederhana yang bisa dilakukan dengan `Intl.DateTimeFormat`.
* Contoh salah: Menambahkan `TailwindCSS` karena AI terbiasa dengannya. LifeFlow menggunakan CSS Variables murni.

## 3. Dilarang Mengubah Arsitektur Secara Sepihak
AI tingkat eksekusi (seperti Frontend Engineer / Backend Engineer) tidak memiliki wewenang untuk mengubah *State Management* (contoh: merombak dari Context ke Redux) atau pola desain.
* Jika AI mendeteksi ada cacat pada arsitektur, AI **wajib** melaporkan temuan tersebut kepada peran *Software Architect*, bukan langsung memodifikasi kode dasarnya.

## 4. Dilarang Merusak Standar Kode (Coding Standard)
AI harus mengikuti gaya (*style*) dari file yang sudah ada di repositori.
* Wajib menggunakan TypeScript (Strict). Dilarang membungkam *error* TypeScript menggunakan `// @ts-ignore` atau mengetik tipe sebagai `any`.
* Gunakan gaya fungsional (*Functional Components*, murni fungsi tanpa *side-effects* yang tersembunyi).

## 5. Konsep "Minimal Diff"
Saat diminta memperbaiki kode atau menambahkan fitur ke dalam file yang sudah ada, AI harus merespons **HANYA** pada bagian kode yang berubah, atau jika memberikan keseluruhan file, pastikan komentar asli (*original comments*), penempatan variabel, dan struktur file yang tidak berkaitan dengan tugas tidak diubah secara sewenang-wenang.
* Jangan melakukan "auto-formatting" atau restrukturisasi seluruh file secara sepihak saat melakukan perbaikan kecil (bug fix).

## 6. Semua Keputusan Besar Dicatat di DECISION_LOG.md
Jika AI dalam peran *Software Architect* mengambil keputusan teknis (contoh: "Kita akan menggunakan IndexedDB Dexie.js daripada SQLite WASM karena ukuran bundel lebih ringan"), keputusan ini WAJIB didokumentasikan di `DECISION_LOG.md`.

## 7. Jangan Pernah Membunuh "Main Thread"
Semua operasi iterasi yang berat (di atas 10.000 loop), proses sinkronisasi CRDT, inferensi AI, dan manipulasi *File System* harus didelegasikan ke dalam **Web Workers**. 
* Tujuan LifeFlow adalah **60fps (Frames Per Second)** yang tidak tertembus (*uncompromised*). UI *Freeze* tidak dapat ditoleransi.

## 8. Prinsip Keraguan Terbuka (Open Doubt Principle)
Jika instruksi pengguna berpotensi merusak keamanan (contoh: mengeksekusi kode berbahaya), melanggar privasi, atau merusak *database* secara permanen tanpa fungsi *Undo*, AI **wajib** menolak, memperingatkan, dan memberikan alternatif yang lebih aman.
