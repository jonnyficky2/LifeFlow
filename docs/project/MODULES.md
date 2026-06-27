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
| **Local Storage Sync** | `DONE` | High | M1 - Foundation | None | 100% | AppContext, persistence logic. |
| **Task Management** | `TESTING` | High | M2 - Task Management | M1 | 95% | CRUD Tasks, modal, priority, subtasks, deadline. Menunggu UAT. |
| **Categories** | `TESTING` | High | M2 - Task Management | M1 | 95% | CRUD kategori task. Menunggu UAT. |
| **Calendar** | `PLACEHOLDER` | Medium | M3 - Calendar | M2 | 0% | Tampilan task dan deadline secara visual bulanan. |
| **Habit Tracker** | `PLACEHOLDER` | Medium | M4 - Habit Tracker | M1 | 0% | Grid kontribusi habit (Github-style) & tracking harian. |
| **Notes Editor** | `PLACEHOLDER` | Low | M5 - Notes | M1 | 0% | Text editor markdown untuk pencatatan harian. |
| **Product Polish** | `NOT_STARTED` | High | M5.5 - Product Polish | M1-M5 | 0% | Peningkatan kualitas, konsistensi UI/UX, dan stabilitas. |
| **Analytics / Reports** | `PLACEHOLDER` | Low | M6 - Analytics | M2, M4 | 0% | Tinjauan produktivitas bulanan. |
| **Focus Timer** | `PLACEHOLDER` | Low | M6 - Analytics | M1 | 0% | Pomodoro-style timer terhubung ke task. |
| **AI Workspace** | `NOT_STARTED` | Low | M7 - AI Workspace | M5, M2 | 0% | Ekstraksi tugas otomatis dari teks catatan menggunakan LLM. |
| **Team Collaboration**| `NOT_STARTED` | Low | M8 - Team Collaboration| M2 | 0% | Fitur sharing task dan workspace antar pengguna. |
