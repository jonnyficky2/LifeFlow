---
id: IDEAS-001
type: Idea Repository
parent: docs/product/FUTURE_PRODUCT_VISION.md
child: None
reference: docs/project/TASK_BOARD.md, docs/project/WORKFLOW.md
---

# LifeFlow Ideas Repository

Dokumen ini adalah repositori sentral untuk seluruh ide eksperimental, pengajuan fitur, dan spekulasi teknis. **Ini bukan backlog.** Ide di sini BELUM tentu dikerjakan dan membutuhkan penelitian atau persetujuan lebih lanjut sebelum diterjemahkan menjadi modul di *Roadmap* atau *Task Board*.

---

## 1. Product Ideas

### [IDEA-P01] Daily Recap Journaling
- **Description:** Memaksa pengguna menulis satu kalimat refleksi sebelum bisa menyelesaikan semua task di hari itu.
- **Why:** Meningkatkan ikatan emosional pengguna dengan aplikasinya (habit retention).
- **Benefits:** Mengurangi *burnout* dan merangkum pencapaian harian.
- **Risks:** Bisa dianggap sebagai *friction* (gangguan) oleh power user yang sibuk.
- **Dependencies:** Milestone M5 (Notes).
- **Estimated Impact:** Medium
- **Estimated Complexity:** Low
- **Status:** IDEA

---

## 2. UX Ideas

### [IDEA-U01] Omnibar Command Palette (Cmd+K)
- **Description:** Jendela global *search/execute* mirip Spotlight Mac atau Linear.
- **Why:** Power users benci menggunakan mouse untuk navigasi UI.
- **Benefits:** Navigasi secepat kilat lintas modul.
- **Risks:** Membutuhkan registrasi *keyboard listener* kompleks yang bisa menabrak shortcut browser bawaan.
- **Dependencies:** None.
- **Estimated Impact:** High
- **Estimated Complexity:** High
- **Status:** APPROVED (Masuk ke Backlog M1/M2)

---

## 3. AI Ideas

### [IDEA-A01] Passive Task Predictor
- **Description:** AI menganalisis data *Habit* dan *Tasks* mingguan, lalu di setiap Senin pagi otomatis membuat "Draft Task" yang menyarankan jadwal kerja minggu itu.
- **Why:** Membantu pengguna keluar dari kelumpuhan analitik (*decision fatigue*).
- **Benefits:** Membuat aplikasi terasa "hidup" dan proaktif.
- **Risks:** Pengguna mungkin merasa ngeri (*creepy*) privasinya diganggu, dan membutuhkan LLM parsing.
- **Dependencies:** Milestone M7 (AI Workspace).
- **Estimated Impact:** High
- **Estimated Complexity:** Very High
- **Status:** RESEARCH

---

## 4. Engineering Ideas

### [IDEA-E01] Migrasi dari LocalStorage ke SQLite WASM
- **Description:** Mengganti kapabilitas `window.localStorage` dengan engine database relasional SQL penuh yang dikompilasi ke WebAssembly.
- **Why:** LocalStorage memiliki batas ketat 5MB dan sangat lambat jika array JSON mencapai ribuan *nodes*.
- **Benefits:** Kapasitas tak terbatas (OPFS) dan pencarian relasional (JOIN queries).
- **Risks:** Menambah ukuran *bundle size* aplikasi yang signifikan saat *load* pertama.
- **Dependencies:** None
- **Estimated Impact:** High
- **Estimated Complexity:** Medium
- **Status:** RESEARCH

---

## 5. Performance Ideas

### [IDEA-PF01] Web Worker untuk Data Serialization
- **Description:** Mengirim seluruh tugas pengubahan JSON object ke file Markdown (dan sebaliknya) ke `Web Worker` (*background thread*).
- **Why:** Mencegah main-thread (UI thread) tersendat (*jank*) saat *auto-saving* dokumen panjang.
- **Benefits:** 60fps konstan walau *saving* file sebesar 10MB.
- **Risks:** Sinkronisasi *state* dari Worker kembali ke React UI cukup rumit.
- **Dependencies:** Milestone M5 (Notes).
- **Estimated Impact:** High
- **Estimated Complexity:** High
- **Status:** PARKED

---

## 6. Security Ideas

### [IDEA-S01] Client-Side E2E Encryption (AES-GCM)
- **Description:** Mengenkripsi semua *notes* dan *tasks* di browser menggunakan *password* pengguna sebelum file diserahkan ke *File System*.
- **Why:** Mencegah kebocoran data jika laptop dicuri, walau file `.md` terbaca, isinya terenkripsi.
- **Benefits:** Keamanan setara bank untuk catatan pribadi.
- **Risks:** Jika pengguna lupa *password*, data hilang selamanya (Zero-Knowledge).
- **Dependencies:** Milestone M1.
- **Estimated Impact:** High
- **Estimated Complexity:** High
- **Status:** PARKED

---

## 7. Collaboration Ideas

### [IDEA-C01] P2P Workspace via WebRTC
- **Description:** Memungkinkan 2 perangkat pengguna yang berada di *wifi* sama, berbagi file *tasks* secara langsung tanpa perlu server backend.
- **Why:** Menghindari biaya langganan cloud dan mematuhi asas *Local-first*.
- **Benefits:** Kolaborasi *real-time* gratis dan ultra-cepat.
- **Risks:** WebRTC rentan terhadap masalah *firewall* dan NAT traversal.
- **Dependencies:** Milestone M8 (Team Collaboration).
- **Estimated Impact:** High
- **Estimated Complexity:** Very High
- **Status:** IDEA

---

## 8. Future Business Ideas

### [IDEA-B01] LifeFlow Cloud Sync (Pro Subscription)
- **Description:** Walau aplikasi 100% lokal dan gratis, pengguna bisa membayar $5/bulan untuk layanan Relay Server yang otomatis men-*sync* Markdown antar PC dan HP.
- **Why:** Sebagai strategi monetisasi agar aplikasi *open-source* tetap terdanai (*sustainable*).
- **Benefits:** Sumber pendapatan stabil (*MRR*).
- **Risks:** Mencederai idealisme komunitas jika tidak dikomunikasikan dengan baik.
- **Dependencies:** Semua Milestone Core selesai.
- **Estimated Impact:** Critical
- **Estimated Complexity:** High
- **Status:** IDEA

---

## 9. Research Ideas

### [IDEA-R01] Integrasi Yjs (CRDT)
- **Description:** Studi kelayakan mengganti Redux/Context state menjadi struktur `Y.Doc` untuk *conflict-free replication*.
- **Why:** Sangat krusial jika suatu saat kita ingin *multi-player editing*.
- **Benefits:** Fondasi data tercanggih saat ini.
- **Risks:** Kurva belajar (*learning curve*) algoritma CRDT tinggi.
- **Dependencies:** IDEA-C01.
- **Estimated Impact:** Medium
- **Estimated Complexity:** High
- **Status:** RESEARCH

---

## 10. Crazy Ideas

### [IDEA-X01] LifeFlow Terminal UI (CLI Version)
- **Description:** Aplikasi LifeFlow dibuatkan versi baris perintahnya (CLI/TUI) di terminal menggunakan Rust/Go.
- **Why:** Sebagian engineer ekstrem benci GUI.
- **Benefits:** Dominasi absolut *mindshare* programmer.
- **Risks:** Harus memelihara 2 *codebase* berbeda (Web/React & CLI/Rust).
- **Dependencies:** None.
- **Estimated Impact:** Low
- **Estimated Complexity:** Very High
- **Status:** REJECTED
