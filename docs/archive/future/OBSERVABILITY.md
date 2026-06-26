# Observability & Monitoring

## Purpose
Mendokumentasikan sistem log, monitoring, dan alerting untuk melacak kesehatan (health) aplikasi secara real-time dan mempercepat proses debugging di Production.

## When To Activate
Saat aplikasi sudah berada di tangan banyak pengguna asli dan sistem tidak boleh down tanpa sepengetahuan tim developer (High Availability required).

## Current Status
Masih menggunakan pengecekan manual atau sekadar melihat log console lokal. Downtime saat ini tidak menyebabkan kerugian bisnis atau churn yang masif.

## Future Requirements
- Alat pemantauan error yang akan digunakan (misal: Sentry, LogRocket, Datadog).
- Standar format loging (Structured Logging).
- Definisi Alerting (misal: kirim notifikasi ke Slack/Discord jika ada 50 error dalam 1 menit).
- Monitoring Uptime & Server Health Checks.

## Dependencies
- `future/DEPLOYMENT.md`
- `active/engineering/ARCHITECTURE.md`

## Activation Checklist
- [ ] Aplikasi sudah rilis secara publik (Public Release).
- [ ] Tim membutuhkan cara untuk mengetahui error di sisi klien (frontend crash) tanpa menunggu laporan user.
- [ ] Infrastruktur production sudah berjalan stabil.
