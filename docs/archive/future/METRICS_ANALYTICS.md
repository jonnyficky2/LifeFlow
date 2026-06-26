# Metrics & Analytics

## Purpose
Mendefinisikan metrik kesuksesan produk, Key Performance Indicators (KPI), dan event tracking apa saja yang perlu diukur untuk memahami perilaku pengguna (User Behavior).

## When To Activate
Saat aplikasi bersiap untuk rilis Beta atau Production ke pengguna nyata (real users), dan kita perlu data untuk membuktikan Product-Market Fit.

## Current Status
Belum diperlukan karena aplikasi masih dalam tahap development awal dan feedback masih bisa didapatkan secara kualitatif (langsung dari developer atau tester internal).

## Future Requirements
- Definisi North Star Metric (misal: Weekly Active Users atau Tasks Completed per User).
- Daftar tracking events utama (contoh: `task_created`, `note_summarized_by_ai`, `habit_checked`).
- Tools analitik yang digunakan (misal: PostHog, Mixpanel, Google Analytics).
- Kebijakan privasi terkait pelacakan data (Opt-in/Opt-out).

## Dependencies
- `active/product/PRD.md`
- `future/OBSERVABILITY.md`

## Activation Checklist
- [ ] MVP sudah mencapai tahap "Code Freeze" untuk fitur utama.
- [ ] Rencana rilis ke beta tester sudah dijadwalkan.
- [ ] Tool analytics sudah dipilih dan diintegrasikan ke codebase.
