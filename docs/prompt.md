START :
Baca seluruh docs project.

Fokus utama pada:
docs/project/TASK_BOARD.md

Tugas:

1. Cari task dengan status IN_PROGRESS.
2. Jika tidak ada:
    pilih task READY dengan priority tertinggi.
3. Analisis:
    * tujuan task
    * dokumen terkait
    * file yang kemungkinan perlu diubah
    * risiko implementasi
4. Buat rencana kerja untuk sesi coding hari ini.
5. Jangan mengerjakan task lain.

Output:

* Task yang dipilih
* Alasan pemilihan
* Langkah implementasi
* Estimasi waktu
* Definition of Done

DONE :
Bertindak sebagai Project Manager LifeFlow.

Saya akan memberikan ringkasan pekerjaan hari ini.

Tugas:

1. Update TASK_BOARD.md.
2. Ubah status task sesuai progres:
    * READY
    * IN_PROGRESS
    * BLOCKED
    * TESTING
    * DONE
3. Tambahkan catatan teknis.
4. Tambahkan kendala yang ditemukan.
5. Tambahkan pekerjaan yang harus dilanjutkan pada sesi berikutnya.
6. Jika task selesai:
    pindahkan ke DONE.
7. Jika task belum selesai:
    tetap di IN_PROGRESS dan tuliskan progress persentasenya.
8. Buat ringkasan singkat untuk SESSION_LOG.md.

Output:

* Perubahan TASK_BOARD.md
* Catatan SESSION_LOG.md
* Next Action untuk sesi berikutnya

TASK_BOARD
=
Apa yang dikerjakan

MODULES
=
Status fitur

PROJECT_STATE
=
Kondisi project

ROADMAP
=
Arah jangka panjang


start:
1. Baca AGENTS.md

↓

2. Baca TASK_BOARD.md

↓

3. Kerjakan SATU task

↓

4. Build

↓

5. QA

↓

6. Saya (User) UAT

↓

7. PASS

↓

8. Commit

↓

9. Push

↓

10. SESSION_LOG update

Workflow Belajar Setelah AI Selesai Coding (SOP Pribadi)

Tujuan: Jangan hanya menerima hasil AI, tetapi pahami cara kerja setiap fitur agar kemampuan software engineering terus berkembang.

⸻

1. Baca Ringkasan Perubahan

* Baca penjelasan AI mengenai fitur yang dibuat.
* Pahami tujuan fitur tersebut.
* Catat file apa saja yang ditambah, diubah, atau dihapus.

⸻

2. Buka Semua File yang Berubah

Jangan langsung menjalankan aplikasi.

Buka seluruh file yang dimodifikasi dan pahami fungsinya.

Untuk setiap file, jawab pertanyaan berikut:

* File ini berfungsi untuk apa?
* Komponen atau class apa yang ada di dalamnya?
* Function apa saja yang dibuat?
* State (useState) apa saja yang digunakan?
* Effect (useEffect) apa saja yang dijalankan?
* Import apa saja yang digunakan?
* Export apa yang diberikan ke file lain?

Jika belum tahu jawabannya, cari sendiri sampai paham.

⸻

3. Trace Function (Ikuti Alur Function)

Untuk setiap function penting (misalnya handleSave, handleDelete, handleLogin, dll.), telusuri alurnya.

Jawab pertanyaan berikut:

* Function ini dipanggil oleh siapa?
* Kapan function ini dijalankan?
* Apa yang dilakukan pertama kali?
* Function lain apa yang dipanggil?
* Apakah ada API yang dipanggil?
* Apakah state diubah?
* Bagaimana UI berubah setelah function selesai?

Gunakan fitur Go to Definition atau Cmd/Ctrl + Click untuk mengikuti alurnya.

⸻

4. Pahami Data Flow

Gambarkan perjalanan data dari awal sampai akhir.

Contoh:

User klik tombol
↓
handleSave()
↓
Validasi input
↓
saveTask()
↓
API Request
↓
Database
↓
Response
↓
setTasks()
↓
UI Update

Usahakan bisa menjelaskan alur tersebut tanpa melihat AI.

⸻

5. Pelajari Konsep React yang Dipakai

Perhatikan setiap penggunaan:

* useState
* useEffect
* Props
* Context
* Custom Hook
* Component

Tanyakan pada diri sendiri:

* Kenapa pakai useState?
* Kenapa useEffect dijalankan?
* Data dikirim lewat props dari mana?
* Component ini bertanggung jawab untuk apa?

⸻

6. Pelajari TypeScript

Setiap menemukan:

* interface
* type
* enum
* generic
* union type
* optional property

Cari tahu:

* Data seperti apa yang sedang dijelaskan?
* Kenapa perlu type tersebut?
* Apa manfaatnya dibanding JavaScript biasa?

⸻

7. Ubah Satu Hal Sendiri (Tanpa AI)

Setelah memahami fitur, lakukan satu perubahan kecil sendiri.

Contoh:

* Mengubah teks.
* Mengubah warna.
* Menambah validasi.
* Menambah icon.
* Mengubah urutan data.
* Menambah tombol kecil.
* Mengubah loading.
* Mengubah toast/alert.

Jika perubahan berhasil, berarti mulai memahami bagian tersebut.

⸻

8. Testing

Jalankan aplikasi.

Pastikan:

* Tidak ada error.
* Semua fitur tetap berjalan.
* Perubahan yang dibuat sesuai harapan.

⸻

9. Jika Ada Bug, Jangan Langsung Tanya AI

Lakukan proses debugging terlebih dahulu.

Urutan debugging:

1. Buka Inspect.
2. Lihat tab Console.
3. Baca pesan error.
4. Klik lokasi file dan nomor baris.
5. Tambahkan console.log() untuk melihat isi variable.
6. Gunakan Network untuk mengecek request API.
7. Ikuti stack trace sampai menemukan sumber masalah.
8. Baru jika benar-benar buntu, minta bantuan AI.

Target pribadi:

Minimal mencoba mencari penyebab bug sendiri selama 10–15 menit sebelum bertanya ke AI.

⸻

10. Catat Hal Baru

Setiap selesai satu fitur, tulis:

* Konsep baru yang dipelajari.
* Bug yang ditemukan.
* Penyebab bug.
* Cara memperbaikinya.
* Hal yang masih belum dipahami.

Catatan ini akan menjadi dokumentasi belajar pribadi.

⸻

Target Akhir

Setelah setiap fitur selesai, saya harus bisa menjawab pertanyaan berikut tanpa melihat AI:

* Apa fungsi fitur ini?
* File mana saja yang terlibat?
* Bagaimana alur data berjalan?
* Function mana yang paling penting?
* Dari mana data berasal?
* Ke mana data dikirim?
* Bagaimana UI diperbarui?
* Jika terjadi bug, saya tahu harus mulai mencari dari mana.

Jika saya bisa menjawab semua pertanyaan tersebut, berarti saya benar-benar memahami fitur yang dibuat, bukan sekadar menggunakannya.