# 🤖 LifeFlow AI Development System

Selamat datang di pusat kendali **AI Development System** untuk Project LifeFlow. 

Repositori ini tidak hanya dibangun *untuk* pengguna akhir, melainkan **dibangun bersama sekumpulan agen Kecerdasan Buatan (AI)** yang berkolaborasi sebagai satu tim engineering profesional. Sistem ini dirancang secara **Provider Agnostic**, yang berarti proyek ini tidak bergantung pada model AI dari satu perusahaan tertentu. Model apa pun (OpenAI, Anthropic, Google, DeepSeek, Qwen, WebLLM, dll.) dapat masuk ke dalam sistem ini selama mereka mengikuti peran, konteks, dan aturan yang ditetapkan.

## Tujuan Sistem
1. **Konsistensi Multi-Model**: Memastikan bahwa 20+ model AI yang berbeda dapat bekerja pada *codebase* yang sama tanpa menghasilkan gaya kode (coding style) yang bertabrakan.
2. **Provider Agnostic**: Menghindari *vendor lock-in*. AI dievaluasi berdasarkan kapabilitas (misal: "Kemampuan Penalaran Arsitektur"), bukan nama produk.
3. **Standarisasi Konteks**: Memastikan setiap AI memahami `MASTER_SOURCE_OF_TRUTH.md` dan konvensi proyek sebelum menulis satu baris kode pun.
4. **Alur Kerja Terstruktur**: Menerapkan hierarki (PM ➔ Architect ➔ FE ➔ QA) dalam pendelegasian tugas AI.

## Struktur Direktori `docs/ai/`

Sistem ini didokumentasikan ke dalam file-file spesifik yang wajib dipatuhi:

| Dokumen | Fungsi |
| :--- | :--- |
| `README.md` | Halaman utama (dokumen ini). |
| `AI_ROLES.md` | Definisi peran (PM, Architect, FE, QA, dll.) beserta tanggung jawabnya. |
| `AI_WORKFLOW.md` | Alur kerja dari ide mentah hingga kode di-*merge*. |
| `CONTEXT_SYSTEM.md` | Standar *System Prompt* / Manajemen Konteks agar AI tidak berhalusinasi. |
| `PROMPT_TEMPLATE.md` | Daftar *template prompt* standar yang wajib digunakan oleh manusia/AI supervisor saat memerintah agen AI. |
| `MODEL_MAPPING.md` | Panduan merutekan tugas ke model LLM yang tepat berdasarkan kapabilitas. |
| `RULES.md` | Konstitusi pengembangan mutlak yang tidak boleh dilanggar agen AI. |
| `BEST_PRACTICES.md` | Panduan interaksi, *debugging*, dan *refactoring* menggunakan AI. |
| `DECISION_LOG.md` | Repositori format log keputusan arsitektural yang diambil oleh tim (termasuk AI). |

## Filosofi Dasar

> **"Konteks adalah Raja. Tanpa konteks yang diatur ketat, AI terpandai sekalipun hanya akan merusak arsitektur."**

Setiap kali Anda membawa model AI baru ke dalam Project LifeFlow, mulailah dengan membaca dan menginjeksi dokumen dari direktori ini. Jangan pernah meminta AI untuk "membuat fitur" tanpa memberikan spesifikasi *Role* dan *Context System*.
