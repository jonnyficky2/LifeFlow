# Model Mapping

Dalam ekosistem AI Development System yang bersifat **Provider Agnostic**, kita tidak memilih model AI karena loyalitas pada merek (brand). Kita merutekan tugas berdasarkan keunggulan kemampuan (*capability*) spesifik sebuah model (Biaya vs Konteks vs Performa Logika).

Gunakan panduan berikut sebagai standar perutean (routing) AI:

## 1. Architecture & Planning
* **Kemampuan yang Dibutuhkan**: Logika sangat tinggi (High-reasoning), mampu menganalisis abstraksi panjang, ketelitian terhadap batasan sistem (constraints).
* **Contoh Model yang Direkomendasikan**: 
  - **OpenAI GPT-4o / o1-preview** (Sangat kuat dalam penarikan kesimpulan logis).
  - **Anthropic Claude 3.5 Sonnet / Opus** (Sangat kuat di pengkodean arsitektur).
* **Waktu Penggunaan**: Saat merancang fitur rumit (seperti *Widget Engine*) atau saat menstruktur basis data (IndexedDB).

## 2. Coding & Frontend Engineering
* **Kemampuan yang Dibutuhkan**: Ahli di sintaks spesifik (TypeScript/React), patuh pada *Design System*, nol halusinasi terhadap *library*.
* **Contoh Model yang Direkomendasikan**:
  - **Claude 3.5 Sonnet** (Saat ini merupakan *gold standard* untuk pengkodean UI React & TypeScript).
  - **DeepSeek Coder V2** (Alternatif *open-weights* dengan harga murah untuk fitur repetitif).
* **Waktu Penggunaan**: Saat menulis komponen `.tsx`, merombak tata letak CSS, atau menyusun *Hooks*.

## 3. Review & Performance Optimization
* **Kemampuan yang Dibutuhkan**: Deteksi celah (*Zero-trust*), analisis komputasi ruang (*memory leak*), pandangan *security*.
* **Contoh Model yang Direkomendasikan**:
  - **OpenAI GPT-4o** (Baik dalam mencari *bug* yang tersembunyi).
  - **Google Gemini 1.5 Pro** (Unggul pada konteks *window* yang sangat panjang, mampu menelan seluruh direktori proyek untuk audit menyeluruh).
* **Waktu Penggunaan**: Saat akan melakukan PR (Pull Request) atau saat FPS aplikasi turun (*jank*).

## 4. Documentation & Tech Writing
* **Kemampuan yang Dibutuhkan**: Penulisan rapi, pemahaman *markdown*, pembuatan tabel dan *Mermaid diagrams*.
* **Contoh Model yang Direkomendasikan**:
  - **Claude 3.5 Sonnet** / **Claude 3 Haiku** (Cepat dan tulisannya natural).
  - **Google Gemini 1.5 Flash** (Murah, sangat cepat memproses blok teks besar menjadi ringkasan).
* **Waktu Penggunaan**: Menulis *Release Notes*, memperbarui dokumen `MODULES.md` atau `MASTER_SOURCE_OF_TRUTH.md`.

## 5. Offline Inference / In-Browser (AI Workspace)
* **Kemampuan yang Dibutuhkan**: Dapat dimuat ke dalam memori RAM pengguna (GPU Lokal), sangat ringan (< 5GB), latensi instan.
* **Contoh Model yang Direkomendasikan**:
  - **Llama 3 (8B)** atau **Qwen 2.5 (1.5B - 7B)** (Dapat dikomputasi secara mandiri tanpa server via WebLLM/WebGPU).
* **Waktu Penggunaan**: Ekstraksi dari teks harian pengguna ke dalam format tugas (Tasks), fitur asisten dalam-aplikasi (*Invisible AI*).

---

## Aturan Pertukaran (Hot-Swapping Rule)

Kapan pun Anda harus berganti dari Model A ke Model B (misal, OpenAI ke Claude), Anda **wajib** melakukan *Inject Context* (Kirim ulang System Prompt dari [CONTEXT_SYSTEM.md](./CONTEXT_SYSTEM.md)) agar Model B memiliki dasar pemahaman yang setara dengan Model A. Jangan menganggap model baru memiliki ingatan model lama.
