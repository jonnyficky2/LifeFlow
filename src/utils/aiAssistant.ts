import type { Category, Habit, Note, Task } from '../types';

export interface AssistantReference {
  type: 'task' | 'note' | 'habit';
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  section: 'home' | 'tasks' | 'notes' | 'habit' | 'calendar';
}

export interface AssistantAnswer {
  reply: string;
  references: AssistantReference[];
  engine: 'local' | 'gemini';
}

export interface KnowledgeContext {
  categories: Category[];
  notes: Note[];
  habits?: Habit[];
}

/**
 * Normalisasi dan ekstraksi kata kunci pencarian dari kueri bahasa alami.
 */
function extractSearchKeywords(rawQuery: string): string[] {
  const clean = rawQuery
    .toLowerCase()
    .replace(/[?!.,;:"'()[\]{}]/g, ' ')
    .trim();

  // Kata-kata pengisi / stopwords percakapan
  const stopWords = new Set([
    'ada', 'nggak', 'tidak', 'ga', 'gak', 'apakah', 'apa', 'saja', 'tentang',
    'catatan', 'note', 'notes', 'task', 'tasks', 'tugas', 'pekerjaan',
    'kapan', 'jadwal', 'jadwalnya', 'deadline', 'deadlinenya', 'waktu', 'jam',
    'habit', 'habits', 'kebiasaan', 'rutinitas',
    'tolong', 'bisa', 'carikan', 'cari', 'lihat', 'cek', 'tampilkan',
    'punya', 'punyaku', 'saya', 'aku', 'gue', 'gua', 'dong', 'ya', 'sih', 'kah',
    'di', 'ke', 'dari', 'yang', 'dan', 'atau', 'dengan', 'untuk', 'ini', 'itu'
  ]);

  return clean
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 1 && !stopWords.has(w));
}

/**
 * Mencocokkan kata kunci ke teks dengan penanganan kata 1-karakter (misal: "Tugas A").
 */
function matchesKeyword(text: string, kw: string): boolean {
  if (!text) return false;
  if (kw.length === 1) {
    const regex = new RegExp(`(^|\\s|[_-])${kw}(\\s|$|[_-])`, 'i');
    return regex.test(text);
  }
  return text.toLowerCase().includes(kw);
}

/**
 * Ekstraksi seluruh tasks dari kategori menjadi flat array.
 */
function flattenTasks(categories: Category[]): { task: Task; categoryName: string }[] {
  const result: { task: Task; categoryName: string }[] = [];
  for (const cat of categories) {
    if (Array.isArray(cat.tasks)) {
      for (const t of cat.tasks) {
        result.push({ task: t, categoryName: cat.name });
      }
    }
  }
  return result;
}

/**
 * Local-First Rule-Based Knowledge Retrieval Engine.
 * Bekerja 100% offline, zero latency, mengamati Tasks, Notes, dan Habits.
 */
export function searchLocalKnowledge(query: string, context: KnowledgeContext): AssistantAnswer {
  const lowerQuery = query.toLowerCase().trim();
  const keywords = extractSearchKeywords(query);

  const flatTasks = flattenTasks(context.categories || []);
  const notes = context.notes || [];
  const habits = context.habits || [];

  const matchedTasks: { task: Task; categoryName: string; score: number }[] = [];
  const matchedNotes: { note: Note; score: number }[] = [];
  const matchedHabits: { habit: Habit; score: number }[] = [];

  const isAskingSchedule = /\b(?:kapan|jadwal|deadline|tanggal|jam|waktu)\b/i.test(lowerQuery);
  const isAskingNotesOnly = /\b(?:catatan|note|notes)\b/i.test(lowerQuery) && !/\b(?:task|tugas)\b/i.test(lowerQuery);
  const isAskingTasksOnly = /\b(?:task|tasks|tugas|kerjaan|todo)\b/i.test(lowerQuery) && !/\b(?:catatan|note)\b/i.test(lowerQuery);
  const isAskingHabitsOnly = /\b(?:habit|habits|kebiasaan|rutinitas)\b/i.test(lowerQuery);
  const isAskingSummary = /\b(?:semua|rekap|ringkasan|apa saja|daftar|overview|status)\b/i.test(lowerQuery);

  // 1. Scoring Tasks
  for (const { task, categoryName } of flatTasks) {
    let score = 0;
    const taskNameLower = task.name;
    const taskNoteLower = task.note || '';
    const catLower = categoryName;
    const tagsLower = (task.tags || []).join(' ');

    if (keywords.length === 0 && isAskingSummary) {
      if (!task.done) score += 1;
    } else {
      for (const kw of keywords) {
        if (matchesKeyword(taskNameLower, kw)) score += 5;
        if (matchesKeyword(catLower, kw)) score += 3;
        if (matchesKeyword(tagsLower, kw)) score += 3;
        if (matchesKeyword(taskNoteLower, kw)) score += 2;
      }
    }

    if (score > 0) {
      matchedTasks.push({ task, categoryName, score });
    }
  }

  // 2. Scoring Notes
  for (const note of notes) {
    let score = 0;
    const title = note.title;
    const content = note.content;

    if (keywords.length === 0 && isAskingSummary) {
      score += 1;
    } else {
      for (const kw of keywords) {
        if (matchesKeyword(title, kw)) score += 6;
        if (matchesKeyword(content, kw)) score += 3;
      }
    }

    if (score > 0) {
      matchedNotes.push({ note, score });
    }
  }

  // 3. Scoring Habits
  for (const habit of habits) {
    let score = 0;
    const name = habit.name;

    if (keywords.length === 0 && (isAskingHabitsOnly || isAskingSummary)) {
      score += 2;
    } else {
      for (const kw of keywords) {
        if (matchesKeyword(name, kw)) score += 5;
      }
    }

    if (score > 0) {
      matchedHabits.push({ habit, score });
    }
  }

  // Urutkan berdasarkan skor tertinggi
  matchedTasks.sort((a, b) => b.score - a.score);
  matchedNotes.sort((a, b) => b.score - a.score);
  matchedHabits.sort((a, b) => b.score - a.score);

  const references: AssistantReference[] = [];
  const replyParts: string[] = [];

  // Filter hasil berdasarkan intensi jika spesifik
  const filteredTasks = isAskingNotesOnly ? [] : matchedTasks.slice(0, 5);
  const filteredNotes = isAskingTasksOnly ? [] : matchedNotes.slice(0, 5);
  const filteredHabits = (isAskingNotesOnly || isAskingTasksOnly) ? [] : matchedHabits.slice(0, 3);

  // Buat referensi Tasks
  for (const { task, categoryName } of filteredTasks) {
    const statusText = task.done ? 'Selesai' : 'Pending';
    const deadlineText = task.deadline ? ` • Deadline: ${task.deadline}${task.time ? ` ${task.time}` : ''}` : '';
    references.push({
      type: 'task',
      title: task.name,
      subtitle: `[${categoryName}] ${statusText}${deadlineText}`,
      category: categoryName,
      section: 'tasks'
    });
  }

  // Buat referensi Notes
  for (const { note } of filteredNotes) {
    const excerpt = note.content.replace(/[#*`\n]/g, ' ').trim().slice(0, 60);
    references.push({
      type: 'note',
      id: note.id,
      title: note.title || 'Untitled Note',
      subtitle: excerpt ? `${excerpt}...` : 'Catatan kosong',
      section: 'notes'
    });
  }

  // Buat referensi Habits
  for (const { habit } of filteredHabits) {
    references.push({
      type: 'habit',
      id: habit.id,
      title: `${habit.icon || '🔥'} ${habit.name}`,
      subtitle: habit.time ? `Waktu: ${habit.time}` : 'Habit harian',
      section: 'habit'
    });
  }

  // Susun balasan bahasa alami
  if (references.length === 0) {
    const kwText = keywords.length > 0 ? ` terkait "${keywords.join(', ')}"` : '';
    return {
      reply: `Saya sudah memeriksa data Anda, namun belum menemukan catatan, tugas, atau jadwal${kwText}. Coba gunakan kata kunci yang lebih spesifik, atau Anda dapat menambahkannya terlebih dahulu.`,
      references: [],
      engine: 'local'
    };
  }

  const keywordLabel = keywords.length > 0 ? ` untuk "${keywords.join(' ')}"` : '';

  if (isAskingSchedule) {
    replyParts.push(`Berikut jadwal dan batas waktu yang ditemukan${keywordLabel}:`);
  } else if (isAskingNotesOnly) {
    replyParts.push(`Berikut catatan yang ditemukan${keywordLabel}:`);
  } else if (isAskingTasksOnly) {
    replyParts.push(`Berikut tugas yang ditemukan${keywordLabel}:`);
  } else {
    replyParts.push(`Ditemukan informasi yang relevan${keywordLabel}:`);
  }

  if (filteredTasks.length > 0) {
    const pendingCount = filteredTasks.filter(t => !t.task.done).length;
    const doneCount = filteredTasks.filter(t => t.task.done).length;
    const taskSummary = pendingCount > 0 
      ? `${filteredTasks.length} tugas (${pendingCount} pending, ${doneCount} selesai)` 
      : `${filteredTasks.length} tugas (semua selesai)`;
    replyParts.push(`• **Tugas:** ${taskSummary}.`);
  }

  if (filteredNotes.length > 0) {
    replyParts.push(`• **Catatan:** Ditemukan ${filteredNotes.length} catatan terkait.`);
  }

  if (filteredHabits.length > 0) {
    replyParts.push(`• **Habit:** Ditemukan ${filteredHabits.length} kebiasaan yang cocok.`);
  }

  replyParts.push(`\nSilakan klik salah satu kartu di bawah untuk membuka langsung data yang dimaksud.`);

  return {
    reply: replyParts.join('\n'),
    references,
    engine: 'local'
  };
}

/**
 * Gemini LLM Retrieval Engine.
 * Mengirim ringkasan context data ke model Gemini 1.5 Flash untuk penalaran natural.
 */
export async function queryGeminiWithContext(
  query: string,
  context: KnowledgeContext,
  apiKey: string
): Promise<AssistantAnswer> {
  const flatTasks = flattenTasks(context.categories || []);
  const notes = context.notes || [];
  const habits = context.habits || [];

  // Ringkas konteks data agar hemat token dan cepat
  const tasksSummary = flatTasks.map(({ task, categoryName }) => ({
    name: task.name,
    category: categoryName,
    status: task.done ? 'Done' : 'Pending',
    priority: task.priority,
    deadline: task.deadline ? `${task.deadline} ${task.time || ''}`.trim() : null,
    tags: task.tags?.length ? task.tags : undefined,
    note: task.note ? task.note.slice(0, 80) : undefined
  }));

  const notesSummary = notes.map(n => ({
    id: n.id,
    title: n.title || 'Untitled Note',
    deadline: n.deadline || null,
    excerpt: n.content.replace(/[#*`\n]/g, ' ').trim().slice(0, 120)
  }));

  const habitsSummary = habits.map(h => ({
    id: h.id,
    name: h.name,
    time: h.time || null
  }));

  const systemPrompt = `Anda adalah asisten pribadi LifeFlow (Personal OS Assistant).
Tugas Anda adalah menjawab pertanyaan pengguna tentang tugas (tasks), catatan (notes), jadwal (calendar/deadline), atau kebiasaan (habits) mereka berdasarkan data konteks pengguna yang diberikan di bawah ini.

Instruksi:
1. Jawab dengan ramah, ringkas, jelas, dan percaya diri dalam Bahasa Indonesia.
2. Jawab secara spesifik dengan merujuk pada nama task atau judul catatan yang ada di data pengguna.
3. Jika pengguna menanyakan jadwal/deadline, sebutkan tanggal dan waktunya secara presisi.
4. Jika tidak ada data yang cocok, katakan dengan sopan bahwa data tersebut belum tercatat.
5. Format keluaran WAJIB berupa JSON murni dengan skema:
{
  "reply": "Teks jawaban untuk pengguna...",
  "references": [
    {
      "type": "task" | "note" | "habit",
      "id": "id_jika_ada",
      "title": "Nama item",
      "subtitle": "Keterangan singkat, misal deadline atau status",
      "category": "Kategori jika task",
      "section": "tasks" | "notes" | "habit" | "calendar"
    }
  ]
}
Jangan gunakan block quote markdown atau teks pembuka lain. Kembalikan HANYA JSON.`;

  const payload = {
    userQuery: query,
    userData: {
      tasks: tasksSummary,
      notes: notesSummary,
      habits: habitsSummary
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: JSON.stringify(payload) }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(text);
    const reply = typeof parsed.reply === 'string' ? parsed.reply : '';
    const rawRefs = Array.isArray(parsed.references) ? parsed.references : [];

    const references: AssistantReference[] = rawRefs.map(r => ({
      type: (r.type === 'note' || r.type === 'habit' || r.type === 'task') ? r.type : 'task',
      id: typeof r.id === 'string' ? r.id : undefined,
      title: String(r.title || ''),
      subtitle: typeof r.subtitle === 'string' ? r.subtitle : undefined,
      category: typeof r.category === 'string' ? r.category : undefined,
      section: (['home', 'tasks', 'notes', 'habit', 'calendar'].includes(r.section) ? r.section : 'tasks') as AssistantReference['section']
    })).filter(r => r.title.length > 0);

    if (reply) {
      return {
        reply,
        references,
        engine: 'gemini'
      };
    }

    throw new Error('Invalid JSON structure from Gemini');
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Gemini Assistant query failed or timed out, falling back to local search:', err);
    return searchLocalKnowledge(query, context);
  }
}

/**
 * Unified Assistant Query API.
 * Menghubungkan secara otomatis antara Gemini LLM (bila API key ada) dan Local Matcher (offline/zero-latency).
 */
export async function askAssistant(
  query: string,
  context: KnowledgeContext,
  apiKey?: string
): Promise<AssistantAnswer> {
  if (apiKey && apiKey.trim()) {
    try {
      const geminiResult = await queryGeminiWithContext(query, context, apiKey.trim());
      if (geminiResult && geminiResult.reply) {
        return geminiResult;
      }
    } catch {
      // Fallback mulus ke lokal
    }
  }

  return searchLocalKnowledge(query, context);
}

