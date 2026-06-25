# 📌 LifeFlow Single Source of Truth: TASK BOARD

Dokumen ini adalah papan kendali utama (Single Source of Truth) untuk pengembangan LifeFlow. Selalu ambil tugas dari kolom **READY**, pindahkan ke **IN_PROGRESS** saat dikerjakan, dan ke **DONE** setelah divalidasi. Jangan biarkan tugas tersebar di catatan lain.

---

## 🟡 IN_PROGRESS
*(Maksimal 1-2 task di sini agar tetap fokus)*

### [CORE-001] Setup Project & Global CSS Foundation
- **Description:** Inisialisasi repository aplikasi, instalasi dependensi utama (misal Vite/Next.js/React), dan konfigurasi CSS variabel berdasarkan `DESIGN_SYSTEM.md`.
- **Priority:** Critical
- **Status:** IN_PROGRESS
- **Dependencies:** None
- **Notes:** Pastikan font 'Inter' dan 'JetBrains Mono' terhubung.
- **Acceptance Criteria:**
  - [ ] Aplikasi bisa berjalan dengan command dev (localhost).
  - [ ] Variabel warna (Primary, Secondary, Accent, Background, Text) terdaftar di global CSS.
  - [ ] Sistem grid dan border-radius standar sudah terkonfigurasi.

---

## 🟢 READY
*(Siap dikerjakan segera di sprint ini. Prioritas tertinggi)*

### [UX-001] Simplify Navigation & App Shell 🎯 (UX Audit)
- **Description:** Buat layout utama aplikasi (Sidebar + Main Content). Berdasarkan audit, cukup sisakan menu Dashboard, Tasks, Notes, Habits, dan Settings. Hapus menu AI dan Analytics mandiri.
- **Priority:** High
- **Status:** READY
- **Dependencies:** [CORE-001]
- **Notes:** Gunakan ikon minimalis. Gaya sidebar harus *clean* dengan background `#F9FAFB` (Light).
- **Acceptance Criteria:**
  - [ ] Sidebar me-render menu utama.
  - [ ] Terdapat status *Active/Inactive* saat menu diklik.
  - [ ] Navigasi berfungsi pindah antar komponen/halaman kosong.

### [UX-002] Build Base UI Components (Remove Heavy Shadows) 🎯 (UX Audit)
- **Description:** Buat re-usable component utama (Button, Input, Card) dengan filosofi desain "Flat & Clean" (1px border, shadow seminimal mungkin).
- **Priority:** High
- **Status:** READY
- **Dependencies:** [CORE-001]
- **Notes:** Fokus pada state *Hover* (misal button berubah warna sedikit) untuk menciptakan sensasi aplikasi yang super responsif (*snappy*).
- **Acceptance Criteria:**
  - [ ] Tersedia Button component (Primary, Secondary, Ghost).
  - [ ] Tersedia Card component (dengan border `#E5E7EB`).
  - [ ] Tersedia Input text standard.

### [UX-003] Mobile Layout View Force 🎯 (UX Audit)
- **Description:** Implementasikan layout responsif. Di bawah lebar 768px, sembunyikan sidebar jadi bottom nav bar atau hamburger menu.
- **Priority:** High
- **Status:** READY
- **Dependencies:** [UX-001]
- **Notes:** Persiapan agar Kanban board tidak rusak saat dibuka di HP nantinya.
- **Acceptance Criteria:**
  - [ ] Ketika layar di-resize ke ukuran *mobile*, sidebar beradaptasi dan tidak berantakan.
  - [ ] Tidak ada konten yang tumpah secara horizontal (overflow-x).

---

## 🔴 BLOCKED
*(Tugas yang terhenti karena masalah teknis/menunggu)*
- *(Tidak ada task yang diblokir saat ini)*

---

## ⚪ TESTING
*(Tugas yang baru saja selesai coding dan butuh validasi UI/UX di berbagai layar)*
- *(Kosong)*

---

## 📦 BACKLOG
*(Ide, tugas, dan fitur yang sudah didefinisikan, siap ditarik ke READY)*

### [CORE-002] Inisialisasi Database Local-First
- **Description:** Pasang arsitektur penyimpanan (IndexedDB / SQLite WASM) agar aplikasi bisa menyimpan dan meload data secara offline dengan kecepatan 0ms (tanpa loading).
- **Priority:** High
- **Status:** BACKLOG
- **Dependencies:** [CORE-001]
- **Notes:** Hindari fetch API dari backend server di tahap ini. Simpan murni di peramban (browser) user.
- **Acceptance Criteria:**
  - [ ] Bisa melakukan operasi CRUD dasar pada data *dummy* tanpa error.
  - [ ] Data persisten walau tab browser ditutup/refresh.

### [UX-006] Inline Task Input (Zero-Friction) 🎯 (UX Audit)
- **Description:** Hapus sistem penambahan Task tradisional (yang pakai *modal pop-up* panjang). Buat input satu baris (seperti command line) persis di bagian atas halaman Tasks.
- **Priority:** Medium
- **Status:** BACKLOG
- **Dependencies:** [UX-002], [CORE-002]
- **Notes:** Alur: Ketik judul -> Tekan Enter -> Langsung submit.
- **Acceptance Criteria:**
  - [ ] Menekan tombol "Enter" akan membuat task baru dan langsung muncul di bawahnya.
  - [ ] Field input langsung bersih kembali setelah tekan enter.

### [FEAT-001] Habit Tracker Grid UI
- **Description:** Bangun antarmuka Habit berupa kalender kontribusi bergaya GitHub (grid baris mingguan) dan persentase sukses bulanan.
- **Priority:** Medium
- **Status:** BACKLOG
- **Dependencies:** [UX-001], [CORE-002]
- **Notes:** Implementasikan *Optimistic UI Updates* (kotak langsung berubah centang hijau saat diklik, tanpa spinner, abaikan jeda penyimpanan data).
- **Acceptance Criteria:**
  - [ ] Render daftar Habit.
  - [ ] Kotak grid bisa diklik untuk mengubah status Selesai/Belum.

### [UX-008] Omnibar (Cmd+K) Navigation 🎯 (UX Audit)
- **Description:** Buat *modal global* yang akan muncul saat user menekan shortcut keyboard `Cmd/Ctrl + K`.
- **Priority:** Medium
- **Status:** BACKLOG
- **Dependencies:** [UX-002]
- **Notes:** Ini krusial bagi sasaran power users (mahasiswa SI). Bisa dipakai untuk ganti halaman atau lapor perintah cepat.
- **Acceptance Criteria:**
  - [ ] Tekan Cmd+K memunculkan modal di layar mana saja.
  - [ ] Menggunakan panah atas-bawah dan menekan Enter akan berpindah rute (route).

### [FEAT-002] Two-Pane Notes Editor
- **Description:** Layar Notes terbagi dua (Daftar Note di Sidebar kiri, Editor *Rich Text / Markdown* besar di sebelah kanan).
- **Priority:** Medium
- **Status:** BACKLOG
- **Dependencies:** [UX-001]
- **Notes:** Hindari editor WYSIWYG yang berat, cari *Markdown Editor* yang ringkas.
- **Acceptance Criteria:**
  - [ ] List notes di kiri bisa diklik untuk membuka isinya di kanan.
  - [ ] Teks yang diketik tersimpan otomatis (auto-save).

### [UX-005] Empty States Minimalist 🎯 (UX Audit)
- **Description:** Buat ilustrasi grafis kecil (SVG) dan sebuah tombol tindakan (*Call to Action*) untuk memandu pengguna baru jika Tasks, Notes, atau Habits masih kosong.
- **Priority:** Low
- **Status:** BACKLOG
- **Dependencies:** [UX-002]
- **Notes:** Penting mengatasi "Blank Canvas Syndrome".
- **Acceptance Criteria:**
  - [ ] Tampilan yang kosong memiliki panduan, bukan sekadar "Data not found".

### [AI-001] Invisible AI: Extract Tasks from Notes 🎯 (UX Audit)
- **Description:** Tambahkan tombol (✨ AI) di dalam editor Notes yang bisa mengekstrak paragraf teks panjang menjadi item *To-Do list* dan mengirimnya ke modul Tasks.
- **Priority:** Low
- **Status:** BACKLOG
- **Dependencies:** [FEAT-002], [CORE-002]
- **Notes:** Ini mewujudkan AI yang *background/invisible* dibanding fitur chat. Gunakan Gemini/OpenAI API.
- **Acceptance Criteria:**
  - [ ] AI bisa mendeteksi kata berunsur aksi (misal: "jangan lupa kumpul laporan") menjadi Task Item bernama "Kumpul Laporan".

---

## 🔵 DONE
*(Tugas yang sudah divalidasi dan diimplementasikan secara live/dirilis)*
- `[DOC-001]` Pembuatan Visi, PRD, dan Struktur Folder.
- `[DOC-002]` Pembuatan UI/UX Documents (Screen Inventory, User Flows, Design System, UI Patterns, Wireframes).
- `[DOC-003]` Eksekusi Senior UX Audit & Prioritization Action Plan.

---

## 📁 ARCHIVED
*(Fitur yang digugurkan, dibatalkan, atau dibekukan / Icebox)*
- ❌ Halaman Chatbot AI khusus *Full Screen* (Di-drop berdasarkan UX Audit).
- ❌ Global Analytics Menu (Di-drop berdasarkan UX Audit).
- ❌ Sinkronisasi 2 arah dengan Google Calendar (Ditunda untuk versi 2.0).

---

## 💡 Rekomendasi Urutan Pengerjaan
Gunakan pedoman urutan (*Pipeline*) berikut agar momentum Anda sebagai Solo Developer tidak mandek:

1.  **[CORE-001]** Bangun inisiasi file repositori.
2.  **[UX-001], [UX-002], [UX-003]** Selesaikan visual "App Shell" dan *routing* halamannya. (Minggu Pertama).
3.  **[CORE-002]** Pasang skema penyimpanan lokal agar Anda bisa memasukkan data tes mandiri.
4.  **[UX-006]** Langsung hantam fitur buat Task *Inline* (Tes seberapa cepat rasanya menggunakan penyimpanan lokal).
5.  **[FEAT-001], [FEAT-002]** Bangun tampilan modul sisanya (Habit & Notes).
6.  **[UX-008]** Menjahit semua sistem dengan pergerakan *Omnibar* (Membuat semuanya terhubung).
7.  **[UX-005]** Poles keadaan kosong (*Empty States*).
8.  **[AI-001]** Hadirkan sulap AI sebagai sentuhan akhir MVP.
