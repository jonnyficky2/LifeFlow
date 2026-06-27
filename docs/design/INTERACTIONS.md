# UX Interactions, Motion, & Transitions

Dokumen ini mendefinisikan standar perilaku interaksi antarmuka (UX Interactions), durasi transisi (Motion), serta aksesibilitas kontrol keyboard di LifeFlow.

---

## 1. Transitions & Motion Timing (Aturan Gerak)

Semua animasi di LifeFlow harus terasa responsif, natural, dan tidak memperlambat produktivitas pengguna. Kami menggunakan aturan durasi dan kurva bezier berikut:

| Nama Transisi | Durasi | Kurva Bezier | Penggunaan |
| --- | --- | --- | --- |
| **Instant / Micro** | `0.15s` | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover state tombol, checkbox check, tag hover |
| **Smooth / Slide** | `0.25s` | `cubic-bezier(0.25, 0.8, 0.25, 1)` | Transisi menu tab, transisi modal fade-in |
| **Drawer / Sidebar** | `0.30s` | `cubic-bezier(0.25, 0.8, 0.25, 1)` | Sliding drawer sidebar mobile |

*Aturan*: Selalu gunakan nilai kurva bezier standar di atas daripada kurva default peramban (`ease` atau `linear`) agar pergerakan terlihat premium.

---

## 2. Pustaka Interaksi Utama

### A. Sidebar Drawer (Mobile)
* **Pemicu**: Pengguna menekan tombol hamburger di navbar mobile atau mengklik overlay gelap di luar area sidebar.
* **Perilaku**:
  - Area menu bergeser dari posisi kiri (`left: -288px`) menuju (`left: 0`) dengan durasi `0.30s`.
  - Secara bersamaan, overlay gelap (`.sidebar-overlay`) memudar masuk (`opacity` berubah dari `0` menjadi `1`, `visibility` berubah menjadi `visible`).
  - **Z-Index**: `.app-sidebar` harus memiliki `z-index: 1500` (berada di atas `.sidebar-overlay` yang memiliki `z-index: 1400`) agar menu tetap aktif dapat ditekan.

### B. Modal Dialog Overlay (Popup)
* **Pemicu**: Menekan tombol buat item, tombol edit, atau shortcut.
* **Perilaku**:
  - Backdrop modal memudar masuk (`opacity: 1` dengan `backdrop-filter: blur(8px)`).
  - Kotak dialog modal bergeser naik secara vertikal dari `scale(0.95)` ke `scale(1)` dengan durasi `0.25s`.
  - Fokus keyboard otomatis diarahkan ke input teks pertama (auto-focus).

### C. Checkbox & Switch (Checklist State)
* **Pemicu**: Klik checkbox pada task item atau habit grid cell.
* **Perilaku**:
  - Item yang dicentang langsung memicu teks judul mendapatkan gaya coretan (`text-decoration: line-through`) dan opacity turun menjadi `0.6` secara instan.
  - Untuk habit grid, cell berganti warna ke `--color-success` dengan efek transisi micro `0.15s`.
  - Menyelesaikan semua habit hari ini memicu animasi confetti sirkular di tengah layar selama `1.5s`.

---

## 3. Keyboard Navigation & Accessibility (A11y)

LifeFlow mendukung navigasi keyboard penuh untuk aksesibilitas pengguna:

* **Focus States Outline**:
  - Pengguna yang menavigasi menggunakan tombol `Tab` akan melihat outline indikator fokus yang tebal dan jelas.
  - Aturan CSS:
    ```css
    button:focus-visible,
    a:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible,
    [tabindex]:focus-visible {
      outline: 2px solid var(--color-primary) !important;
      outline-offset: 2px !important;
    }
    ```
* **Escape Key Dismissal**:
  - Menekan tombol `Escape` (`Esc`) dari area mana pun akan langsung menutup modal aktif (`TaskModal`) atau sidebar laci mobile yang sedang terbuka.

---

## 4. Scrollbar Styling (Gaya Gulir)

Guliran halaman dan panel (seperti Notes list, Habit grid, dan Tasks Kanban) menggunakan gaya gulir minimalis agar tidak merusak kerapihan visual:

```css
/* Scrollbar kustom untuk peramban Webkit */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.4);
}
```
