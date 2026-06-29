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
