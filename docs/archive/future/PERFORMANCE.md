# Performance Benchmarks

## Purpose
Menentukan standar performa aplikasi (Load time, Time to Interactive, API Response Time) untuk memastikan aplikasi tetap terasa "Ringan dan Cepat" sesuai prinsip utama LifeFlow.

## When To Activate
Saat aplikasi mulai kaya fitur dan terasa "berat", atau ketika bundle size aplikasi frontend membengkak secara signifikan akibat penambahan library baru.

## Current Status
Belum menjadi prioritas kritis karena codebase masih kecil, fitur masih sedikit, dan interaksi masih terasa instan secara default.

## Future Requirements
- Target Core Web Vitals (LCP, FID, CLS).
- Target API Response Time (misal: p95 < 200ms).
- Aturan maksimal Bundle Size untuk frontend.
- Strategi lazy loading, image optimization, dan pagination untuk list Tasks/Notes.

## Dependencies
- `active/design/DESIGN_PRINCIPLES.md`
- `future/OBSERVABILITY.md`

## Activation Checklist
- [ ] Fitur utama sudah lengkap (feature-complete) untuk versi MVP.
- [ ] Audit Lighthouse menunjukkan skor di bawah 85 pada kategori Performance.
- [ ] Load aplikasi di network 3G buatan (throttling) memakan waktu lebih dari 3 detik.
