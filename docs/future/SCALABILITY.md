# Scalability Plan

## Purpose
Merencanakan bagaimana arsitektur aplikasi akan diskalakan untuk menangani lonjakan jumlah pengguna, volume data notes/tasks, dan beban hit terhadap layanan AI.

## When To Activate
Saat pengguna aktif harian (DAU) mulai tumbuh secara eksponensial, atau ukuran database membengkak sehingga query mulai terasa lambat.

## Current Status
Fokus saat ini adalah Product-Market Fit. Desain aplikasi difokuskan pada penggunaan pribadi (single-tenant feel) dan traffic saat ini masih sangat kecil sehingga belum menyentuh batas kapabilitas server standar.

## Future Requirements
- Strategi sharding atau partisi database (terutama untuk tabel Tasks dan Notes).
- Implementasi sistem Caching (Redis/Memcached) untuk dashboard query.
- Skalabilitas API eksternal (mengatur rate limits dan queuing untuk request LLM/AI).
- Load balancing dan auto-scaling rules.

## Dependencies
- `future/PERFORMANCE.md`
- `future/METRICS_ANALYTICS.md`

## Activation Checklist
- [ ] Penggunaan CPU/Memory server utama mencapai > 70% secara konsisten.
- [ ] Database storage melebihi batas tier hosting saat ini.
- [ ] Keterlambatan respons API (Latency) mulai dikeluhkan pengguna.
