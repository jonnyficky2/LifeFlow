---
id: POL-001
type: Governance
parent: docs/product/CORE_PRODUCT_PRINCIPLES.md
child: None
reference: None
---

# Documentation Policy (Freeze v1.0)

**“Dokumentasi harus membantu pengembangan, bukan menjadi beban.”**

Aturan ini mengikat seluruh pengembang (Manusia) dan AI Agent di LifeFlow terkait kapan dan bagaimana dokumentasi boleh disentuh. Mulai iterasi **Documentation Freeze v1.0**, proyek beralih dari fase ideasi massal menuju implementasi fitur teknis murni.

## 1. Tujuan Dokumentasi
- Menjaga *Knowledge Graph* agar AI dan anggota tim baru dapat *onboarding* secara mandiri.
- Mengunci arsitektur agar tidak berubah-ubah di tengah Sprint.

## 2. Kapan Membuat Dokumen Baru
- **Jangan membuat dokumen baru** kecuali benar-benar diwajibkan oleh penambahan Milestone mayor (di luar M1-M8).
- Jika informasi bisa diselipkan ke dalam dokumen yang sudah ada (misal, menambah ide ke `IDEAS.md`), jangan pisahkan menjadi file mandiri.

## 3. Kapan Memperbarui Dokumen Lama
- Perbarui `TASK_BOARD.md` **setiap ada perubahan status** (dari IN_PROGRESS ke TESTING, dst).
- Perbarui `SESSION_LOG.md` di akhir percakapan atau jam kerja.
- Perbarui `MODULES.md` hanya saat sebuah modul secara resmi lolos UAT.

## 4. Kapan Menghapus Dokumen
- Jika ada *Redundancy* yang tercatat pada `DOCUMENT_CONFLICTS.md` dan disetujui.
- Dokumen dilarang dihapus tanpa persetujuan eksplisit dari *Project Owner*. Gunakan status `ARCHIVED` jika ragu.

## 5. Aturan Penamaan File & Struktur
- Format file: **Selalu gunakan `UPPERCASE_SNAKE_CASE.md`** untuk dokumen strategis agar menonjol.
- Harus tersimpan rapi sesuai hierarki: `/product/`, `/project/`, `/design/`, `/testing/`. Jangan simpan langsung di *root* `docs/` kecuali `README.md`.

## 6. Deprecated Document Policy
- Dokumen yang usang tidak langsung dihapus. Tambahkan meta tag `status: DEPRECATED` pada *Frontmatter* dan pindahkan penjelasan relevannya ke dokumen aktif yang ditunjuk.

## 7. Knowledge Graph & Cross Reference Rules
- **Wajib Frontmatter**: Setiap dokumen harus dibuka dengan blok YAML yang memuat `id`, `type`, `parent`, `child`, dan `reference`. 
- Hal ini agar AI/Parser kelak dapat menyusun diagram relasional secara otomatis.

## 8. Review Process & Owner Approval Rules
- **Ubah Konstitusi**: Mengubah `CORE_PRODUCT_PRINCIPLES.md` atau `FUTURE_PRODUCT_VISION.md` butuh `Owner Approval` tingkat 1 (Lisan/Tertulis langsung oleh Manusia). AI tidak boleh secara sepihak menyimpulkan perubahannya.
- **Ubah SOP**: Mengubah SOP di `DEVELOPMENT_WORKFLOW.md` juga membutuhkan *approval* eksplisit.

## 9. Definition of Complete Documentation
Sebuah dokumentasi fitur dikatakan lengkap (*Complete*) jika:
1. Memiliki tautan referensi silang (graf).
2. Sesuai dengan spesifikasi PRD.
3. Menjawab pertanyaan teknis tanpa memerlukan tebakan asumsi dari pengembang.
