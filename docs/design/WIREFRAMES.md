# Wireframe & Visual Mock-up Guidelines

Dokumen ini mendefinisikan panduan referensi visual (Wireframes) untuk pengembang LifeFlow. Berdasarkan keputusan arsitektur desain, LifeFlow melarang penggunaan sketsa ASCII di dalam berkas dokumentasi karena tidak dinamis dan sulit diperbarui.

---

## 1. Figma Design System Connection

Semua rancangan antarmuka fidelitas tinggi (high-fidelity mock-ups) dan komponen visual dikelola secara tersentralisasi pada ruang kerja Figma:

* **Tautan Figma Master Workspace**:  
  [Figma: LifeFlow Personal OS v1.0 (Mockups & Design System)](https://figma.com/file/lifeflow-personal-os-placeholder-link)
* **Aturan Penggunaan**:
  - Gunakan tab **Inspect** di Figma untuk mendapatkan nilai padding, margin, dan kelengkungan sudut (border-radius) yang presisi.
  - Sebelum menulis kelas CSS baru, pastikan nilai spacing di Figma merupakan kelipatan 8px (mengikuti token `--space-1` s.d `--space-8`).

---

## 2. Screenshot Mapping (Peta Screenshot)

Untuk memudahkan developer baru memahami kecocokan visual antarmuka React terhadap hasil build akhir, rujuk berkas gambar mock-up berikut di dalam repositori:

* **App Shell & Layout (Desktop)**:  
  [Mockup: App Shell Desktop](file:///Users/jofi/.gemini/antigravity-ide/brain/bfb2ccbc-9277-4e84-8940-2c68c2d3d9f3/media__1782485790493.png)  
  *Menampilkan posisi sidebar, navbar header, dan layout grid 2-kolom dashboard.*
* **Habits Tracker View (Grid GitHub-Style)**:  
  *Rujuk tangkapan layar di folder `/docs/design/assets/habits_grid.png`.*
* **Notes Split-Editor View**:  
  *Rujuk tangkapan layar di folder `/docs/design/assets/notes_split_pane.png`.*

---

## 3. Alur Pembaruan Aset Visual

Jika terdapat perubahan layout antarmuka yang telah disetujui:
1. Perbarui rancangan visual di berkas Figma Master Workspace.
2. Ambil tangkapan layar (screenshot) dari hasil render browser lokal setelah build sukses.
3. Simpan screenshot baru tersebut ke dalam folder `/docs/design/assets/` dengan nama file lowercase terstruktur.
4. Perbarui tautan referensi gambar di dalam dokumen ini.
