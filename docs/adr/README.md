# Architecture Decision Records (ADR)

Dokumen ini mendefinisikan sistem **Architecture Decision Record (ADR)** untuk proyek LifeFlow. ADR digunakan untuk mendokumentasikan keputusan arsitektur dan pilihan desain penting agar proyek tetap konsisten dan terarah secara jangka panjang, terutama saat dikerjakan oleh beberapa pengembang (baik pengembang manusia maupun agen AI).

---

## Apa itu ADR?

ADR adalah rekaman dokumen singkat yang memuat keputusan arsitektur penting yang diambil beserta konteks, masalah, dan konsekuensi di baliknya. Sistem ini membantu melacak riwayat evolusi desain teknis proyek dari waktu ke waktu.

## Kapan ADR Harus Dibuat?

ADR **wajib dibuat** untuk keputusan arsitektur atau keputusan desain yang bersifat strategis dan jangka panjang.
ADR **tidak boleh dibuat** untuk perbaikan bug kecil atau perubahan visual/CSS minor.

### Contoh Keputusan yang WAJIB Memiliki ADR:
- Pemilihan React Context dibanding Redux
- Pemilihan LocalStorage dibanding IndexedDB
- Arsitektur Undo/Redo
- Struktur Folder Project
- Design System
- Routing
- State Management
- Autosave Notes
- AI Integration
- Offline Strategy
- Sync Strategy
- Authentication Strategy

## Format Penamaan ADR

Tiap file keputusan disimpan di direktori `docs/adr/` menggunakan format penamaan berikut:
```text
ADR-XXX-judul.md
```
- `XXX` adalah nomor tiga digit yang berurutan (mulai dari `001`, `002`, dst.).
- `judul` menggunakan huruf kecil dipisah dengan tanda minus (kebab-case).

Contoh:
- `ADR-001-react-context-state-management.md`
- `ADR-002-localstorage-strategy.md`

## Daftar Status ADR

Setiap ADR memiliki salah satu status berikut:
1. **PROPOSED**: Keputusan baru yang sedang diusulkan dan menunggu persetujuan (review).
2. **ACCEPTED**: Keputusan yang telah disetujui dan diterapkan dalam codebase aktif.
3. **SUPERSEDED**: Keputusan lama yang digantikan oleh ADR baru (referensi ke ADR baru wajib dicantumkan).
4. **DEPRECATED**: Keputusan lama yang ditinggalkan dan tidak lagi relevan atau tidak digunakan lagi.

---

## Cara Membuat ADR Baru

1. Buat file baru di dalam folder `docs/adr/` dengan nama berformat `ADR-XXX-judul-keputusan.md`. Pastikan nomor `XXX` berurutan dari nomor terakhir.
2. Salin template standar di bawah ini.
3. Tuliskan konteks, alternatif solusi, dan konsekuensi teknis secara objektif.
4. Set status awal menjadi `PROPOSED` atau langsung `ACCEPTED` setelah disepakati dengan User.

---

## Template ADR Standar

Gunakan template Markdown berikut untuk setiap file ADR baru:

```markdown
# ADR-XXX — Judul Keputusan

## Status

(PROPOSED / ACCEPTED / SUPERSEDED / DEPRECATED)

## Date

YYYY-MM-DD

## Context

Mengapa keputusan ini diperlukan.

## Problem

Masalah yang ingin diselesaikan.

## Decision

Keputusan yang diambil.

## Alternatives Considered

Alternatif lain yang dipertimbangkan beserta alasan tidak dipilih.

## Consequences

Konsekuensi positif.

Konsekuensi negatif.

Trade-off.

## Related Files

Daftar file yang berkaitan.

## Notes

Catatan tambahan bila diperlukan.
```
