# Development Workflow

Dokumen ini mendefinisikan *Standard Operating Procedure* (SOP) untuk pengembangan setiap fitur, modul, maupun perbaikan bug di aplikasi LifeFlow. Workflow ini bersifat mengikat dan wajib diikuti untuk memastikan rilis berkualitas dan mudah ditelusuri.

## The Workflow Pipeline

Setiap tiket pekerjaan atau inisiatif harus menempuh jalur berikut dari konsep hingga kode digabungkan:

1. **Idea**
   *Tahap konseptualisasi awal.*
   ⬇
2. **PRD (Product Requirements Document)**
   *Spesifikasi apa yang akan dibuat dan nilai bisnis/penggunanya.*
   ⬇
3. **Requirements**
   *Penjabaran detail teknis dan fungsional.*
   ⬇
4. **Design**
   *Pembuatan wireframe, mockup UI, dan UX flow.*
   ⬇
5. **Implementation Plan**
   *Perencanaan arsitektur, pemilihan file yang diubah, dan identifikasi potensi blocker.*
   ⬇
6. **Coding**
   *Fase pengembangan aktif (pemrograman/migrasi).*
   ⬇
7. **Self Review**
   *Tinjauan statis oleh developer untuk kebersihan kode dan potensi bug.*
   ⬇
8. **Functional QA**
   *Verifikasi otomatis atau pengujian fungsional dasar di lingkungan pengembangan lokal (Build check).*
   ⬇
9. **User Acceptance Testing (UAT)**
   *Pengujian manual berdasarkan UAT Checklist yang mengkonfirmasi penyelesaian sesuai standar pengguna.*
   ⬇
10. **Regression Testing**
   *Verifikasi bahwa fitur baru tidak merusak sistem atau modul yang sudah `DONE` sebelumnya.*
   ⬇
11. **Approval**
   *Persetujuan akhir kelulusan.*
   ⬇
12. **DONE**
   *Status modul berubah menjadi selesai secara fungsional dan operasional.*
   ⬇
13. **Git Commit**
   *Rekaman perubahan ke sistem version control.*
   ⬇
14. **Push Repository**
   *Penyelarasan kode ke repositori utama.*
   ⬇
15. **Next Task**
   *Pekerjaan dilanjutkan ke item berikutnya pada `TASK_BOARD.md`.*

---

**Aturan Emas:** *Jangan pernah melompati QA dan UAT dengan menganggap bahwa "Build Success" sama dengan fitur selesai (Feature Complete).*

---

## Scope Protection Rules

* Dilarang mengubah file di luar scope TASK yang sedang dikerjakan.
* Jika perubahan pada file lain benar-benar diperlukan, wajib dijelaskan pada Planning Mode beserta alasannya sebelum implementasi dimulai.
* Jangan melakukan refactor, cleanup, rename, atau optimisasi di luar Acceptance Criteria TASK aktif.
* Jangan memperbaiki bug yang tidak termasuk dalam scope TASK tanpa persetujuan User.
* Gunakan prinsip Minimal Diff, yaitu hanya mengubah kode yang benar-benar diperlukan untuk menyelesaikan TASK.

## Regression Prevention Checklist

Sebelum implementasi dinyatakan selesai dan status diubah menjadi TESTING, pastikan:

* Build tetap PASS.
* TypeScript tetap PASS.
* Tidak ada console error baru.
* Tidak ada perubahan visual pada halaman lain di luar scope.
* Tidak ada perubahan UX di luar Acceptance Criteria.
* Semua perubahan hanya berada pada file yang telah dijelaskan saat Planning Mode.

## Task Completion Discipline

* Kerjakan hanya SATU TASK sampai selesai sebelum memulai TASK berikutnya.
* Jangan menggabungkan implementasi beberapa TASK dalam satu commit.
* Setelah implementasi selesai:
    1. Ubah status TASK menjadi TESTING.
    2. Berikan Manual UAT Checklist kepada User.
    3. Tunggu hasil Manual UAT dari User.
    4. Jika UAT PASS, baru ubah status menjadi DONE.
    5. Update SESSION_LOG.md.
    6. Lakukan commit dan push.

## Planning Mode Requirements

Sebelum implementasi dimulai, Planning Mode wajib menjelaskan:

* Ringkasan perubahan yang akan dilakukan.
* Daftar file yang diperkirakan berubah.
* Risiko perubahan terhadap modul lain.
* Dependency terhadap TASK lain (jika ada).
* Perkiraan dampak terhadap UI, UX, dan performa.

Implementasi hanya boleh dimulai setelah User memberikan persetujuan (Proceed).

## Root Cause Analysis Rules

Sebelum memperbaiki bug, lakukan analisis penyebab utama (Root Cause Analysis).

Jangan langsung membuat workaround atau patch sementara.

Setiap bug wajib dijelaskan:

* Root Cause
* Mengapa bug terjadi
* Mengapa solusi yang dipilih menyelesaikan akar masalah
* Risiko regresi setelah perbaikan

Jika solusi hanya bersifat workaround, wajib diberi label sebagai workaround dan dijelaskan alasannya.

## Code Quality Rules

Setiap implementasi harus mengikuti prinsip berikut:

* Jangan membuat duplicate logic.
* Gunakan komponen, helper, hook, atau utility yang sudah ada bila memungkinkan.
* Jangan menambahkan dependency baru tanpa persetujuan User.
* Hindari inline styles kecuali benar-benar diperlukan.
* Jangan membuat CSS yang bertabrakan dengan Design System.
* Semua kode baru harus mengikuti struktur proyek yang sudah ada.
* Jika terdapat beberapa solusi, pilih solusi yang paling sederhana, mudah dipelihara, dan paling kecil risiko regresinya.

## Architecture Decision Rules

- ADR dibuat hanya untuk keputusan arsitektur atau keputusan desain yang bersifat jangka panjang.
- Jangan membuat ADR untuk bug fix kecil.
- Jangan membuat ADR untuk perubahan CSS minor.
- ADR wajib dibuat sebelum implementasi jika perubahan dapat mempengaruhi struktur proyek.
- Nomor ADR harus berurutan dan tidak boleh diubah.
- Jika suatu keputusan berubah, jangan edit ADR lama. Buat ADR baru lalu ubah status ADR lama menjadi SUPERSEDED.
- Seluruh keputusan besar harus memiliki referensi ADR pada TASK_BOARD.md atau SESSION_LOG.md bila relevan.

# Legacy Migration Policy (Single Source of Truth)

## Purpose
LifeFlow React + TypeScript adalah proyek migrasi dari LifeFlow JavaScript (Legacy), bukan proyek baru.

## Single Source of Truth
Project JavaScript Legacy merupakan acuan utama (Single Source of Truth) untuk:

- Feature
- Business Logic
- Workflow
- Navigation
- UI Behavior
- UX Flow
- Settings
- Authentication
- User Preferences
- Data Structure

## Feature Parity Rule

Target akhir migrasi adalah Feature Parity.

Artinya seluruh fitur yang terdapat pada project JavaScript harus tersedia kembali pada project React + TypeScript, kecuali User secara eksplisit memutuskan untuk menghapus fitur tersebut.

React + TypeScript boleh melakukan:

- Refactor
- UI Improvement
- Performance Improvement
- Accessibility Improvement
- Code Cleanup
- Architecture Improvement

Namun tidak boleh:

- Menghilangkan fitur legacy
- Menghilangkan halaman
- Mengubah alur kerja utama
- Mengubah business logic
- Menghapus menu navigasi

tanpa persetujuan User.

## Missing Legacy Features

Jika ditemukan fitur pada project JavaScript yang belum ada pada project React + TypeScript, AI WAJIB:

1. Tidak menganggap fitur tersebut sudah tidak diperlukan.
2. Menambahkan fitur tersebut ke TASK_BOARD.md sebagai BACKLOG atau TODO.
3. Menjelaskan dependency sebelum implementasi.
4. Menunggu persetujuan User sebelum memulai implementasi.

## Planning Rule

Sebelum membuat milestone baru, AI harus membandingkan React dengan Legacy untuk memastikan seluruh modul telah dimigrasikan.

Jika ditemukan perbedaan, AI harus melaporkannya terlebih dahulu.

## Completion Rule

Project tidak boleh dinyatakan Release Complete hanya karena seluruh TASK_BOARD selesai.

Sebelum Release Final, AI wajib melakukan Legacy Feature Audit untuk memastikan seluruh fitur JavaScript telah dimigrasikan.

## Documentation Rule

Apabila ditemukan modul baru pada Legacy yang belum terdokumentasi, AI harus:

- membuat TASK baru,
- memperbarui TASK_BOARD,
- memperbarui MODULES,
- memperbarui ADR bila diperlukan,

sehingga dokumentasi tetap menjadi Single Source of Truth.

# Native Browser Dialog Policy

Dilarang menggunakan:

- alert()
- prompt()
- confirm()

untuk seluruh fitur aplikasi.

Semua interaksi pengguna wajib menggunakan komponen React internal (Modal, Dialog, Toast, Inline Form) agar konsisten dengan Design System, Dark Mode, Accessibility, dan UX aplikasi.

# Implementation Quality Rules

## Small Increment Rule
Setiap task hanya boleh mengerjakan satu fitur sesuai scope.
Dilarang menggabungkan beberapa fitur besar dalam satu implementasi.

## File Scope Rule
Sebelum implementasi, tampilkan daftar file yang diperkirakan akan berubah.
Setelah implementasi selesai, tampilkan kembali daftar file yang benar-benar berubah.

## Build Verification Rule
Sebelum status berubah menjadi TESTING, wajib menjalankan:
* `npm run build`
* `npm run lint`

Jika salah satu gagal, task tidak boleh dipindahkan ke TESTING.

## Regression Rule
Setelah implementasi selesai, lakukan self-review terhadap fitur lain yang berpotensi terdampak.
Sebutkan kemungkinan regression.
Jika ada risiko, tampilkan daftar Manual UAT tambahan.

## Documentation Rule
Jika implementasi mengubah:
* Architecture
* Workflow
* Data Model
* Folder Structure
* Public API

maka dokumentasi terkait wajib diperbarui sebelum task dianggap selesai.

## Completion Rule
Task baru boleh berubah menjadi DONE hanya setelah:
* Build PASS
* Lint PASS
* Manual UAT PASS
* User menyatakan PASS