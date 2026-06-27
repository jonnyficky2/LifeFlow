# Unified User Flows Map

Dokumen ini memetakan seluruh alur interaksi pengguna (User Flows) utama pada aplikasi LifeFlow. Ini menjamin perancang (Designer) dan pengembang (Developer) memiliki persepsi yang sama tentang jalur navigasi (navigation paths) pengguna.

---

## 1. Onboarding & Inisiasi Awal (First Time User)
1. **Layar Sambutan (Welcome Screen)**: Pengguna pertama kali disuguhkan ringkasan fitur LifeFlow (Fast, Local-First, Markdown).
2. **Setup Personalisasi**: Form sederhana meminta nama panggilan untuk greeting header (e.g., "Jofi").
3. **Template Load (Pilih Kategori)**: Memilih template peran (misal: "Student" atau "Professional"). Menekan tombol simpan akan menginisiasi data default kategori di `localStorage` (misal kategori: `Academic`, `Personal` untuk student).
4. **Dashboard Landing**: Pengguna diarahkan ke Dashboard utama dengan greeting dinamis dan satu task contoh untuk dicentang.

---

## 2. Manajemen Tugas (Tasks Flow)

### A. Inline Task Quick Add (Aksi Terpadu)
1. Pengguna membuka halaman **Tasks**.
2. Di bawah list kategori tugas (misal: "Academic"), terdapat kolom input inline dengan placeholder `"What needs to be done today?"`.
3. Pengguna mengetik nama tugas baru.
4. **Eksekusi Pembuatan**:
   - Pengguna menekan tombol `Enter` ↵, ATAU
   - Pengguna mengklik tombol `+` (trailing icon) di sisi kanan input.
5. Kedua aksi di atas memicu satu fungsi yang sama (`handleCreateInlineTask`). Task baru langsung dimasukkan ke list terbawah kategori aktif dengan status pending. Kolom input dikosongkan secara instan.

### B. Detailed Task Creation (Modal Workflow)
1. Pengguna menekan tombol **"Add Task"** di widget kosong (empty state) atau membuka tombol aksi di pojok panel.
2. Muncul jendela **TaskModal** (back-drop blur aktif, modal scale-up 0.25s).
3. Pengguna mengisi form nama tugas, keterangan, tenggat waktu (deadline), waktu, prioritas (Low/Medium/High), label (tags), pengingat, dan subtasks.
4. Pengguna menekan **Save**.
5. Data divalidasi, disimpan di context global, modal tertutup, dan Toast "Task created successfully" muncul di kanan bawah.

---

## 3. Catatan & Auto-Save Editor (Notes Flow)
1. Pengguna membuka modul **Notes** (tata letak dua panel: list catatan di kiri, bidang editor di kanan).
2. Pengguna mengklik tombol **"+ New"** di tajuk list catatan.
3. Catatan baru berlabel `"Untitled Note"` dibuat dan langsung disorot sebagai item aktif. Area editor di kanan fokus.
4. Pengguna mengetik judul dan isi catatan di textarea menggunakan sintaks Markdown.
5. **Debounced Auto-Save**: Setiap ketikan diproses secara lokal di state editor. Ketika pengguna berhenti mengetik selama `500ms`, penghematan otomatis dipicu (auto-save debounced) ke global context / localStorage untuk menghindari kelambatan (lag) keystroke.
6. Pengguna dapat mengklik tombol **"🗑"** di pojok kanan atas editor untuk menghapus catatan aktif (setelah mengonfirmasi konfirmasi dialog konfirmasi).

---

## 4. Pembiasaan Harian (Habits Tracker Flow)
1. Pengguna membuka halaman **Habits**.
2. Pengguna melihat daftar kebiasaan aktif yang dimilikinya beserta persentase konsistensi 30 hari terakhir.
3. **Pencatatan Hari Ini**:
   - Pengguna mencari tanggal hari ini pada grid kontribusi (GitHub-style weekly grid columns).
   - Pengguna mengklik sel tanggal tersebut (atau mencentang checkbox nama habit).
   - Sel tanggal langsung berubah warna menjadi aksen hijau habit (`--color-success`) dengan durasi transisi `0.15s`.
   - Persentase konsistensi 30 hari otomatis dihitung ulang secara instan.
4. **Membuat Habit Baru**: Pengguna mengklik tombol `+ Create Habit`, mengisi nama habit, memilih ikon emoji, dan warna aksen kustom, lalu menekan simpan.

---

## 5. Penjadwalan Kalender (Calendar Flow)
1. Pengguna membuka halaman **Calendar** (tata letak grid bulanan).
2. Pengguna dapat menekan tombol **"< Prev"** atau **"Next >"** untuk berpindah bulan secara dinamis.
3. Setiap sel tanggal di kalender menampilkan nomor hari dan daftar singkat indikator tugas (maksimal 3 item teratas dengan indikator warna prioritas: hijau=low, kuning=medium, merah=high).
4. **Melihat Detail Hari**:
   - Pengguna mengklik salah satu sel tanggal.
   - Panel detail di bawah kalender menampilkan daftar tugas lengkap untuk tanggal terpilih.
   - Pengguna dapat mengklik salah satu tugas di daftar tersebut untuk membuka **TaskModal** guna melakukan penyuntingan data (deadline, time, tags) secara langsung.

---

## 6. Pengaturan Aplikasi (Settings Flow)
1. Pengguna mengklik opsi **Settings** di sidebar navigasi.
2. Pengguna disuguhkan form pengaturan akun, tema antarmuka (Dark/Light toggle), ekspor/impor data cadangan (JSON backup), dan pembersihan data (Danger Zone).
3. **Mengubah Tema**:
   - Pengguna mengklik tombol toggle tema.
   - Perubahan dideteksi oleh React effect, kelas `.light-mode` ditambahkan/dihapus dari tag `body`.
   - Warna latar dan teks berubah secara instan mengikuti skema warna baru di `variables.css`.
