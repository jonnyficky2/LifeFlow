# Design System: LifeFlow

Dokumen ini mendefinisikan sistem desain (Design System) yang terpadu untuk LifeFlow. Seluruh antarmuka React dan CSS harus merujuk pada token-token yang didefinisikan di sini guna menjaga konsistensi visual dan kemudahan pemeliharaan kode (maintainability) dalam jangka panjang (5-10 tahun).

---

## 1. Color Palette (Skema Warna)

Sistem warna LifeFlow dibagi menjadi dua mode utama (Dark Mode & Light Mode). Semua variabel warna diikat pada properti bertema `:root` dan diatur kembali ketika kelas `.light-mode` aktif pada elemen `body`.

### A. Dark Mode (Default / Legacy Base)
| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--color-bg` | `#07111f` | Warna latar belakang utama halaman |
| `--color-bg-deep` | `#040b15` | Latar belakang sidebar, bottom nav, & container terluar |
| `--color-surface` | `rgba(14, 27, 49, 0.72)` | Latar belakang panel/card standar |
| `--color-surface-strong` | `rgba(17, 33, 60, 0.84)` | Hover card, modal content, input active |
| `--color-border` | `rgba(148, 163, 184, 0.18)` | Garis pembatas (border) standar |
| `--color-text` | `#f7fbff` | Warna teks utama |
| `--color-muted` | `#a7b3c7` | Warna teks sekunder / muted |

### B. Light Mode (Toggled via `body.light-mode`)
| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--color-bg` | `#f8fafc` | Latar belakang utama halaman |
| `--color-bg-deep` | `#e2e8f0` | Latar belakang sidebar, bottom nav |
| `--color-surface` | `rgba(255, 255, 255, 0.82)` | Latar belakang panel/card standar |
| `--color-surface-strong` | `rgba(241, 245, 249, 0.9)` | Hover card, modal content, input active |
| `--color-border` | `rgba(15, 23, 42, 0.08)` | Garis pembatas (border) standar |
| `--color-text` | `#0f172a` | Warna teks utama |
| `--color-muted` | `#64748b` | Warna teks sekunder / muted |

### C. Aksentuasi / Brand Colors (Global)
| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--color-primary` | `#5574ff` | Tombol utama, menu aktif, border sorotan utama |
| `--color-secondary` | `#8e5cff` | Gradien aksen, streaks aktif, tag tertentu |
| `--color-success` | `#48d66d` | Indikator selesai (tasks/habits done), streaks hijau |
| `--color-warning` | `#f2c94c` | Warning states, reminder, medium priority |
| `--color-danger` | `#ef4444` | Hapus/delete actions, high priority |

---

## 2. Typography Scale (Tipografi)

LifeFlow secara eksklusif menggunakan font **Poppins** (dari Google Fonts CDN) sebagai sumber kebenaran visualnya.

| Tag / Kelas | Ukuran Font | Ketebalan | Line Height | Keterangan |
| --- | --- | --- | --- | --- |
| `h1` | `32px` / `2.0rem` | Bold (700) | `1.2` | Judul Halaman Utama |
| `h2` | `24px` / `1.5rem` | SemiBold (600) | `1.2` | Sub-judul / Panel Header |
| `h3` | `18px` / `1.125rem` | Medium (500) | `1.3` | Judul Card / Item Title |
| `body` (Base) | `14px` / `0.875rem` | Regular (400) | `1.5` | Default teks aplikasi |
| `small` / `hint` | `12px` / `0.75rem` | Regular (400) | `1.4` | Teks sekunder, timestamps, tips |

*Aturan*: Hindari pendefinisian ukuran font ad-hoc (misal: 15px, 13px) di dalam CSS lokal. Gunakan skala di atas.

---

## 3. Spacing System (Jarak)

Sistem jarak (margin, padding, gap) menggunakan **8pt Grid System** guna menjamin konsistensi antarprioritas visual.

| Token | Nilai | Keterangan / Kasus Penggunaan |
| --- | --- | --- |
| `--space-1` | `4px` | Mikro padding, jarak teks ke subtask |
| `--space-2` | `8px` | Padding tombol kecil, gap subtask, gap tag |
| `--space-3` | `12px` | Jarak antar elemen input, padding card kecil |
| `--space-4` | `16px` | Padding card standar, gap antar baris task |
| `--space-5` | `24px` | Padding panel utama, margin antar card grid |
| `--space-6` | `32px` | Spacing antar section besar, spacing di dalam modal |
| `--space-7` | `48px` | Padding bawah halaman (ruang melayang bottom-nav) |
| `--space-8` | `64px` | Jarak besar untuk layout desktop |

---

## 4. Border Radius (Kelengkungan Sudut)

Semua kelengkungan sudut diatur menggunakan token terstandarisasi untuk memberikan kesan modern, fluid, dan premium:

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--radius-xs` | `4px` | Checkbox, border separator kecil |
| `--radius-sm` | `8px` | Tombol kecil, tag item, badge prioritas |
| `--radius-md` | `18px` | Input field, textarea, individual task row |
| `--radius-lg` | `24px` | Dashboard panel, modal popup box, habit tracker card |
| `--radius-full` | `9999px` | Avatar, tombol bulat melayang (FAB) |

---

## 5. Shadows & Elevation (Bayangan & Efek Kedalaman)

Gunakan efek kedalaman (depth) berbasis bayangan CSS untuk membedakan lapisan visual (layering) elemen UI:

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--shadow-sm` | `0 4px 12px rgba(0, 0, 0, 0.1)` | Efek kedalaman halus pada tombol standar |
| `--shadow-md` | `0 10px 30px rgba(0, 0, 0, 0.25)` | Hover state tombol/card, menu dropdown |
| `--shadow-lg` | `inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 22px 60px rgba(0, 0, 0, 0.16)` | Card/panel dashboard utama, modal container |

---

## 6. Button Variants (Tombol)

Tombol harus mengikuti variasi global berikut untuk menghindari gaya ad-hoc di file modular:

1. **Primary Button** (`.btn-primary`):
   - Background: `var(--color-primary)`
   - Text: Putih
   - Radius: `var(--radius-sm)`
   - Shadow: `var(--shadow-sm)`
   - Hover: `filter: brightness(1.15)` dengan transisi `0.2s`
2. **Secondary/Outline Button** (`.btn-secondary`):
   - Border: `1px solid var(--color-border)`
   - Background: `var(--color-button-bg-1)`
   - Text: `var(--color-text)`
   - Hover: Background `var(--color-surface-strong)`
3. **Danger Button** (`.btn-danger`):
   - Background: `var(--color-danger)`
   - Text: Putih
   - Hover: `filter: brightness(1.1)`
4. **Action Button** (`.btn-action`):
   - Tombol mungil berisi emoji saja (misal: `🗑`, `✏️`).
   - Background: `transparent` / no border
   - Hover: Background sirkular redup `rgba(255, 255, 255, 0.06)`

---

## 7. Input & Search Variants (Bidang Input)

Semua input harus terlihat jelas (memenuhi kriteria kontras AA/AAA) dengan ukuran area sentuh yang nyaman:

* **Text Input / Select Dropdown** (`.form-input`, `.form-select`):
  - Height: `44px` (touch target optimal)
  - Border: `1px solid var(--color-border)`
  - Background: `var(--color-bg-deep)`
  - Radius: `var(--radius-md)`
  - Text: `var(--color-text)` (14px)
  - Focus state: `outline: 2px solid var(--color-primary)` dengan transisi outline ring.
* **Search Input** (`.search-input`):
  - Selalu memuat ikon lup (`🔍` atau SVG) di sisi kiri sebagai visual clue.
  - Border & radius sama dengan standar input.

---

## 8. Card & Container Layout (Panel Halaman)

* **Dashboard Panel** (`.dashboard-panel`):
  - Latar belakang: `var(--color-surface)`
  - Kelengkungan: `var(--radius-lg)`
  - Border: `1px solid var(--color-border)`
  - Padding dalam: `var(--space-4)` (mobile) / `var(--space-5)` (desktop)
  - Shadow: `var(--shadow-lg)`
* **Task Card / Item Row** (`.task-item`, `.habit-card`):
  - Background: `var(--color-task-bg)`
  - Border-radius: `var(--radius-md)`
  - Jarak internal (padding): `12px 16px`

---

## 9. Modal Rules (Aturan Jendela Dialog)

* **Backdrop**:
  - `background: rgba(4, 11, 21, 0.8)` (atau setara dengan filter blur `backdrop-filter: blur(8px)`).
* **Container**:
  - Max-width: `480px`
  - Border-radius: `var(--radius-lg)`
  - Shadow: `var(--shadow-lg)`
  - Transisi: Efek scale-up halus (`transform: scale(0.95)` ke `scale(1)`) berdurasi `0.25s` saat dibuka.

---

## 10. Icon Consistency (Ikonografi)

* **Library**: Menggunakan emoji teks terstandarisasi atau SVG Lucide Icons secara konsisten.
* **Ukuran**:
  - Inline teks / Tombol aksi: `16px`
  - Toolbar / Inputs: `20px`
  - Sidebar / Bottom nav items: `24px`

---

## 11. Animation & Transition System (Transisi)

* **Fading & Scaling**: `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);` untuk semua interaksi tombol, menu hover, dan perubahan state checklist.
* **Sidebar Transition**: Sliding `0.3s cubic-bezier(0.25, 0.8, 0.25, 1)` untuk menjamin efek buka-tutup drawer terasa ringan di perangkat mobile.