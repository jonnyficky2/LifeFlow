# Testing Strategy

## Purpose
Menetapkan standar, framework, dan pendekatan pengujian perangkat lunak (Unit, Integration, E2E) untuk memastikan kualitas dan stabilitas aplikasi LifeFlow sebelum rilis.

## When To Activate
Saat basis kode (codebase) mulai kompleks, beberapa developer berkontribusi, atau saat bug regresi mulai sering muncul sehingga memperlambat kecepatan rilis.

## Current Status
Belum diperlukan karena saat ini fokus utamanya adalah kecepatan iterasi (shipping fast) untuk mencari bentuk produk yang tepat. Overhead penulisan test akan memperlambat pivot fitur.

## Future Requirements
- Pemilihan testing framework (misal: Jest, Vitest, Cypress, Playwright).
- Standar coverage minimal (misal: 70% untuk core utilities).
- Definisi critical paths yang wajib memiliki E2E testing (Login, Create Task, Save Note).
- Setup CI/CD pipeline untuk automated testing.

## Dependencies
- `future/DEPLOYMENT.md`
- `active/project/DEFINITION_OF_DONE.md`

## Activation Checklist
- [ ] Arsitektur dan UI/UX sudah cukup stabil dan jarang berubah drastis.
- [ ] Ditemukan minimal 2 kasus bug regresi yang memakan waktu perbaikan lama.
- [ ] Tim sepakat untuk memulai disiplin Test-Driven Development (TDD) pada core logic.
