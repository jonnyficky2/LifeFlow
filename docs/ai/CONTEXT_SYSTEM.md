# Context System

AI tidak memiliki ingatan permanen (State-less) lintas percakapan baru. Sistem Konteks (*Context System*) adalah mekanisme untuk "mendownload" ingatan proyek ke dalam otak AI sebelum mereka mulai bekerja.

**Jangan pernah menugaskan agen tanpa menginjeksi blok konteks ini.**

## Format Standar `System Context Payload`

Kapan pun Anda membuka obrolan baru dengan AI, salin-tempel *(copy-paste)* format di bawah ini sebagai pesan pertama. AI wajib mengonfirmasi ("Saya mengerti") sebelum Anda memberikan tugas.

```markdown
<SYSTEM_CONTEXT>
Kamu sekarang berada dalam lingkungan kerja Project LifeFlow. Gunakan data berikut sebagai acuan absolut (Source of Truth).

1. PROJECT_NAME: LifeFlow OS
2. CURRENT_MILESTONE: [Isi dengan Milestone saat ini, misal: M2 - Task Management]
3. ARCHITECTURE_STYLE: 
   - Local-First (Offline by default).
   - Markdown-First (Data akhirnya akan disimpan ke format MD di File System / OPFS).
   - Zero Vendor Lock-in (UI CSS murni tanpa Tailwind, DB lokal tanpa Backend as a Service).
4. TECH_STACK: React, TypeScript, Vite, IndexedDB/Dexie (Local DB), Web Workers, WebGPU.
5. CODING_STANDARD:
   - TypeScript Strict Mode mutlak.
   - Reusable Components (SOLID, DRY).
   - Gunakan CSS Variables (`var(--name)`) untuk konsistensi UI & Tema (Dark/Light).
   - "Simplicity over Complexity". Jangan lakukan *over-engineering*.
6. CRITICAL_RULES:
   - Dilarang membuat `alert()`, `prompt()`, atau `confirm()` bawaan browser. Wajib pakai kustom Modal UI proyek.
   - Wajib menjaga performa 60fps. Proses berat (Parsing/AI) WAJIB masuk ke Web Worker.
   - Jangan menambahkan Dependency NPM tanpa justifikasi kuat.
7. CURRENT_TASK:
   - [Paste nama task atau link ke TASK_BOARD.md di sini]
</SYSTEM_CONTEXT>

Jika Anda mengerti konteks ini, balas dengan: "Konteks Diterima. Saya siap menerima Role dan Task pertama saya."
```

## Cara Menjaga Konsistensi Konteks

1. **Gunakan "Memory Refresh" Setiap 10 Prompt**
   Konteks *window* pada LLM sering kali mengalami degradasi (melupakan instruksi awal) pada percakapan yang sangat panjang. Secara berkala, ingatkan AI:
   *"Mengingatkan kembali aturan 6: Pastikan proses ini berjalan di Web Worker, jangan memblokir Main Thread."*
2. **Berikan Potongan File Terbatas (Snippets)**
   Jangan melempar seluruh kode proyek ke AI jika tidak perlu. Berikan **HANYA** file `types/` (untuk referensi interface) dan **FILE SAAT INI** yang sedang dimodifikasi untuk mencegah halusinasi kode.
3. **Referensi ke Keputusan Sebelumnya**
   Bila AI mengusulkan arsitektur yang sebelumnya pernah ditolak, arahkan AI ke `DECISION_LOG.md`:
   *"Ingat, di DECISION_LOG [DEC-002], kita sudah memutuskan untuk tidak menggunakan Chart.js. Harap buat ulang grafik menggunakan SVG murni."*
