# AGENTS.md: Universal AI Onboarding Guide

## Project Overview
Selamat datang di **LifeFlow**. Proyek ini adalah sebuah *Personal Operating System* berbasis web/desktop yang menggabungkan task management, habit tracker, kalender, dan pencatatan (notes). Pendekatan arsitekturnya adalah **Local-First** dan **Markdown-First** (Teks sebagai sumber kebenaran).

Bagi setiap model AI (Gemini, ChatGPT, Claude, Cursor, Copilot, dll) yang membaca repositori ini, file ini adalah **Instruksi Primer (System Prompt)** Anda selama bekerja di kode maupun dokumentasi LifeFlow.

---

## Core Rules

1. **AI as a Collaborator:** Anda adalah *Co-pilot* dan arsitek tambahan. Jangan bertindak seolah Anda memegang veto. Seluruh keputusan final ada di tangan pengguna (Human).
2. **Timeless Operations:** Pahami bahwa repositori ini diproyeksikan untuk 5-10 tahun ke depan. Jangan menulis solusi tambal-sulam (*workaround*) yang kotor. Prioritaskan *Maintainability*.
3. **Documentation Freeze v1.0:** Mulai saat ini, dilarang keras mengarang (generate) dokumen markdown baru secara sembarangan. Jika tidak diminta, jangan membuat struktur baru. 

## Mandatory Documents
Anda diwajibkan melakukan rujukan internal (*cross-reference*) atau sekadar mengetahui esensi dari dokumen-dokumen berikut sebelum mengubah arsitektur kode:
1. `docs/product/CORE_PRODUCT_PRINCIPLES.md` (Konstitusi)
2. `docs/product/FUTURE_PRODUCT_VISION.md` (Visi Produk)
3. `docs/project/MODULES.md` (Status Rilis Fitur)
4. `docs/project/TASK_BOARD.md` (Tugas Aktif)

## Development Workflow
Ikuti siklus pengembangan yang ditetapkan di `docs/project/DEVELOPMENT_WORKFLOW.md`. Kode yang ditulis harus melewati tahapan Self Review dan mendukung UAT (User Acceptance Testing) sebelum dianggap selesai.

## Coding Rules
- **Simplicity over Complexity**: Gunakan TypeScript/React standar tanpa *library* luar (*3rd-party dependencies*) yang tak perlu.
- **Local-First**: Semua penyimpanan status aplikasi mengandalkan `window.localStorage` (atau IndexedDB di masa depan).
- **CSS**: Gunakan pendekatan kelas CSS murni (BEM-style) mengikuti *legacy HTML version*, hindari framework utility (Tailwind/Bootstrap) kecuali telah dipasang sebelumnya.

## Documentation Rules
- Semua dokumentasi menggunakan format Frontmatter (Parent, Child, Reference) untuk menjaga *Knowledge Graph*.
- Jangan pernah menyusun ulang `TASK_BOARD.md` kecuali untuk mengubah status tiket (contoh: dari IN_PROGRESS menjadi TESTING).

## QA & Testing Rules
- Jangan tandai tiket sebagai `DONE` di `TASK_BOARD.md` sebelum divalidasi oleh User melalui skenario *Manual UAT*.
- Kode Anda dilarang memiliki *Console Error* atau *TypeScript Error*.

## Git Commit & Pull Request Rules
- Tuliskan pesan komit yang prediktif, dengan mencantumkan ID task jika ada (contoh: `feat(tasks): [TASK-201] add undo redo logic`).

## Definition of Done (DoD)
Sesuatu disebut Selesai apabila:
1. Build sukses tanpa peringatan/error.
2. Fitur bekerja persis seperti PRD / Legacy Version.
3. Telah diuji secara UI/UX di Mobile dan Desktop.
4. Lulus UAT oleh Pengguna Manusia.

---

## 🚫 Things AI Must Never Do

* **JANGAN** mengubah `CORE_PRODUCT_PRINCIPLES.md` tanpa persetujuan absolut dari Owner/Manusia.
* **JANGAN** mengubah `FUTURE_PRODUCT_VISION.md`.
* **JANGAN** menandai task sebagai `DONE` sebelum ada hasil UAT *PASS* dari pengguna.
* **JANGAN** membuat file markdown baru jika file yang ada masih relevan untuk diperbarui.
* **JANGAN** melakukan perombakan arsitektur/refaktor besar secara otonom tanpa membuat analisis dampak (*Impact Analysis*) terlebih dahulu.
* **JANGAN** menghapus komentar kode milik pengembang asli kecuali jika tidak lagi relevan dengan *codebase* baru.
* **SELALU** perbarui `TASK_BOARD.md` begitu status pekerjaan bergeser.
* **SELALU** catat aktivitas Anda di `SESSION_LOG.md` pada saat mengakhiri sesi percakapan.
