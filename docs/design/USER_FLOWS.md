# User Flows

## 1. Onboarding Flow (First Time User)
1. **Welcome Screen**: Penjelasan singkat fitur (Fast, Clean, AI-powered).
2. **Setup**: Meminta nama (untuk personalisasi dashboard).
3. **Template Selection**: "Are you a student?" -> Load template untuk 'University' (termasuk folder notes dan tag tasks).
4. **First Action**: Tooltip mengajak user membuat task pertama.
5. **Dashboard Landing**: User melihat dashboard dengan 1 task onboarding.

## 2. Quick Task Creation Flow
1. User menekan shortcut `Cmd/Ctrl + K` dari layar mana saja, atau tombol `+` di Dashboard.
2. Muncul **Command Menu / Quick Add Modal**.
3. User mengetik: "Kumpulkan tugas RPL besok jam 12 siang"
4. AI memproses natural language, meng-extract:
   - Task: Kumpulkan tugas RPL
   - Due: Besok 12:00
   - Tag: Academic (otomatis)
5. User menekan `Enter`.
6. Toast notification: "Task added to Academic". Modal tertutup.

## 3. Note Taking & AI Summarization
1. User membuka modul **Notes**.
2. User membuat note baru dan mencatat materi rapat/kuliah secara acak.
3. User menekan tombol **"AI: Clean & Summarize"**.
4. Loading state (skeleton over text).
5. AI merapikan format, membuat bullet points, dan menambahkan action items (tasks).
6. User mengklik "Add action items to Tasks".
7. Tasks baru otomatis dibuat.

## 4. Habit Tracking Flow (Daily Routine)
1. User membuka app di pagi hari (landing di Dashboard).
2. Di bagian widget **Today's Habits**, terdapat list "Minum 2L air", "Baca 10 halaman", "Coding 1 jam".
3. User mengklik checkbox "Minum 2L air".
4. Animasi micro-interaction sukses (misal: ceklis berubah hijau dengan efek pop kecil).
5. Streak ter-update dari 4 hari menjadi 5 hari.
