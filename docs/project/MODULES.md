# LifeFlow Module Registry

Dokumen ini adalah Single Source of Truth untuk melacak seluruh modul dalam project LifeFlow.

## Module Lifecycle

Setiap modul wajib melewati status berikut secara berurutan, tanpa boleh ada status yang dilompati:
`NOT_STARTED` ➔ `PLACEHOLDER` ➔ `IN_PROGRESS` ➔ `TESTING` ➔ `DONE` ➔ `MAINTENANCE` ➔ `ARCHIVED`

*(Catatan: Modul tidak boleh berstatus `DONE` jika kontennya masih berupa placeholder).*

## Modul Aplikasi

| Module | Status | Priority | Milestone | Depends On | Progress | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **App Shell (Dashboard)** | `DONE` | High | M1 - Foundation | None | 100% | Layout utama, Sidebar, BottomNav, Routing. |
| **UI Components** | `DONE` | High | M1 - Foundation | None | 100% | Desain dasar: Buttons, Cards, Inputs, Theme Toggle. |
| **Local Storage / DB Sync**| `DONE` | High | M1 & M13 | None | 100% | Persistence layer, Dexie IndexedDB asinkronus, Local-First. |
| **Task Management** | `DONE` | High | M2 - Task Management | M1 | 100% | CRUD Tasks, modal, priority, subtasks, deadline, zero-friction inline input. UAT Pass. |
| **Categories** | `DONE` | High | M2 - Task Management | M1 | 100% | CRUD kategori task, inline creation & editing. UAT Pass. |
| **Calendar** | `DONE` | Medium | M3 - Calendar | M2 | 100% | Tampilan task dan deadline secara visual bulanan. UAT Pass. |
| **Habit Tracker** | `DONE` | Medium | M4 & M7 | M1 | 100% | Grid kontribusi habit (Github-style), repeat rules, scheduling & tracking harian. UAT Pass. |
| **Notes Editor** | `DONE` | Low | M5 & M7 | M1 | 100% | Text editor markdown dua panel, debounced auto-save, pinning, metadata bar. UAT Pass. |
| **Product Polish** | `DONE` | High | M5.5 - M5.7 | M1-M5 | 100% | Design tokens, empty states, skeleton loading, toast system, accessibility, UI restoration. UAT Pass. |
| **Settings & Backup** | `DONE` | High | M6 - Settings | M5.7 | 100% | Pengaturan tema, JSON backup export/import, reset data konfirmasi ganda, modal legal. UAT Pass. |
| **Focus Timer & XP** | `DONE` | Low | M8 - Gamification | M1 | 100% | Pomodoro-style timer SVG ring, XP integration (+5 XP), confetti & sound effects. UAT Pass. |
| **Analytics / Reports** | `DONE` | Medium | M9 - Reports | M2, M4 | 100% | Ringkasan harian, visual tren produktivitas mingguan, habit consistency, share canvas image. UAT Pass. |
| **Authentication** | `DONE` | High | M10 - Auth | M9 | 100% | Firebase Auth Google login, avatar sync navbar & sidebar. UAT Pass. |
| **PWA & Offline** | `DONE` | High | M11 - PWA | M10 | 100% | Workbox service worker caching, offline fallback, manifest PWA installable. UAT Pass. |
| **AI Workspace** | `DONE` | Low | M7 - AI Workspace | M5, M2 | 100% | Ekstraksi tugas otomatis dari teks catatan menggunakan LLM & Local-First parser. UAT Pass. |
| **AI Companion & Retrieval** | `IN_PROGRESS` | High | M14 - AI Companion | M1-M5 | 0% | Chat assistant kontekstual (Q&A Tasks/Notes/Calendar) dengan Glassmorphism UI & deep linking. |
| **Team Collaboration**| `NOT_STARTED` | Low | M8 - Team Collaboration| M2 | 0% | Fitur sharing task dan workspace antar pengguna. |
