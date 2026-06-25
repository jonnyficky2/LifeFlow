# Deployment Strategy

## Purpose
Mendokumentasikan secara presisi bagaimana aplikasi di-build, di-test, dan dirilis ke environment Production, Staging, dan Development.

## When To Activate
Saat aplikasi perlu di-host secara live di server, menggunakan pipeline Continuous Integration / Continuous Deployment (CI/CD), dan memiliki environment yang terpisah (misal: staging.lifeflow.app dan lifeflow.app).

## Current Status
Aplikasi saat ini masih dijalankan di local environment (`localhost`) atau menggunakan auto-deployment sederhana seperti Vercel/Netlify tanpa pipeline multi-stage.

## Future Requirements
- Topologi infrastruktur (Cloud provider: AWS/GCP/Vercel/Render).
- CI/CD workflow (GitHub Actions / GitLab CI config).
- Environment Variables management (Secrets).
- Rollback strategy jika terjadi kegagalan deployment.

## Dependencies
- `future/TESTING_STRATEGY.md`
- `active/engineering/ARCHITECTURE.md`

## Activation Checklist
- [ ] Domain utama sudah dibeli dan siap di-mapping.
- [ ] Database production terpisah sudah disiapkan.
- [ ] Skrip build aplikasi sudah berjalan sukses tanpa intervensi manual.
