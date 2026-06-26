# LifeFlow Core Product Principles

Dokumen ini adalah **Konstitusi LifeFlow**. Ini bukan berisi daftar fitur, *roadmap*, atau spesifikasi teknis, melainkan seperangkat prinsip abadi (*timeless*) yang **WAJIB** dipatuhi selama LifeFlow dikembangkan. 

Setiap fitur baru, keputusan teknis, maupun perubahan UX harus dievaluasi terhadap konstitusi ini. Jika suatu ide atau inisiatif melanggar prinsip-prinsip berikut, maka inisiatif tersebut batal demi hukum arsitektur atau harus direvisi sebelum diimplementasikan.

---

## 1. The 15 Core Principles

### 1. Markdown First
Markdown adalah sumber data utama (Source of Truth). Antarmuka pengguna (UI) hanyalah kacamata (*lens*) atau representasi visual di atasnya. Pengguna selalu memiliki kendali absolut atas data mereka dalam bentuk file mentah. **Tidak boleh ada *vendor lock-in*.**

### 2. Local First
Aplikasi harus tetap sepenuhnya berguna tanpa koneksi internet. Data diprioritaskan untuk tersimpan di memori dan penyimpanan lokal perangkat pengguna. Sinkronisasi jaringan (*cloud sync*) adalah fitur nilai tambah, bukan ketergantungan fundamental.

### 3. Offline First
Seluruh fitur inti wajib bekerja pada saat offline (terputus dari internet). Internet hanya bertugas meningkatkan pengalaman (cth. sinkronisasi tim atau AI eksternal), namun bukan merupakan syarat utama penggunaan aplikasi.

### 4. AI Native
Kecerdasan Buatan (AI) bukanlah *chatbot* tempelan. AI adalah lapisan fundamental dari *workflow*. AI harus mampu membantu pengguna berpikir, menghubungkan benang merah antar informasi, mengotomatisasi pekerjaan rutin, dan memberikan rekomendasi tajam yang dapat langsung ditindaklanjuti.

### 5. Human + AI Collaboration
AI tidak diciptakan untuk menggantikan pengguna, melainkan bertindak sebagai **anggota tim virtual** (*co-pilot/collaborator*). Penggalian ide dilakukan bersama, namun hak veto dan keputusan akhir mutlak berada di tangan manusia.

### 6. Open Data
Seluruh data aplikasi harus dapat diekspor kapan saja. Gunakan format standar terbuka (*open formats*) bilamana memungkinkan. Pengguna tidak boleh merasa disandera oleh struktur *database* proprietary yang sulit dipahami.

### 7. Everything is Structured Data
Semua elemen aplikasi—baik itu Markdown, Notes, Tasks, Bugs, Roadmap, Requirements, maupun Dokumentasi—harus dapat dipilah (*parsed*) menjadi struktur data (*AST/JSON*) yang konsisten. Keberadaan AI dan antarmuka UI bekerja manipulatif di atas struktur data yang seragam tersebut.

### 8. Everything is Connected
Setiap elemen pengetahuan tidak berdiri sendiri. Sebuah *Task* harus dapat terhubung dengan: Requirement ↔ Bug ↔ Release ↔ Documentation ↔ Milestone ↔ Module ↔ Decision ↔ Commit. Semua informasi wajib memiliki daya telusur (*traceability*) tanpa batas.

### 9. Modular Architecture
Setiap modul dirancang untuk berdiri secara independen. Task, Notes, Habit, Calendar, AI, Team Collaboration, hingga Analytics harus dapat dikembangkan, diperbarui, atau bahkan dimatikan secara parsial tanpa merusak integritas fungsional modul lainnya.

### 10. Zero Vendor Lock-in
Pengguna memiliki kemerdekaan untuk berpindah platform kapan saja, membawa data milik mereka seutuhnya. Di sisi arsitektur perangkat lunak, LifeFlow juga tidak boleh bergantung (*hard-coupled*) pada satu penyedia spesifik untuk LLM (AI), komputasi *cloud*, struktur *database*, atau layanan infrastruktur tertentu.

### 11. Invisible AI
AI harus muncul hanya ketika dibutuhkan. AI tidak boleh mengganggu fokus pengguna (*intrusive*). Ia memberikan bantuan analitik atau otomasi di balik layar (*invisible*) tanpa memaksa, menjaga antarmuka tetap tenang.

### 12. Performance First
Respons antarmuka wajib terasa seketika (*instant/60fps*). Optimalisasi performa dan manajemen *memory/latency* harus diselesaikan terlebih dahulu sebelum menumpuk fitur-fitur baru ke dalam sistem. Kecepatan adalah fitur terbaik.

### 13. Calm & Minimal UX
LifeFlow harus terasa **tenang**. UI dirancang untuk secara agresif mengurangi elemen visual yang tidak perlu (*clutter*), mengurangi klik, serta menghilangkan distraksi agar fokus mental pengguna terlindungi secara maksimal.

### 14. Security & Privacy by Design
Keamanan dan privasi bukan fitur opsional (*afterthought*). Keduanya harus dipikirkan mendalam sejak cetak biru arsitektur dibuat. Secara *default*, lalu lintas data maupun penyimpanan info sensitif pengguna harus terenkripsi dan aman.

### 15. Dogfooding
LifeFlow harus diciptakan cukup andal agar tim developer sanggup mengembangkan LifeFlow *menggunakan* LifeFlow sendiri. Seluruh proses pengembangan internal—mulai dari penulisan dokumentasi, pelacakan *task*, *bug tracking*, rilis manajemen, hingga kolaborasi AI—wajib menggunakan LifeFlow.

---

## 2. Product Philosophy
**"Frictionless Amplification of Human Potential."**  
LifeFlow tidak dibuat semata-mata untuk mengelola daftar perkerjaan. Filosofi tertingginya adalah menyingkirkan semua hambatan mental dan teknis (*friction*) antara **ide** dan **eksekusi**. Kami percaya bahwa perangkat lunak seharusnya tidak memaksa pengguna mengikuti cara kerjanya, melainkan beradaptasi secara organik dengan cara kerja pengguna—menyatukan struktur dan fleksibilitas dalam satu aliran (*flow*).

---

## 3. Engineering Philosophy
- **Simplicity over Complexity**: Jika ada dua solusi yang berfungsi, pilih yang paling sederhana dan mudah dipahami, meskipun terlihat konvensional.
- **Maintainability over Cleverness**: Kode yang pintar (*clever/tricky*) sering kali menjadi hutang teknis esok hari. Prioritaskan kode yang mudah dirawat.
- **Readability over Short Code**: Jangan mengorbankan keterbacaan kode hanya demi memangkas jumlah baris. Tulis kode seakan-akan Anda sedang menuliskannya untuk manusia, bukan compiler.
- **Stability over Speed of Development**: Fitur yang berfungsi cepat tapi rawan *crash* tidak bernilai apa-apa. Stabilkan fondasi lebih dulu, kecepatan iterasi akan menyusul secara alami.
- **Quality over Quantity**: Merilis satu modul yang kokoh dan disukai pengguna jauh lebih berharga dibanding lima modul setengah jadi (MVP *hell*).

---

## 4. AI Philosophy
AI di dalam LifeFlow diperlakukan layaknya **Rekan Kerja Intelektual**, bukan sekadar mesin penjawab. Konsep dasarnya adalah **Augmentation, not Replacement**.  
Saat Anda buntu, AI menyediakan jembatan pemikiran. Saat Anda kebanjiran data, AI menstrukturnya. Interaksi AI-Manusia harus terasa organik, di mana AI mengamati konteks ruang kerja Anda secara pasif (*invisible*), dan proaktif menawarkan *insight* (misalnya mendeteksi prioritas yang tumpang-tindih atau menyarankan pengelompokan task) tanpa perlu di-pancing terus-menerus melalui jendela *chat*.

---

## 5. Decision Framework
Setiap inisiatif, modul baru, perombakan arsitektur, maupun perbaikan UI/UX wajib melewati filter pertanyaan berikut. 

- Apakah ini sesuai dengan *CORE_PRODUCT_PRINCIPLES*?
- Apakah ini secara nyata meningkatkan pengalaman pengguna, atau hanya sekadar "bagus untuk dimiliki"?
- Apakah implementasi ini menambah *technical complexity* yang tidak masuk akal?
- Apakah fondasi kode ini dapat dipelihara dengan mudah dalam jangka panjang (5–10 tahun)?
- Apakah ini tetap menghormati filosofi *Local First* dan *Open Data*?
- Apakah integrasi AI pada tahap ini benar-benar esensial untuk memecahkan masalah pengguna, atau sekadar *gimmick* agar terlihat canggih?

Jika mayoritas atau jawaban paling fundamental berujung pada kata **"TIDAK"**, maka ide/fitur tersebut harus secara tegas **DITUNDA** atau **DITOLAK**.

---

## 6. North Star Vision
LifeFlow bukanlah sekadar aplikasi produktivitas.  

LifeFlow adalah **Personal Operating System** tingkat lanjut yang memungkinkan Manusia dan AI bekerja bersama dalam ritme yang harmonis untuk mengelola pengetahuan, mengeksekusi proyek, membuat keputusan, dan berkolaborasi dalam jaringan—sepenuhnya berada di atas infrastruktur data yang **terbuka, terstruktur, dan senantiasa dimiliki secara berdaulat oleh penggunanya**.
