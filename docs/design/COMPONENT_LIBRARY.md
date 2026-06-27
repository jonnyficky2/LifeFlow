# Component Library Specification

Dokumen ini mendefinisikan pustaka komponen antarmuka (UI Components) yang digunakan kembali (reusable) di seluruh aplikasi LifeFlow. Semua komponen harus mematuhi properti visual, struktur DOM, dan status perilaku di bawah ini.

---

## 1. Skeleton Loader (`.skeleton`)

Digunakan sebagai kerangka muat (placeholder loading) sebelum data asli selesai diambil dari penyimpanan lokal.

### Properti Visual
* **Warna Latar**: `var(--color-surface-strong)` (atau abu-abu transparan).
* **Animasi**: Denyut memudar (`shimmer` / `pulse` animation).
* **Varian**:
  - `Skeleton type="title"`: Tinggi `20px`, lebar bervariasi (`50%` s.d `70%`), radius `4px`.
  - `Skeleton type="text"`: Tinggi `14px`, lebar bervariasi (`40%` s.d `90%`), radius `4px`.
  - `Skeleton type="circle"`: Sisi sama panjang (lebar = tinggi), radius `var(--radius-full)`.
  - `Skeleton type="block"`: Tinggi sesuai parameter (misal: `60px`), radius `var(--radius-sm)` atau `var(--radius-md)`.

---

## 2. Empty State (`.empty-state`)

Dipanggil saat list data (Tasks, Habits, Notes) kosong atau filter pencarian tidak mengembalikan hasil.

### Komponen Struktur
1. **Icon Area** (`.empty-state__icon`): Emoji berukuran besar (misal: `📋`, `🌱`, `✓`) dengan font-size `48px` dan opacity `0.5`.
2. **Title** (`.empty-state__title`): Heading H3 (`var(--color-text)`), margin-bottom `8px`.
3. **Description** (`.empty-state__description`): Teks paragraf muted (`var(--color-muted)`), line-height `1.5`, margin-bottom `16px`.
4. **Call To Action (CTA)** (`.empty-state__cta`): Slot opsional untuk menaruh tombol Primary Button (misal: `+ Create First Habit`).

---

## 3. Toast Notifications (`.toast`)

Digunakan untuk memberikan konfirmasi keberhasilan/kegagalan aksi pengguna.

### Properti Visual
* **Posisi**: Melayang di sudut kanan bawah (`position: fixed; bottom: 24px; right: 24px;`).
* **Warna Aksen**:
  - Success: Border kiri `4px solid var(--color-success)`.
  - Error: Border kiri `4px solid var(--color-danger)`.
* **Masa Aktif**: Muncul instan dan memudar keluar setelah `3000ms`.

---

## 4. Button Variants (Tombol)

Semua tombol menggunakan transisi hover `0.15s`.

* **Primary Button** (`.btn-primary`):
  - Properti: `background: var(--color-primary); color: white; border: none; padding: 10px 18px; border-radius: var(--radius-sm); font-weight: 500; cursor: pointer;`
* **Secondary Button** (`.btn-secondary`):
  - Properti: `background: var(--color-surface-strong); border: 1px solid var(--color-border); color: var(--color-text); padding: 10px 18px; border-radius: var(--radius-sm); cursor: pointer;`
* **Action Button** (`.btn-action`):
  - Digunakan untuk tombol kecil emoji aksi di daftar task/habit (seperti edit `✏️` dan delete `🗑`).
  - Properti: `border: none; background: transparent; cursor: pointer; border-radius: var(--radius-full); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;`
  - Hover: Background sirkular samar `rgba(255, 255, 255, 0.08)`.

---

## 5. Input Field & Select Dropdown (`.form-input`, `.form-select`)

Seluruh kolom input formulir harus memiliki keterbacaan yang tinggi dan nyaman disentuh.

* **Dimensi**: Tinggi standar `44px` (touch target minimum), padding horizontal `14px`.
* **Visual**:
  - Border: `1px solid var(--color-border)`
  - Background: `var(--color-bg-deep)`
  - Radius: `var(--radius-md)` (sudut 18px melengkung khas LifeFlow)
  - Text Color: `var(--color-text)`
* **Status Fokus**: `outline: 2px solid var(--color-primary)` dengan offset outline ring untuk a11y.

---

## 6. Modal Container (`.modal`)

* **Backdrop Overlay**: `.modal` bertindak sebagai container tetap (`position: fixed; inset: 0; z-index: 2000; background: rgba(4, 11, 21, 0.85); backdrop-filter: blur(8px);`).
* **Content Area** (`.modal-content`):
  - Background: `var(--color-surface)`
  - Border: `1px solid var(--color-border)`
  - Radius: `var(--radius-lg)` (24px)
  - Shadow: `var(--shadow-lg)`
  - Max-width: `480px`
  - Margin: `10vh auto 0` (desktop) / `auto 16px 24px` (mobile bottom-sheet style).
