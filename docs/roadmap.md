---
id: RDM-001
type: Roadmap
parent: docs/REQUIREMENTS.md
child: docs/project/MODULES.md
reference: docs/product/FUTURE_PRODUCT_VISION.md
---

# LifeFlow Development Roadmap

Peta jalan operasional untuk mencapai target yang tertuang dalam [FUTURE_PRODUCT_VISION.md](./product/FUTURE_PRODUCT_VISION.md). Berbeda dengan Visi Jangka Panjang (berbasis spektrum/tahun), *Roadmap* ini bertindak sebagai urutan kerja rekayasa (*engineering milestones*) dari sisi teknis untuk siklus pengembangan saat ini.

---

## M1 - Foundation [✅ DONE]
- Inisialisasi Project (Vite + React + TS).
- Pemasangan arsitektur CSS global berbasis HTML legacy.
- Integrasi App Shell (Sidebar, Navbar, Layouting Mobile/Desktop).
- *State Management* Dasar (Context API) & LocalStorage Sync.
- Implementasi sistem transisi Light/Dark Mode.

## M2 - Task Management [🔍 TESTING]
- Migrasi UI halaman Tasks dan Modal CRUD.
- Logika pengelolaan tugas komprehensif (Tambah, Edit, Hapus, Filter, Tag, Deadline, Subtasks).
- Implementasi sistem riwayat mutasi (*Undo/Redo History Stack*).
- Pengelolaan relasional *Categories*.
- **Target Sukses:** Lulus UAT penuh (Fungsi stabil, nol data loss, UI responsif).

## M3 - Calendar [⏳ NEXT]
- Pemetaan data tenggat waktu (deadline) dari Tasks ke dalam format kotak kalender bulanan/mingguan.
- Interaksi memindahkan jadwal via kalender secara langsung.
- **Dependency:** M2 (Task Management).

## M4 - Habit Tracker [🟡 PLACEHOLDER]
- Pembuatan komponen *Github-style Contribution Grid*.
- Skema pencatatan kebiasaan rutin mandiri per hari yang menyumbang langsung pada sistem XP (*Gamification* level profil pengguna).

## M5 - Notes [🟡 PLACEHOLDER]
- Pengadaan antarmuka dua jendela (*Two-pane editor*).
- Integrasi editor *Markdown* murni berbasis *AST Parser* murni untuk pembacaan dan penulisan catatan harian (*Journal*).

## M6 - Analytics & Focus Timer [🟡 PLACEHOLDER]
- Implementasi hitung mundur (*Pomodoro*) yang tertaut dengan Task aktif.
- Agregasi *Dashboard Insight* (Berapa jam fokus tercapai, perbandingan tugas selesai per minggu).

## M7 - AI Workspace [🟡 PLACEHOLDER]
- Inkubasi *Invisible AI Agent* (Pengekstrak tugas dari Notes menggunakan Local LLM/Cloud LLM).
- Sistem *Omnibar Command Palette (Cmd+K)* untuk eksekusi perintah AI dinamis di level navigasi OS.

## M8 - Team Collaboration [🟡 PLACEHOLDER]
- Persiapan transisi Local-First ke Local-First + P2P/CRDTs.
- Dukungan *Multiplayer editing* untuk Tasks dan Notes dengan kolega atau anggota tim (Pendelegasian & Kolaborasi langsung).