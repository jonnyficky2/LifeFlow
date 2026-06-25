# Audit Action Plan & Backlog

Berdasarkan hasil *UX Audit*, berikut adalah daftar backlog perbaikan yang diprioritaskan menggunakan matriks **Effort vs Impact**. 

Tujuan utama rencana ini adalah memangkas friksi pengguna (friction), mempercepat eksekusi harian (Zero-friction UX), dan menyelaraskan aplikasi dengan filosofi *Fast, Clean, Minimalist*.

---

## 1. Quick Wins (High Impact, Low Effort)
*Kerjakan Sekarang. Fitur ini memberikan perubahan signifikan pada *User Experience* dengan usaha *coding* yang sangat minim.*

- [ ] **Simplify Navigation:** Hapus menu `AI Assistant` dan `Analytics` dari sidebar utama. Sederhanakan menjadi 4 pilar: Dashboard, Tasks, Notes, Habits.
- [ ] **Remove Heavy Shadows:** Hapus *box-shadow* tebal pada Card, Modal, dan Button. Ganti dengan *Flat Design* (border 1px solid warna `#E5E7EB`) untuk menciptakan persepsi performa "Fast & Snappy".
- [ ] **Mobile List View Force:** Pasang *media query* untuk menonaktifkan tampilan Kanban Board pada layar lebar < 768px dan mengubahnya secara paksa menjadi *Stacked List*.
- [ ] **Habit Checklist Simplification:** Hapus input "Deskripsi" dan "Prioritas" dari fitur pembuatan Habit. Habit cukup berisi: *Title* dan *Frequency*.
- [ ] **Remove Empty Dashboard Clutter:** Sembunyikan *widget* di Dashboard jika kosong, ganti dengan satu pesan motivasi minimalis dan tombol *Quick Add*.

## 2. Major Projects (High Impact, High Effort)
*Inisiatif inti yang mendefinisikan *competitive advantage* dari produk. Butuh fokus sprint khusus.*

- [ ] **Inline Task Input (Natural Language):** Hapus modal pop-up tradisional "Create Task" yang panjang. Ganti dengan satu baris textbox di bagian atas halaman Task. 
- [ ] **NLP Time Parsing:** Integrasikan *library* (misal: `chrono-node`) agar ketikan "Meeting besok jam 9" otomatis merubah tanggal *Due Date* tanpa kalender UI.
- [ ] **Omnibar (Cmd+K) Navigation:** Implementasi command palette global untuk perpindahan halaman instan dan pembuatan entri data dari manapun.
- [ ] **Local-First Database Setup:** Ubah state management untuk menggunakan struktur *IndexedDB / SQLite WASM* secara lokal (dengan sinkronisasi latar belakang) untuk mencapai waktu perpindahan menu **0 milidetik**.
- [ ] **Invisible AI - Extract Tasks:** Buat endpoint dan tombol khusus di dalam modul Notes ("✨ Extract to Tasks") yang menyuruh AI merangkum paragraf pengguna dan membuat *Action Items* langsung ke *database Tasks*.

## 3. Fill-Ins (Low Impact, Low Effort)
*Tugas sampingan (nice-to-have). Kerjakan jika ada sisa waktu di akhir sprint.*

- [ ] **Optimistic UI Updates:** Hapus logika *loading spinner* setiap kali pengguna menekan ceklis *Task/Habit*. Asumsikan API selalu sukses (UI langsung hijau), jika gagal *throw error* ke *Toast Notification*.
- [ ] **Actionable Empty States:** Tambahkan grafis vektor minimalis + Tombol *Call to Action* utama pada halaman yang kosong.
- [ ] **Keyboard Shortcuts Khusus:** Tambahkan hotkeys `T` (Task Baru), `N` (Note Baru), `H` (Habit Baru) jika Omnibar belum dikuasai user.
- [ ] **Zen Mode:** Tambahkan tombol kecil (atau shortcut `Cmd+\`) untuk collapse/hide sidebar agar *area* Notes memenuhi seluruh layar (*Focus Mode*).

## 4. Time Wasters / Icebox (Low Impact, High Effort)
*Hentikan pengembangan fitur ini segera. Pindahkan ke arsip. Menguras waktu tim tanpa memberikan dampak nyata pada retensi pengguna harian.*

- [ ] ❌ **Halaman Khusus Chatbot AI (Full Screen Chat):** Fokuskan AI hanya pada *Text extraction/parsing* di belakang layar.
- [ ] ❌ **Custom Global Analytics Dashboard:** Jangan buang waktu membuat grafik Chart.js untuk pengguna. Cukup tampilkan persentase angka kesuksesan di masing-masing modul.
- [ ] ❌ **Integrasi Kalender Eksternal 2-Way (Google Calendar Sync):** Tunda hingga versi 2.0 atau 3.0 setelah MVP stabil. Pengaturan Auth-nya akan membuang waktu 2-3 minggu.
