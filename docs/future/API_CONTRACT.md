# API Contract

## Purpose
Mendokumentasikan secara detail semua endpoint REST/GraphQL, struktur request/response, autentikasi, dan status code antara frontend dan backend.

## When To Activate
Saat arsitektur frontend dan backend dipisah secara definitif (Client-Server architecture) dan dibutuhkan kontrak yang jelas agar developer frontend dan backend dapat bekerja secara paralel.

## Current Status
Belum diperlukan karena proyek masih berfokus pada iterasi MVP, pembentukan UI/UX, atau masih menggunakan mock data/local storage/BaaS sederhana.

## Future Requirements
- OpenAPI / Swagger Specification.
- Format JSON request dan response untuk module: Tasks, Notes, Habits.
- Authentication/Authorization flow (JWT/Session payload).
- Standar penanganan error (Error response schema).

## Dependencies
- `active/engineering/ARCHITECTURE.md`
- `active/engineering/DATA_MODEL.md`

## Activation Checklist
- [ ] Backend tech stack telah diputuskan dan diinisialisasi.
- [ ] Database schema MVP sudah stabil.
- [ ] Frontend siap dihubungkan dengan real API.
- [ ] Autentikasi mulai diimplementasikan.
