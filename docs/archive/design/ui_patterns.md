# UI Patterns & Interaction Models

## 1. Command Palette (Omnibar)
* **Trigger**: `Cmd/Ctrl + K`
* **Pattern**: Modal input terpusat untuk navigasi cepat (Go to Tasks, Go to Settings) dan Quick Add (Create Note, Create Task).
* **Why**: Target user (Mahasiswa Sistem Informasi) sangat familiar dengan keyboard shortcuts (VS Code style). Ini mempercepat navigasi dan entri data tanpa menyentuh mouse.

## 2. Natural Language Input (NLI)
* **Pattern**: Form input tidak perlu banyak dropdown (date picker, project picker). User cukup mengetik "Meeting with dosen tomorrow 10am #skripsi".
* **Why**: Mengurangi friction. NLI membuat entri tugas 3x lebih cepat.

## 3. Two-Pane Layout untuk Notes & Settings
* **Pattern**: Sidebar di sebelah kiri (list/menu), konten detail di sebelah kanan.
* **Why**: Memaksimalkan penggunaan layar lebar pada desktop/tablet, dan mudah diubah menjadi stack view di mobile (Responsive).

## 4. Skeleton Loading
* **Pattern**: Menggunakan bentuk geometri abu-abu dengan animasi pulse (shimmer) saat mengambil data.
* **Why**: Terasa lebih profesional dan mengurangi persepsi waktu tunggu dibandingkan spinner muter biasa.

## 5. Optimistic UI Updates
* **Pattern**: Saat user mencentang habit atau task, UI langsung merespon sebagai "Selesai" seketika, sementara API call berjalan di background. Jika gagal, state di-revert dan muncul toast error.
* **Why**: Menciptakan kesan aplikasi yang "super fast" dan "snappy" (sesuai prinsip produk).

## 6. Progressive Disclosure
* **Pattern**: Menyembunyikan opsi lanjutan (seperti subtasks, recurring rules, tags) di dalam menu "More options" atau baru muncul saat di-hover/di-klik.
* **Why**: Menjaga antarmuka tetap clean, minimalist, dan tidak cluttered untuk penggunaan harian.