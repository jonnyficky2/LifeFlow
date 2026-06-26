---
id: REQ-001
type: Requirements
parent: docs/product/PRD.md
child: docs/ROADMAP.md
reference: docs/project/TASK_BOARD.md
---

# LifeFlow Functional & Non-Functional Requirements

Dokumen ini diturunkan langsung dari [PRD.md](./product/PRD.md). Ini adalah kontrak spesifikasi teknis untuk pengembangan LifeFlow yang wajib dipatuhi.

## 1. Functional Requirements (Kebutuhan Fungsional)

### FR1. Manajemen Status Aplikasi (App Shell)
- **1.1.** Aplikasi harus memuat navigasi Sidebar (kiri) yang bisa di-*toggle* untuk perangkat *mobile*.
- **1.2.** Pengguna dapat berpindah halaman (Tasks, Categories, Dashboard) tanpa reload browser (SPA).
- **1.3.** Mendukung pergantian Mode Tampilan (Light / Dark Theme) yang statusnya disimpan secara lokal.

### FR2. Task Management (Milestone M2)
- **2.1.** Pengguna dapat membuat tugas baru (Create), mengedit nama dan atribut tugas (Update), menghapus tugas (Delete), serta menandai tugas selesai (Toggle Status).
- **2.2.** Mendukung elemen *Subtask* (checklist di dalam task utama).
- **2.3.** Mendukung prioritas (Low, Medium, High).
- **2.4.** Mendukung tenggat waktu (*Deadline*).
- **2.5.** Mendukung pengelompokkan tugas berdasarkan Kategori yang bisa dibuat dinamis secara custom (CRUD Kategori).

### FR3. Manajemen Riwayat (Undo/Redo)
- **3.1.** Sistem menyimpan tumpukan status (*history stack*) secara sementara.
- **3.2.** Pengguna dapat membatalkan aksi terakhir (Undo) menggunakan UI Button di header.
- **3.3.** Pengguna dapat mengulang aksi yang dibatalkan (Redo).

### FR4. Data Persistence (Local-First)
- **4.1.** Seluruh state (Tasks, Categories, XP, Theme, Habit) harus ditulis balik ke `window.localStorage` (atau SQLite di masa mendatang) *secara instan* pasca-mutasi.
- **4.2.** Pemulihan otomatis saat *browser refresh* atau aplikasi dihidupkan ulang.

---

## 2. Non-Functional Requirements (Kebutuhan Non-Fungsional)

### NFR1. Performance
- Transisi modul (klik navigasi) harus selesai dalam < 100ms.
- Render *Task Board* dengan 500+ entri tidak boleh menyebabkan kemacetan peramban (*UI Jank*).

### NFR2. Security
- Isolasi lokal absolut (Data aplikasi tidak diizinkan dikirim ke server pihak ketiga manapun untuk alasan *analytics* atau telemetri).

### NFR3. Usability (Aksesibilitas UI)
- Input aksi repetitif (menambah task/subtask) harus bisa dilakukan hanya dengan tombol *Keyboard (Enter)*.
- Tersedia status keadaan kosong (*Empty States*) yang mengarahkan pengguna secara intuitif jika tidak ada tugas yang tersimpan.

### NFR4. Availability
- Aplikasi berstatus **Offline First** (PWA). Akses penuh pada fitur inti walau mode pesawat (*Airplane Mode*) dinyalakan pada perangkat.