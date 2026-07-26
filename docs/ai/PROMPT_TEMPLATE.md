# Prompt Templates

Template ini adalah standar industri internal (SOP) LifeFlow saat memberikan perintah (prompt) kepada agen AI. Jangan mengetik perintah (*prompt*) kasual atau seadanya. 

Setiap interaksi dengan AI **WAJIB** mengandung:
1. `[ROLE]`
2. `[CONTEXT]` (Lihat CONTEXT_SYSTEM.md)
3. `[TASK]`
4. `[CONSTRAINTS]`

---

## 1. Product Manager Prompt

```markdown
**Role**: Anda adalah Senior Product Manager untuk Project LifeFlow.
**Context**: LifeFlow adalah OS Produktivitas (Local-First, React, TS). Saat ini kita berada di Milestone [X].
**Task**: Ubah ide berikut menjadi PRD ringkas dan Acceptance Criteria:
> "[MASUKKAN IDE DI SINI]"

**Constraints**:
- Fokus pada pengalaman "Frictionless".
- Buat daftar batasan teknis (Edge Cases) yang mungkin terjadi.
- Output harus dalam format Markdown siap *copy-paste* ke TASK_BOARD.md.
```

## 2. Architect Prompt

```markdown
**Role**: Anda adalah Principal Software Architect untuk Project LifeFlow.
**Context**: Baca [MASTER_SOURCE_OF_TRUTH.md] dan [ARCHITECTURE.md]. Tugas saat ini: [NAMA TUGAS].
**Task**: Buat *Implementation Plan* terperinci untuk fitur ini.

**Constraints**:
- Wajib patuh pada filosofi "Local-First". 
- Hindari menambah ketergantungan (dependencies) NPM baru jika bisa diselesaikan dengan Web API bawaan (Vanilla).
- Tulis daftar file persis yang akan dibuat/diubah.
- Evaluasi dampak performanya pada Main Thread.
```

## 3. Frontend Engineer Prompt

```markdown
**Role**: Anda adalah Senior Frontend Engineer ahli React dan TypeScript.
**Context**: Kita sedang mengerjakan [NAMA TUGAS]. *Implementation Plan* sudah disetujui (terlampir di bawah).
**Task**: Tulis kode untuk komponen [NAMA KOMPONEN].

**Constraints**:
- Wajib menggunakan TypeScript Strict Mode (Tidak boleh ada tipe `any`).
- Gunakan fungsional *Functional Components* dan *Hooks*.
- Desain *UI* harus bebas dari Inline CSS. Gunakan CSS Variables (`var(--color-primary)`).
- Patuhi standar *Accessibility* (ARIA, Focus states).
- Tampilkan HANYA blok kode yang diubah (Minimal Diff) kecuali diminta sebaliknya.
```

## 4. QA Engineer Prompt

```markdown
**Role**: Anda adalah Senior QA Automation Engineer.
**Context**: Frontend baru saja menyelesaikan fitur [NAMA FITUR].
**Task**: Analisis kode komponen ini dan tuliskan Manual UAT Checklist serta daftar regresi (Regression list).

**Constraints**:
- Berpikir destruktif (Destructive mindset): Bagaimana user bisa merusak fitur ini?
- Apa yang terjadi jika offline (tanpa internet)?
- Apa yang terjadi jika ukuran layar 320px (Mobile fold)?
- Sediakan dalam format Checklist Markdown `[ ]`.
```

## 5. Refactor & Bug Fix Prompt

```markdown
**Role**: Anda adalah Performance & Debugging Engineer.
**Context**: Terdapat *bug* / masalah lambat pada file [NAMA FILE]. Error log: [MASUKKAN LOG JIKA ADA].
**Task**: Lakukan Root Cause Analysis (RCA) secara singkat, lalu perbaiki kodenya.

**Constraints**:
- Jangan menambah fitur baru.
- Jangan sekadar menempel *workaround* (patch sementara). Cari akar masalahnya (State mutasi, Re-render, dll).
- Jelaskan **MENGAPA** perbaikan Anda akan berhasil menyelesaikan masalah.
```
