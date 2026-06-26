---
id: WKF-001
type: Collaboration Workflow
parent: docs/project/DEVELOPMENT_WORKFLOW.md
child: None
reference: docs/product/CORE_PRODUCT_PRINCIPLES.md, docs/project/TASK_BOARD.md
---

# Human-AI Documentation Workflow

Jika `DEVELOPMENT_WORKFLOW.md` mengatur tahap (SOP) pengerjaan kode/software, maka dokumen `WORKFLOW.md` ini secara spesifik mendefinisikan *bagaimana Manusia, AI, dan Dokumentasi berkolaborasi memproses informasi di ekosistem LifeFlow*.

Seluruh fase harus memastikan bahwa: (1) Manusia memegang kemudi keputusan, (2) Dokumentasi menjadi *Source of Truth*, dan (3) AI bertindak sebagai akselerator dan integrator.

---

## The Collaboration Pipeline

### 1. Idea ➔ Research
- **Input:** Ide kasar masuk ke dalam `IDEAS.md`.
- **Output:** Validasi teknis/riset kelayakan awal.
- **Human Role:** Menuangkan ide murni, tujuan, dan ekspektasi *benefit* (kontekstualisasi empati).
- **AI Role:** Menyediakan kajian *Research Ideas*, menimbang komputasi komparatif (*Complexity vs Impact*), atau menarik data referensi struktur (*best practices*).
- **Required Documents:** `IDEAS.md`, *External Sources/Articles*.

### 2. Research ➔ Discussion ➔ PRD
- **Input:** Ide dengan status "APPROVED".
- **Output:** Draft `PRD.md` dan pembaruan `FUTURE_PRODUCT_VISION.md`.
- **Human Role:** Mendefinisikan visi strategis (Goals, Target Persona) dan batasan mutlak (Out of Scope).
- **AI Role:** Mengidentifikasi celah asumsi (Assumptions) dan risiko (Risks) yang luput dari pandangan manusia, menyelaraskan dengan *Core Principles*.
- **Required Documents:** `PRD.md`, `CORE_PRODUCT_PRINCIPLES.md`.

### 3. PRD ➔ Requirements ➔ UX
- **Input:** `PRD.md` lengkap.
- **Output:** Dokumen `REQUIREMENTS.md` detail dan Wireframes/User Flows.
- **Human Role:** Mengambil keputusan UX (*Calm & Minimal UX*).
- **AI Role:** Menerjemahkan Use Case (dari PRD) menjadi deretan Functional Requirements tekstual. Mengekstrak struktur data UI/UX ke dalam file markdown.
- **Required Documents:** `REQUIREMENTS.md`, `USER_FLOWS.md`, `DESIGN_SYSTEM.md`.

### 4. Architecture ➔ Task Breakdown
- **Input:** Requirements matang.
- **Output:** Registrasi rilis modul di `MODULES.md` dan delegasi ke `TASK_BOARD.md`.
- **Human Role:** Membagi modul besar menjadi iterasi mingguan.
- **AI Role:** (Invisible AI) Menganalisis *Requirements* dan secara otomatis mem-breakdown ke dalam list tugas `[TASK-XXX]` beserta persentase *Dependencies*-nya.
- **Required Documents:** `MODULES.md`, `TASK_BOARD.md`.

### 5. Coding ➔ QA ➔ UAT
- **Input:** Tugas dari `TASK_BOARD.md`.
- **Output:** Kode aplikasi, *Build success*, dan tanda `PASS` di Checklist Testing.
- **Human Role:** Meninjau algoritma kompleks, mengeksekusi tes *User Acceptance Testing* manual.
- **AI Role:** Menuliskan *boilerplate code*, mendeteksi bug sintaks selama "Self Review", dan men-*generate* checklist UAT berdasarkan Requirements.
- **Required Documents:** Source Code, `UAT_CHECKLIST_PHASE*.md`, `PROJECT_STATE.md`.

### 6. Release ➔ Maintenance
- **Input:** UAT `PASS`.
- **Output:** Rilis produksi, status modul menjadi `DONE`.
- **Human Role:** Persetujuan akhir rilis (*Approval*), me-review laporan performa jangka panjang.
- **AI Role:** Mencatat *Session Log* atau *Changelog* secara otomatis dari komit, melakukan *Auto-Triage* pada `BUG_REPORT.md` jika ada laporan masuk.
- **Required Documents:** `RELEASES.md`, `SESSION_LOG.md`, `BUG_REPORT.md`.

---

## Aturan Kolaborasi (Knowledge Graph Sync)
Setiap kali entitas mana pun (Manusia atau AI) memodifikasi dokumen:
1. Perubahan **TIDAK BOLEH** melanggar batas yang didefinisikan dalam parent document (cth: Perubahan `Requirements` tidak boleh membantah `PRD`).
2. Entitas AI wajib menyertakan relasi referensi ke bagian atas (*Frontmatter*) dokumen baru untuk mempertahankan topologi *Knowledge Graph*.
