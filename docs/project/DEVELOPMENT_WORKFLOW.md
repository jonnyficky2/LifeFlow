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
