# Future Product Vision: LifeFlow OS

## Filosofi Produk
LifeFlow dibangun dengan satu visi radikal: **"Semua yang Anda butuhkan untuk mengatur hidup, pekerjaan, dan kode Anda ada di dalam satu aliran."** 

Berangkat dari aplikasi produktivitas personal yang minimalis, LifeFlow tidak akan berakhir hanya sebagai aplikasi *To-Do list*. LifeFlow akan berevolusi menjadi **Operating System untuk produktivitas**. Filosofi utamanya adalah **Teks (Markdown) sebagai Sumber Kebenaran (Source of Truth)**, di mana antarmuka visual (UI) hanyalah kacamata (*lens*) untuk melihat, mengedit, dan memanipulasi file teks mentah yang sepenuhnya dimiliki oleh pengguna. Tidak ada *vendor lock-in*. Data Anda adalah file Anda.

## Evolusi Produk
Evolusi LifeFlow dirancang dalam 5 spektrum, yang tumbuh secara bertahap dari kebutuhan satu orang (*solo*) menuju kolaborasi tim berbasis AI:

1. **Personal Productivity App:** Manajemen tugas (Tasks), Jadwal (Calendar), dan Kebiasaan (Habits).
2. **Personal Knowledge Workspace:** Penambahan fitur Notes Editor dan integrasi pengetahuan, menjembatani aksi (task) dan ide (notes).
3. **AI Workspace:** AI tidak hadir sebagai chatbot yang mengganggu, melainkan asisten tak kasatmata (*invisible AI*) yang mengkurasi, mengorganisasi, dan memprioritaskan ide menjadi aksi.
4. **Team Workspace:** Sinkronisasi *peer-to-peer* (CRDTs), berbagi ruang kerja, pendelegasian tugas, dan fitur *role-based access*.
5. **AI-powered Development Workspace:** Integrasi dengan sistem manajemen proyek, code repository (GitHub/GitLab), CI/CD tracking, dan manajemen siklus pengembangan *software*, mengubah LifeFlow menjadi pusat kendali komprehensif seperti Linear/Jira namun tetap terasa secepat *text editor*.

---

## Mapping Docs → Future Features

Seluruh dokumentasi internal (folder `docs/`) yang kita tulis saat ini adalah fondasi data (blueprint) yang kelak akan bisa divisualisasikan dan diedit secara dinamis melalui UI LifeFlow itu sendiri.

### 1. `TASK_BOARD.md` ➔ Task Board & Sprint Tracker
- **Tujuan Saat Ini:** Papan kendali manual untuk melacak pekerjaan Developer aktif.
- **Potensi Fitur:** Menjadi pusat manajemen tugas aplikasi (mirip Trello / Linear).
- **Bentuk UI:** Papan Kanban dinamis yang bisa di-*switch* ke *Calendar View*, *List View*, dan *Timeline View* (Gantt Chart).
- **Interaksi:** *Drag-and-drop* task antar milestone/status, klik kanan untuk properti.
- **Data yang Dibutuhkan:** Task ID, Judul, Deskripsi, Status, Milestone, Dependencies.
- **Source of Truth:** Markdown file tetap menjadi penyimpan data (Format frontmatter/list khusus).
- **Sinkronisasi:** In-memory SQLite di klien akan *parsing* Markdown ini saat *load*, merender UI, dan saat ada perubahan UI, sistem akan menulis balik (serialize) ke file Markdown di balik layar secara *real-time*.
- **Peran AI:** Auto-Prioritization (menyusun ulang prioritas task berdasarkan tenggat waktu) dan Auto-Estimation (memperkirakan durasi task berdasarkan histori).

### 2. `MODULES.md` ➔ Module Registry & Release Management
- **Tujuan Saat Ini:** Melacak status tingkat tinggi (*high-level*) fitur-fitur di aplikasi.
- **Potensi Fitur:** Halaman **Product Registry** untuk *Release Management*.
- **Bentuk UI:** Tabel *Data Grid* interaktif dengan filter (mirip Airtable atau Notion Database).
- **Interaksi:** Filter modul by status, klik untuk melihat detail modul, progress bar otomatis terhitung dari anak-anak task.
- **Data yang Dibutuhkan:** Nama modul, persentase progress (agregasi otomatis dari Task Board).
- **Source of Truth:** Markdown Tables. 
- **Sinkronisasi:** *Bidirectional parser* membaca tabel Markdown menjadi array JSON di memory (Database lokal), perubahan dari UI menulis ulang format tabel di Markdown.
- **Peran AI:** Mendeteksi *bottleneck* pengembang, memberikan peringatan jika ada modul yang tertahan lama di "TESTING".

### 3. `SESSION_LOG.md` & `BUG_REPORT.md` ➔ Developer Logbook & Issue Tracker
- **Tujuan Saat Ini:** Jurnal kerja harian dan pelacakan bug manual.
- **Potensi Fitur:** Halaman **Activity Feed & Issue Center**.
- **Bentuk UI:** *Activity timeline* dan antarmuka seperti *Inbox* email untuk laporan bug.
- **Interaksi:** Memasukkan log harian secepat membuat cuitan (*tweet*), dan manajemen bug dengan sistem *triage*.
- **Data yang Dibutuhkan:** Timestamp, Author, Isi Pesan, Kategori Bug.
- **Source of Truth:** Markdown dengan struktur *Header (Date)* dan *Lists*.
- **Sinkronisasi:** Tambahan log dari UI akan di-append ke file Markdown.
- **Peran AI:** AI *Summary* pada akhir minggu untuk membuat laporan performa harian dari log yang berantakan, serta *Auto-Triage* untuk bug reports.

### 4. `PRD.md` & `REQUIREMENTS.md` ➔ Product Documentation Hub
- **Tujuan Saat Ini:** Dokumen statis perencana aplikasi.
- **Potensi Fitur:** **Knowledge Base / Wiki** (*Integrated Docs*).
- **Bentuk UI:** Rich Text / Notion-style Block Editor dengan integrasi dua arah (mention task `[TASK-201]` merender status task secara live).
- **Interaksi:** *Slash commands* (`/`) untuk menambah blok, drag and drop image.
- **Data yang Dibutuhkan:** Teks, Gambar, Relasi lintas dokumen.
- **Source of Truth:** Plain Markdown `.md` standar.
- **Sinkronisasi:** Editor Markdown WYSIWYG yang membaca AST (Abstract Syntax Tree) ke UI, menyimpannya kembali ke file Markdown.
- **Peran AI:** AI *Writing Assistant* terintegrasi, kemampuan ekstraksi teks panjang di PRD menjadi task-task satuan di *Task Board* hanya dengan klik "✨ Generate Tasks".

---

## Future Architecture (Markdown-First & Local-First)
Arsitektur masa depan LifeFlow dirancang agar beroperasi penuh secara lokal (Zero-Latency) dan independen, namun *sync-ready*.

- **Storage Layer (File System):** Gudang utama data adalah folder *repository* berisi file-file Markdown murni di *Local File System* pengguna.
- **Database Layer (In-Memory / IndexedDB / SQLite WASM):** Saat aplikasi dibuka, modul parser akan membaca AST dari seluruh Markdown, melakukan indeks (seperti parser parser markdown Hugo/NextJS), dan memuatnya ke SQLite/IndexedDB di browser secara *real-time*.
- **Logic Layer (React + Context/Redux):** Menangani relasi relasional antar dokumen. Jika Task berubah di Kanban, Logic akan memperbarui SQLite, lalu Sinkronizer (Worker) akan menulis ulang baris yang bersangkutan di file `TASK_BOARD.md` di background.
- **Sync Layer (CRDTs / Yjs):** Jika masuk ke Tahap 4 (Tim), file Markdown lokal akan disinkronisasi ke *Cloud* (Node backend) menggunakan teknologi *Conflict-free Replicated Data Types* (CRDT), sehingga 2 orang bisa mengedit file Markdown / Task yang sama secara bersamaan (seperti Google Docs) tanpa ada konflik *merge* yang merusak file.

---

## Future AI Integration
AI akan di-embed langsung ke level sistem saraf aplikasi (*Operating System Level*):
1. **Invisible Extraction**: Anda menulis *meeting notes* di Notes. Di background, AI mengekstrak perintah (cth: "Tolong selesaikan laporan besok") dan menawarkannya sebagai *Draft Task* di dashboard Anda.
2. **Context-Aware Omnibar**: *Cmd+K* bisa digunakan untuk berbicara dengan AI mengenai project Anda. "Tampilkan semua bug yang berhubungan dengan Task Management," AI akan mengkueri `BUG_REPORT.md` dan `MODULES.md` lalu merendernya dalam antarmuka UI temporal.

---

## Long-term Roadmap (1–5 Tahun)

### Tahun 1: Konsolidasi Foundation & Personal App (Tahap 1)
- Pematangan UI/UX (LifeFlow v1.0).
- Eksekusi Milestone M1 hingga M4 (Task, Calendar, Habit).
- Penyimpanan murni LocalStorage (IndexedDB).

### Tahun 2: Knowledge Workspace & File System Bridge (Tahap 2)
- Peluncuran Milestone M5 (Notes Editor).
- Migrasi arsitektur ke sistem *Markdown Parser*, di mana aplikasi dapat membuka folder direktori di laptop pengguna dan membaca/menulis `.md` secara langsung (File System Access API).

### Tahun 3: Invisible AI Injection (Tahap 3)
- Integrasi Local LLM / API LLM ringan (Milestone M7).
- Penerapan fitur "Extract Task", "Summarize Logs", "Auto Prioritize Task".

### Tahun 4: The Team Multiplayer Era (Tahap 4)
- Pengembangan Node Serverless (Backend sync).
- Kolaborasi *Real-time* dengan CRDT (Yjs).
- Workspace *Sharing*, *Permission Roles* (Milestone M8).

### Tahun 5: The Ultimate Dev Workspace (Tahap 5)
- Integrasi ke *developer ecosystem* (Git, Vercel, Slack).
- LifeFlow mampu membaca kode sumber (*source code*) project yang sedang dikerjakan dan melacak progress *commit* secara otomatis ke *Task Board*.
- LifeFlow berevolusi menjadi standar emas perangkat lunak produktivitas di masa depan.

---

## Prioritas Implementasi

| Urutan | Area | Deskripsi Singkat |
| :--- | :--- | :--- |
| **P1** | **UX & Core UI** | Membuat transisi (*feel*) interaksi semulus mentega (60fps) untuk MVP. |
| **P2** | **Data Relasional** | Merancang IndexedDB lokal sebelum beralih memanipulasi file fisik (Markdown parser). |
| **P3** | **Markdown Parser**| Transisi menjadikan `docs/` sebagai Single Source of Truth yang bisa diedit oleh UI. |
| **P4** | **AI Agent** | Penyisipan logika otomatisasi setelah data terstruktur. |

---

## Risiko

- **Korupsi Data (Parse Error):** Membaca dan menulis ulang (`serialize`/`deserialize`) Markdown berpotensi menghapus komentar manual dari pengguna di dalam file markdown tersebut. (Mitigasi: Parser AST yang tangguh / remark/rehype yang melindungi baris tak dikenali).
- **Performa Skala Besar:** Mem-*parsing* ribuan file markdown saat aplikasi pertama dibuka dapat menyebabkan waktu *load* yang tinggi. (Mitigasi: Web Workers & Caching IndexedDB yang hanya me-load *diffs/changes* file system).
- **Scope Creep:** Menjadi "Operating System" membawa godaan untuk membuat semuanya sekaligus. (Mitigasi: Sangat disiplin mengikuti Development Workflow dan Milestone yang terstruktur).

---

## Hal yang Sengaja Ditunda (Out of Scope)
Demi menjaga fokus, pilar-pilar berikut secara eksplisit **DITUNDA** dan tidak akan dieksekusi di 2 tahun pertama:
- Aplikasi Native Mobile (iOS/Android) ➔ Fokus pada PWA dan Desktop (Web-based) terlebih dahulu.
- Plugin Ecosystem / 3rd-Party Extensions ➔ Kita membangun ekosistem inti mandiri sebelum membukanya ke publik (Mencegah arsitektur menjadi *spaghetti code* akibat API publik terlalu dini).
- Backend / Database Tradisional (PostgreSQL / MongoDB) ➔ Mengorbankan prinsip Local-First / *Markdown-First* secara total sangat dilarang. LifeFlow akan selalu mempertahankan kepemilikan data lokal.
