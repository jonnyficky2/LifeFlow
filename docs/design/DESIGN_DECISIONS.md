# Design Decisions & Architectural Philosophy

Dokumen ini mendokumentasikan keputusan desain fundamental (Design Decisions) yang diambil dalam proyek LifeFlow. Setiap keputusan di bawah ini mengikat seluruh implementasi visual, arsitektur frontend, dan pengalaman pengguna (UX).

---

## 1. Filosofi Produk & Arah Desain

LifeFlow dirancang sebagai *Personal Operating System* yang memprioritaskan privasi penuh, kecepatan respons, dan kesederhanaan operasional. Tiga pilar utama kami adalah:
* **Zero Latency**: Aplikasi harus merespons interaksi pengguna secara instan tanpa menunggu sinkronisasi jaringan.
* **Aesthetic Minimalism**: Antarmuka bersih, gelap secara default, bernuansa premium, dan memiliki hierarki informasi yang sangat kuat.
* **Frictionless Action**: Pengguna dapat menyelesaikan tugas/mencatat ide dengan jumlah klik sesikit mungkin.

---

## 2. Keputusan Desain Utama (Core Design Decisions)

### A. Local-First & LocalStorage Storage Model
* **Keputusan**: Semua data pengguna (tasks, habits, notes, settings) disimpan secara lokal di peramban menggunakan `window.localStorage` (danIndexedDB di masa depan).
* **Alasan UX**: Menjamin aplikasi tetap berfungsi penuh 100% secara luring (offline) tanpa dependensi server eksternal, dan memberikan rasa aman tinggi kepada pengguna karena data personal mereka tidak meninggalkan perangkat lokal.

### B. Markdown-First Notes Editor
* **Keputusan**: Modul catatan (Notes) menyimpan data dalam format Markdown murni.
* **Alasan UX**: Menjamin portabilitas data jangka panjang (5-10 tahun). Data teks dalam format Markdown tidak akan usang atau terkunci oleh framework (no vendor lock-in).

### C. Single Source of Truth CSS Variable Bridge
* **Keputusan**: Seluruh variabel warna tema gelap & terang serta design tokens dikonsolidasikan ke dalam `variables.css`. Kode CSS legacy dipetakan (aliased) ke token ini alih-alih diubah satu per satu.
* **Alasan Arsitektur**: Meminimalkan risiko regresi tata letak visual saat melakukan migrasi dari HTML legacy ke React. Ini memisahkan logika tata letak (layout) dengan token visual.

### D. Poppins Typography
* **Keputusan**: Menggunakan typeface **Poppins** yang dimuat melalui Google Fonts CDN secara global.
* **Alasan Estetika**: Poppins adalah font geometric sans-serif yang memberikan kesan bersih, modern, dan sangat terbaca pada layar digital bersolusi tinggi, baik dalam format teks tebal (H1/H2) maupun teks kecil metadata.

### E. Emojis-First Iconography
* **Keputusan**: Menggunakan emoji bawaan sistem (system-native emojis seperti 🗑, ✏️, 📅, 🏠) sebagai elemen ikonografi utama, kecuali jika ada kebutuhan ikon kontrol tertentu.
* **Alasan UX & Performa**: Emoji bersifat ringan, sudah terpasang di semua OS (macOS, iOS, Windows, Android), dan langsung dipahami oleh pengguna tanpa perlu mengunduh library ikon eksternal (mengurangi load time halaman).

---

## 3. Ketentuan Perubahan Keputusan

Setiap modifikasi terhadap keputusan desain dasar ini harus:
1. Melewati analisis dampak visual & teknis (Impact Analysis).
2. Mendapatkan persetujuan absolut dari Manusia (Owner/Human).
3. Dicatat pembaruan versinya di dokumen `DECISION.md` utama proyek.
