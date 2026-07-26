# 📑 LifeFlow Source of Truth - Audit Report v1.1

## 1. Executive Audit Summary

Laporan ini merupakan hasil audit profesional terhadap arsitektur, produk, dan desain dari LifeFlow Master Source of Truth. Tujuannya adalah memastikan dokumen ini siap menjadi acuan utama pengembangan untuk 5-10 tahun ke depan tanpa *technical debt* yang fatal.

### Penilaian Keseluruhan (Skor 1-10)

| Kategori | Skor | Alasan & Analisis |
| :--- | :---: | :--- |
| **Architecture** | 8.5/10 | Pendekatan *Local-First* sangat visioner. Namun, transisi dari `localStorage` ke File System/Markdown Parser berisiko tinggi jika tidak ada lapisan abstraksi data yang kuat (Repository Pattern). |
| **UX** | 9/10 | Prinsip *Frictionless* dan *Zero-latency* (Inline Input, Omnibar) sangat kuat. Sedikit terancam oleh kompleksitas dari "Widget Builder". |
| **Scalability** | 8/10 | Arsitektur modular bagus, namun sinkronisasi P2P (CRDT) dan Widget Marketplace dapat membebani *bundle size* secara eksponensial. |
| **Maintainability** | 9/10 | Standar kode ketat (TypeScript, larangan Tailwind untuk independensi UI) sangat mendukung *long-term maintenance*. |
| **Performance** | 7.5/10 | Ada risiko *UI Blocking* yang serius ketika mengimplementasikan AI (Local LLM) dan Markdown Parser di atas *main thread*. |
| **Documentation** | 9/10 | Struktur dokumen *Source of Truth* rapi dan komprehensif. Perlu penyatuan terminologi. |
| **Consistency** | 8/10 | Ditemukan beberapa istilah yang tumpang tindih (Schedule vs Calendar, Plugin vs Module). |
| **Widget System** | 8.5/10 | Konsepnya brilian sebagai *Flagship Feature*, tetapi *Widget Engine* + *Drag & Drop* berisiko membuat aplikasi terasa berat jika tidak divirtualisasi (*Virtual DOM Rendering*). |
| **AI Architecture** | 7/10 | Penggunaan "Ollama" sebagai *local model* kurang realistis untuk aplikasi berbasis peramban (PWA). PWA tidak bisa mengakses Ollama secara native tanpa *setup* pengguna. Pendekatan **WebGPU / WebLLM** lebih tepat untuk eksekusi AI langsung di peramban. |
| **Roadmap** | 8/10 | Urutan logis, namun *Markdown-Parser* harus dikerjakan SEBELUM *AI Workspace* karena AI butuh sumber data yang stabil untuk di-kueri. |
| **Testing** | 7.5/10 | Mengandalkan *Manual UAT* terlalu berisiko untuk *Operating System* sekelas LifeFlow. Perlu ditambah *Automated E2E Testing* (Playwright/Cypress) untuk alur kritis (CRUD Task). |
| **Security** | 8/10 | *Local-First* secara inheren aman, namun rentan terhadap serangan XSS jika kita mengizinkan ekstensi/plugin pihak ketiga (CSP harus sangat ketat). |

---

## 2. Daftar Masalah

### 🔴 Critical
1. **Eksekusi AI Lokal di PWA**: Ollama membutuhkan instalasi *binary* di OS host. Ini melanggar pengalaman *seamless* PWA. 
   - **Solusi**: Gunakan **WebLLM** (via WebGPU) untuk menjalankan model kecil (misal: Llama-3-8B atau Qwen-1.5B) langsung di dalam peramban, atau gunakan mekanisme *API Key Endpoint* pribadi (*Bring Your Own Key*).
2. **Main Thread Blocking**: Melakukan *parsing* ribuan file Markdown dan mengeksekusi model AI akan membekukan antarmuka (UI Jank).
   - **Solusi**: Wajib menggunakan **Web Workers** untuk seluruh operasi *Parser* dan *AI Inference*.

### 🟠 High
1. **Transisi Database**: Pindah dari `localStorage` (Key-Value) langsung ke File System (Markdown) tanpa perantara akan merusak arsitektur `Context API`.
   - **Solusi**: Gunakan **IndexedDB (Dexie.js)** atau **SQLite WASM** sebagai lapisan *Cache/In-Memory Database*. File System hanya bertindak sebagai cadangan fisik (Physical Backup/Sync).
2. **Risiko XSS dari Plugin/Widget**: Jika Widget bisa dibuat pihak ketiga, mereka bisa mencuri data lokal pengguna.
   - **Solusi**: Terapkan *Strict Content Security Policy (CSP)* dan gunakan *Iframe Sandboxing* untuk *Widget/Plugin Renderer*.

### 🟡 Medium
1. **Kompleksitas Widget Builder**: Mendukung fitur seperti *Free-form Drag & Drop* dengan *Snap Grid* sangat rumit di web.
   - **Solusi**: Batasi menjadi *Strict Grid Layout* (seperti iOS Widgets: 1x1, 2x1, 2x2) untuk mempermudah render.
2. **Duplikasi Omnibar vs AI Workspace**: Cmd+K (Omnibar) dan jendela AI bisa tumpang tindih secara fungsionalitas.
   - **Solusi**: Gabungkan! Cmd+K bertindak sebagai *router*—jika input adalah perintah navigasi, lakukan secara statis. Jika input adalah pertanyaan, rutekan ke AI.

### 🟢 Low
1. **Kurangnya Automated E2E**: *Manual UAT* bagus, tapi melelahkan.
   - **Solusi**: Masukkan Playwright ke dalam tahapan CI/CD masa depan.

---

## 3. Daftar Inkonsistensi

| Bagian Asal | Konflik | Solusi | Keputusan Final |
| :--- | :--- | :--- | :--- |
| Fitur | Schedule vs Calendar | Fitur penjadwalan dan tanggal berbenturan istilahnya. | Gunakan **Calendar** untuk tampilan tanggal, dan **Time-blocking** untuk jadwal jam. |
| Arsitektur | Plugin vs Module vs Widget | Istilah ekstensi fungsional tidak jelas batasannya. | **Widget**: Visual UI di Dashboard. **Plugin**: Ekstensi *logic/background*. |
| UX | Omnibar vs AI Chat | Antarmuka interaksi AI tumpang tindih dengan pencarian. | **AI Omnibar** (Cmd+K) menjadi satu-satunya portal interaksi (*Unified Input*). |
| Storage | LocalStorage vs OPFS vs SQLite | Rencana migrasi storage berceceran dan tidak runut. | *Roadmap Database*: LocalStorage -> IndexedDB -> OPFS (Markdown). |

---

## 4. Daftar Duplikasi

- **Feature List & Roadmap**: Bagian 12 (Feature List) dan Bagian 44 (Roadmap) memiliki poin-poin yang bisa direferensikan silang untuk menghindari penulisan ulang status. 
- **Widget Section**: Terlalu banyak sub-item yang pada dasarnya adalah "Arsitektur Widget". Dapat digabung menjadi 3 pilar: *Widget Engine (Logic)*, *Widget Builder (UI)*, dan *Widget Renderer (Performance)*.

---

## 5. Daftar Keputusan Baru (New Decisions)

1. **WebGPU AI**: Menghapus ketergantungan pada *Ollama* (karena butuh *desktop app*). Mengadopsi **WebLLM / WebGPU** untuk AI lokal sejati di dalam peramban (PWA).
2. **Unified Omnibar**: Menggabungkan *Command Palette* (navigasi) dan *AI Chat* ke dalam satu komponen bernama **AI Omnibar (Cmd+K)**.
3. **Web Worker Mandate**: Seluruh proses non-UI (AI Inference, CRDT Sync, Markdown Parsing, Export Image) diwajibkan berjalan di **Web Workers**.
4. **Strict Grid for Widgets**: Membatasi *Drag & Drop* widget ke dalam *Strict Grid* (1x1, 2x1, 2x2) untuk menjamin performa responsif, bukan koordinat bebas (*absolute positioning*).

---

## 6. Future Ideas (Dipindahkan dari MVP)

Fitur berikut resmi diklasifikasikan sebagai *Future Ideas* agar tidak merusak MVP:
* *Widget Marketplace* & *Plugin Ecosystem* (Terlalu dini, fokus pada widget bawaan sistem dulu).
* *P2P Workspace via WebRTC* (Sangat rumit secara *networking*).
* *Client-Side E2E Encryption (AES-GCM)* (Bisa mengunci (*lock-out*) pengguna jika mereka lupa sandi di versi awal).
* *Automated E2E Testing Pipeline* (Akan dimasukkan setelah UI stabil secara fundamental).

---

## 7. Missing Decisions

1. **Attachment Storage**: Bagaimana aplikasi menangani file gambar dalam catatan (Notes) agar batas memori *browser* tidak meledak? *(Rekomendasi: Simpan gambar ke Origin Private File System (OPFS) alih-alih Base64 di IndexedDB).*
2. **Sinkronisasi CRDT**: Apakah kita menggunakan Yjs atau Automerge? *(Rekomendasi: Yjs, karena ukurannya lebih kecil dan ekosistemnya (y-indexeddb, y-webrtc) sudah matang).*

---

## 8. Final Recommendation (Principal Architect)

Sebagai *Principal Software Architect*, berikut arahan strategis untuk kelangsungan proyek:

1. **Urutan Pengembangan Terbaik**:
   - **Tahap 1**: Stabilitas Core (Selesai).
   - **Tahap 2**: Migrasi `localStorage` ke `IndexedDB` (Kritis! Lakukan sebelum aplikasi melambat karena JSON yang membengkak).
   - **Tahap 3**: Widget System (Strict Grid).
   - **Tahap 4**: Markdown-First Integration (Membaca file `.md` via OPFS).
   - **Tahap 5**: Integrasi WebLLM (AI Workspace).
   
2. **Technical Debt yang Harus Dihindari**:
   - Mengeksekusi *JSON Serialize/Deserialize* berukuran besar di utas utama (*Main Thread*).
   - *Prop-drilling* dalam sistem Widget. (Gunakan *Context/Zustand* dengan pembatas re-render).
   
3. **Risiko Terbesar Proyek**:
   - **Korupsi Data**: Korupsi pada *IndexedDB* atau tabrakan sinkronisasi saat fitur File System diimplementasikan. Kita butuh lapisan penengah (SQLite WASM/Dexie) yang sangat diuji.
   
4. **Peluang Terbesar Proyek**:
   - **The Anti-Cloud OS**: Mengingat sentimen pengguna terhadap privasi (dan frustrasi terhadap aplikasi SaaS berbayar bulanan), memposisikan LifeFlow sebagai *Operating System* pribadi di mana "File = Database" akan menjadi daya tarik (*Moat*) terkuat di komunitas produktivitas dan *developer*.

---
*(Laporan ini telah diintegrasikan langsung ke `MASTER_SOURCE_OF_TRUTH.md` v1.1).*
