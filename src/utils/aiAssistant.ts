import type { Category, Habit, Note, Task } from '../types';

const GEMINI_MODEL = 'gemini-3.8-flash';
const GEMINI_FALLBACK_MODEL = 'gemini-3.5-flash-lite';

async function requestGemini(
  apiKey: string,
  payload: unknown,
  signal: AbortSignal
): Promise<Response> {
  const send = (model: string) => fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal
    }
  );

  const response = await send(GEMINI_MODEL);
  return response.status === 503 ? send(GEMINI_FALLBACK_MODEL) : response;
}

export interface AssistantReference {
  type: 'task' | 'note' | 'habit';
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  section: 'home' | 'tasks' | 'notes' | 'habit' | 'calendar';
}

export type AssistantActionType = 'create_task' | 'update_task' | 'set_task_done' | 'move_task' | 'create_note' | 'update_note' | 'create_habit';

export interface AssistantAction {
  type: AssistantActionType;
  payload: {
    taskName: string;
    categoryName?: string;
    targetCategoryName?: string;
    time?: string;
    deadline?: string;
    priority?: 'low' | 'medium' | 'high';
    done?: boolean;
    note?: string;
  };
}

export interface AssistantAnswer {
  reply: string;
  references: AssistantReference[];
  engine: 'local' | 'gemini';
  intent: AssistantIntent;
  actions?: AssistantAction[];
}

export interface KnowledgeContext {
  categories: Category[];
  notes: Note[];
  habits?: Habit[];
}

export type AssistantIntent = 'greeting' | 'tasks' | 'notes' | 'habits' | 'calendar' | 'lifeFlow' | 'general';

export interface AssistantConversationTurn {
  role: 'user' | 'assistant';
  text: string;
  intent: AssistantIntent;
  references?: AssistantReference[];
}

/**
 * Normalisasi dan ekstraksi kata kunci pencarian dari kueri bahasa alami.
 */
function extractSearchKeywords(rawQuery: string): string[] {
  const clean = rawQuery
    .toLowerCase()
    .replace(/\b(?:hari\s+ini|today)\b/g, ' ')
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
    'aja', 'daftar', 'list', 'semua', 'semuanya',
    'halo', 'hai', 'hi', 'hey', 'hello', 'kabar', 'harus', 'kerjakan', 'dikerjakan',
    'show', 'me', 'my', 'all', 'please', 'what', 'which', 'is', 'are', 'do', 'does', 'the', 'of', 'about',
    'i', 'have', 'can', 'you', 'give', 'mau', 'nanya', 'tanya', 'bertanya', 'boleh', 'coba',
    'detail', 'detailnya', 'rincian', 'rincianya', 'info', 'informasi', 'yang', 'mana', 'ingin', 'ketahui',
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

function getGreetingAnswer(): AssistantAnswer {
  return {
    reply: 'Halo! Saya Jofi AI, asisten Anda di LifeFlow. Saya bisa membantu tugas, catatan, jadwal, dan habit.',
    references: [],
    engine: 'local',
    intent: 'greeting'
  };
}

function isGeneralKnowledgeQuestion(query: string): boolean {
  const asksForExplanation = /\b(?:apa\s+itu|jelaskan|definisi|pengertian|arti|what\s+is|define|explain|how\s+to)\b/i.test(query);
  const asksAboutUserData = /\b(?:tugas|task|catatan|note|habit|jadwal|deadline)\s+(?:saya|aku|gue|gua|my|milikku)\b|\b(?:my\s+(?:tasks?|notes?|habits?|schedule)|data\s+saya)\b/i.test(query);
  return asksForExplanation && !asksAboutUserData;
}

function getLifeFlowIntent(
  query: string,
  references: AssistantReference[],
  previousTopic?: AssistantConversationTurn,
  isFollowUp = false
): AssistantIntent {
  if (isFollowUp && previousTopic) return previousTopic.intent;
  if (/\b(?:catatan|note|notes)\b/i.test(query)) return 'notes';
  if (/\b(?:habit|habits|kebiasaan|rutinitas)\b/i.test(query)) return 'habits';
  if (/\b(?:kalender|calendar|jadwal|deadline|hari\s+ini|today)\b/i.test(query)) return 'calendar';
  if (/\b(?:task|tasks|tugas|pekerjaan|kerjaan|todo)\b/i.test(query)) return 'tasks';
  const reference = references[0];
  if (reference?.type === 'task') return 'tasks';
  if (reference?.type === 'note') return 'notes';
  if (reference?.type === 'habit') return 'habits';
  return 'lifeFlow';
}

function isGreeting(query: string): boolean {
  return /^(?:halo|hai|hi|hey|hello|apa\s+kabar|how\s+are\s+you|what'?s\s+up|selamat\s+(?:pagi|siang|sore|malam)|good\s+(?:morning|afternoon|evening))(?:\s+apa\s+kabar)?[!.?\s]*$/i.test(query.trim());
}

function getBroadTopic(query: string): 'tasks' | 'notes' | 'habits' | 'calendar' | null {
  if (extractSearchKeywords(query).length > 0) return null;
  if (/\b(?:task|tasks|tugas|pekerjaan|kerjaan|todo)\b/i.test(query)) return 'tasks';
  if (/\b(?:catatan|note|notes)\b/i.test(query)) return 'notes';
  if (/\b(?:habit|habits|kebiasaan|rutinitas)\b/i.test(query)) return 'habits';
  if (/\b(?:kalender|calendar|jadwal|deadline)\b/i.test(query)) return 'calendar';
  return null;
}

function answerBroadTopic(topic: 'tasks' | 'notes' | 'habits' | 'calendar', context: KnowledgeContext): AssistantAnswer {
  const taskRows = flattenTasks(context.categories || []);
  const taskList = topic === 'calendar'
    ? taskRows.filter(({ task }) => Boolean(task.deadline)).sort((a, b) => a.task.deadline.localeCompare(b.task.deadline))
    : taskRows.sort((a, b) => Number(a.task.done) - Number(b.task.done));
  const notes = context.notes || [];
  const habits = context.habits || [];
  const topicData = topic === 'tasks' || topic === 'calendar' ? taskList : topic === 'notes' ? notes : habits;
  const total = topicData.length;
  const shown = topicData.slice(0, 5);

  const references: AssistantReference[] = topic === 'tasks' || topic === 'calendar'
    ? (shown as typeof taskRows).map(({ task, categoryName }) => ({
      type: 'task',
      title: task.name,
      subtitle: `[${categoryName}] ${task.done ? 'Selesai' : 'Pending'} • Prioritas ${task.priority || 'low'}${task.deadline ? ` • Deadline: ${task.deadline}${task.time ? ` ${task.time}` : ''}` : ''}`,
      category: categoryName,
      section: 'tasks'
    }))
    : topic === 'notes'
      ? (shown as typeof notes).map(note => ({
        type: 'note',
        id: note.id,
        title: note.title || 'Untitled Note',
        subtitle: note.content.replace(/[#*`\n]/g, ' ').trim().slice(0, 60) || 'Catatan kosong',
        section: 'notes'
      }))
      : (shown as typeof habits).map(habit => ({
        type: 'habit',
        id: habit.id,
        title: `${habit.icon || '🔥'} ${habit.name}`,
        subtitle: habit.time ? `Waktu: ${habit.time}` : 'Habit harian',
        section: 'habit'
      }));

  const topicName = topic === 'tasks' ? 'tugas' : topic === 'notes' ? 'catatan' : topic === 'habits' ? 'habit' : 'jadwal';
  const intent: AssistantIntent = topic;
  const reply = total === 0
    ? `Belum ada ${topicName} yang tercatat. Mau saya bantu mencari hal lain?`
    : `${total > 5 ? `Ada ${total} ${topicName}; berikut 5 yang paling relevan. ` : `Ada ${total} ${topicName}. `}Detail ${topicName === 'tugas' ? 'tugas' : topicName} mana yang ingin Anda ketahui?`;

  return { reply, references, engine: 'local', intent };
}

function getRequestedPriority(query: string): 'high' | 'medium' | 'low' | null {
  if (/\b(?:prioritas\s+tinggi|high\s+priority|prioritas\s+high)\b/i.test(query)) return 'high';
  if (/\b(?:prioritas\s+sedang|medium\s+priority|prioritas\s+medium)\b/i.test(query)) return 'medium';
  if (/\b(?:prioritas\s+rendah|low\s+priority|prioritas\s+low)\b/i.test(query)) return 'low';
  return null;
}

function answerTaskPriority(priority: 'high' | 'medium' | 'low', context: KnowledgeContext): AssistantAnswer {
  const matches = flattenTasks(context.categories || [])
    .filter(({ task }) => task.priority === priority)
    .sort((a, b) => Number(a.task.done) - Number(b.task.done));
  const shown = matches.slice(0, 5);
  const references: AssistantReference[] = shown.map(({ task, categoryName }) => ({
    type: 'task',
    title: task.name,
    subtitle: `[${categoryName}] ${task.done ? 'Selesai' : 'Pending'} • Prioritas ${priority}${task.deadline ? ` • Deadline: ${task.deadline}${task.time ? ` ${task.time}` : ''}` : ''}`,
    category: categoryName,
    section: 'tasks'
  }));
  const priorityName = priority === 'high' ? 'tinggi' : priority === 'medium' ? 'sedang' : 'rendah';
  const reply = matches.length === 0
    ? `Saya belum menemukan tugas dengan prioritas ${priorityName}. Tugas lain mana yang ingin Anda bahas?`
    : `${matches.length > 5 ? `Ada ${matches.length} tugas berprioritas ${priorityName}; berikut 5 yang paling relevan. ` : `Ada ${matches.length} tugas berprioritas ${priorityName}. `}Detail tugas mana yang ingin Anda ketahui?`;
  return { reply, references, engine: 'local', intent: 'tasks' };
}

function answerTaskDetails(task: Task, categoryName: string): AssistantAnswer {
  const priority = task.priority === 'high' ? 'tinggi' : task.priority === 'medium' ? 'sedang' : 'rendah';
  const details = [
    `Kategori: ${categoryName}`,
    `Status: ${task.done ? 'selesai' : 'pending'}`,
    `Prioritas: ${priority}`,
    task.deadline ? `Deadline: ${task.deadline}${task.time ? ` pukul ${task.time}` : ''}` : '',
    task.location ? `Lokasi: ${task.location}` : '',
    task.note ? `Catatan: ${task.note}` : '',
    task.subtasks?.length ? `Subtask: ${task.subtasks.map(subtask => `${subtask.done ? '✓' : '○'} ${subtask.name}`).join(', ')}` : ''
  ].filter(Boolean);

  return {
    reply: `Berikut detail tugas ${task.name}. ${details.join('. ')}.`,
    references: [{
      type: 'task',
      title: task.name,
      subtitle: `[${categoryName}] ${task.done ? 'Selesai' : 'Pending'} • Prioritas ${priority}${task.deadline ? ` • Deadline: ${task.deadline}${task.time ? ` ${task.time}` : ''}` : ''}`,
      category: categoryName,
      section: 'tasks'
    }],
    engine: 'local',
    intent: 'tasks'
  };
}

function getTaskListIndex(query: string): number | null {
  const match = query.match(/\b(?:yang(?:\s+ke)?|ke|nomor|the|number)?\s*(pertama|kedua|ketiga|keempat|kelima|first|second|third|[1-5])\b/i);
  if (!match) return null;
  const ordinals: Record<string, number> = { pertama: 1, kedua: 2, ketiga: 3, keempat: 4, kelima: 5, first: 1, second: 2, third: 3 };
  return Number(ordinals[match[1].toLowerCase()] || match[1]);
}

function getLifeFlowHistory(history: AssistantConversationTurn[]): AssistantConversationTurn[] {
  return history.filter(turn => turn.intent !== 'general' && turn.intent !== 'greeting').slice(-8);
}

function getGeneralHistory(history: AssistantConversationTurn[]): AssistantConversationTurn[] {
  return history.filter(turn => turn.intent === 'general').slice(-8);
}

function getLocalTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getLocalTomorrowDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getLocalDayAfterTomorrowDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function extractTimeFromText(input: string): { time: string; textWithoutTime: string } | null {
  // 1. (jam|pukul|at)\s*(\d{1,2})(?:[:.](\d{2}))?\s*(pagi|siang|sore|malam|am|pm)?
  const pattern1 = /\b(?:jam|pukul|at)\s*(\d{1,2})(?:[:.](\d{2}))?\s*(pagi|siang|sore|malam|am|pm)?\b/i;
  const match1 = input.match(pattern1);
  if (match1) {
    let hour = parseInt(match1[1], 10);
    const minute = match1[2] ? parseInt(match1[2], 10) : 0;
    const period = match1[3]?.toLowerCase();

    if (period === 'malam' && hour < 12) hour += 12;
    else if (period === 'siang' && hour < 12 && hour !== 12) hour += 12;
    else if (period === 'sore' && hour < 12) hour += 12;
    else if (period === 'pm' && hour < 12) hour += 12;
    else if (period === 'am' && hour === 12) hour = 0;

    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const textWithoutTime = input.replace(pattern1, ' ').trim();
    return { time: timeStr, textWithoutTime };
  }

  // 2. Bare time like 09:30 or 14.00
  const pattern2 = /\b(\d{1,2})[:.](\d{2})\b/;
  const match2 = input.match(pattern2);
  if (match2) {
    const hour = parseInt(match2[1], 10);
    const minute = parseInt(match2[2], 10);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const textWithoutTime = input.replace(pattern2, ' ').trim();
      return { time: timeStr, textWithoutTime };
    }
  }

  return null;
}

function extractDeadlineFromText(input: string): { deadline: string; textWithoutDeadline: string } | null {
  if (/\b(?:besok|tomorrow)\b/i.test(input)) {
    return {
      deadline: getLocalTomorrowDate(),
      textWithoutDeadline: input.replace(/\b(?:besok|tomorrow)\b/gi, ' ').trim()
    };
  }
  if (/\b(?:lusa)\b/i.test(input)) {
    return {
      deadline: getLocalDayAfterTomorrowDate(),
      textWithoutDeadline: input.replace(/\b(?:lusa)\b/gi, ' ').trim()
    };
  }
  if (/\b(?:hari\s+ini|today)\b/i.test(input)) {
    return {
      deadline: getLocalTodayDate(),
      textWithoutDeadline: input.replace(/\b(?:hari\s+ini|today)\b/gi, ' ').trim()
    };
  }
  // Support: "tanggal 18 november" / "18 november"
  const monthMatch = input.match(/\b(?:tanggal\s+)?(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\b/i);
  if (monthMatch) {
    const day = parseInt(monthMatch[1], 10);
    const monthName = monthMatch[2].toLowerCase();
    const monthMap: Record<string, number> = {
      januari: 1,
      februari: 2,
      maret: 3,
      april: 4,
      mei: 5,
      juni: 6,
      juli: 7,
      agustus: 8,
      september: 9,
      oktober: 10,
      november: 11,
      desember: 12
    };
    const month = monthMap[monthName];
    if (month) {
      const year = new Date().getFullYear();
      const deadline = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return {
        deadline,
        textWithoutDeadline: input.replace(monthMatch[0], ' ').trim()
      };
    }
  }

  const isoMatch = input.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (isoMatch) {
    return {
      deadline: isoMatch[1],
      textWithoutDeadline: input.replace(isoMatch[0], ' ').trim()
    };
  }
  return null;
}

function extractCategoryFromText(input: string): { category: string; textWithoutCategory: string } | null {
  const catRegex = /\b(?:di\s+kategori|ke\s+kategori|kategori|in\s+category|to\s+category)\s+([a-zA-Z0-9_\-\s]+?)(?=\s+(?:jam|pukul|deadline|hari|besok|$))/i;
  const match = input.match(catRegex);
  if (match) {
    const category = match[1].trim();
    const textWithoutCategory = input.replace(match[0], ' ').trim();
    return { category, textWithoutCategory };
  }
  return null;
}

function cleanTaskTargetName(raw: string): string {
  return raw
    .replace(/^["'“”]|["'“”]$/g, '')
    .replace(/^(?:task|tugas)\s+/i, '')
    .replace(/\s+(?:ke|di)\s+kategori.*$/i, '')
    .replace(/\s+(?:untuk|pada|di)\s+(?:jam|pukul).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findExistingTask(categories: Category[], targetName: string): {
  task: Task;
  categoryName: string;
} | null {
  const norm = targetName.trim().toLowerCase();
  if (!norm) return null;

  // 1. Exact match (case-insensitive)
  for (const cat of categories) {
    if (!cat.tasks) continue;
    for (const task of cat.tasks) {
      if (task.name.trim().toLowerCase() === norm) {
        return { task, categoryName: cat.name };
      }
    }
  }

  // 2. Inclusion match if length >= 2
  if (norm.length >= 2) {
    for (const cat of categories) {
      if (!cat.tasks) continue;
      for (const task of cat.tasks) {
        const tNorm = task.name.trim().toLowerCase();
        if (tNorm.includes(norm) || norm.includes(tNorm)) {
          return { task, categoryName: cat.name };
        }
      }
    }
  }

  return null;
}

function cleanNoteTargetTitle(raw: string): string {
  return raw
    .replace(/^\s*["'“”]+/, '')
    .replace(/["'“”]+\s*$/g, '')
    .replace(/^note\s+/i, '')
    .replace(/^catatan\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findExistingNote(notes: Note[], targetTitle: string): Note | null {
  const norm = targetTitle.trim().toLowerCase();
  if (!norm) return null;

  for (const note of notes) {
    if ((note.title || '').trim().toLowerCase() === norm) return note;
  }

  // Inclusion fallback (for slightly different phrasing)
  if (norm.length >= 2) {
    for (const note of notes) {
      const tNorm = (note.title || '').trim().toLowerCase();
      if (tNorm.includes(norm) || norm.includes(tNorm)) return note;
    }
  }

  return null;
}

function cleanHabitTargetName(raw: string): string {
  return raw
    .replace(/^\s*["'“”]+/, '')
    .replace(/["'“”]+\s*$/g, '')
    .replace(/^habit\s+/i, '')
    .replace(/^kebiasaan\s+/i, '')
    .replace(/^rutinitas\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findExistingHabit(habits: Habit[] | undefined, targetName: string): Habit | null {
  const norm = targetName.trim().toLowerCase();
  if (!norm) return null;
  const list = habits || [];
  for (const habit of list) {
    if ((habit.name || '').trim().toLowerCase() === norm) return habit;
  }
  if (norm.length >= 2) {
    for (const habit of list) {
      const hNorm = (habit.name || '').trim().toLowerCase();
      if (hNorm.includes(norm) || norm.includes(hNorm)) return habit;
    }
  }
  return null;
}

function formatNoteSubtitle(note: Note): string {
  const excerpt = (note.content || '').replace(/[#*`\n]/g, ' ').trim().slice(0, 60);
  return excerpt ? excerpt : 'Catatan kosong';
}

function formatHabitSubtitle(habit: Habit): string {
  return habit.time ? `Waktu: ${habit.time}` : 'Habit harian';
}

function parseOfflineNoteCommand(query: string, context: KnowledgeContext): AssistantAnswer | null {
  const clean = query.trim();

  // Create/update note: "buat note <judul> tanggal 18 november", "ubah catatan <judul> jam 07"
  // IMPORTANT: Harus mengandung kata kunci note/catatan agar tidak tertukar dengan task/habit.
  const noteCreateMatch = clean.match(/\b(?:buat(?:kan)?|tambah(?:kan)?|bikin|create|add)\s+(?:note|notes|catatan)\s+(.+)/i)
    || clean.match(/\b(?:ubah|update)\s+(?:note|notes|catatan)\s+(.+)/i);

  if (!noteCreateMatch) return null;

  let remaining = noteCreateMatch[1];

  const timeResult = extractTimeFromText(remaining);
  if (timeResult) remaining = timeResult.textWithoutTime;

  const deadlineResult = extractDeadlineFromText(remaining);
  if (deadlineResult) remaining = deadlineResult.textWithoutDeadline;

  const title = cleanNoteTargetTitle(remaining);
  if (!title) return null;

  const deadlineStr = deadlineResult ? deadlineResult.deadline : undefined;
  const timeStr = timeResult ? timeResult.time : undefined;

  const existing = findExistingNote(context.notes || [], title);

  if (existing) {
    return {
      reply: `Catatan "${existing.title}" sudah ada. ${deadlineStr ? `deadline diset ke ${deadlineStr}` : ''}${timeStr ? `${deadlineStr ? ' dan ' : ''}waktu diset ke ${timeStr}` : ''}`.trim(),
      references: [{
        type: 'note',
        id: existing.id,
        title: existing.title || 'Untitled Note',
        subtitle: formatNoteSubtitle(existing),
        section: 'notes'
      }],
      engine: 'local',
      intent: 'notes',
      actions: [{
        type: 'update_note',
        payload: {
          taskName: existing.title,
          deadline: deadlineStr,
          time: timeStr
        }
      }]
    };
  }

  return {
    reply: `Siap! Catatan "${title}" dibuat${deadlineStr ? ` untuk ${deadlineStr}` : ''}${timeStr ? ` pada ${timeStr}` : ''}.`,
    references: [{
      type: 'note',
      title,
      subtitle: 'Catatan baru (kosong)',
      section: 'notes'
    }],
    engine: 'local',
    intent: 'notes',
    actions: [{
      type: 'create_note',
      payload: {
        taskName: title,
        deadline: deadlineStr,
        time: timeStr
      }
    }]
  };
}

function parseOfflineHabitCommand(query: string, context: KnowledgeContext): AssistantAnswer | null {
  const clean = query.trim();

  const habitCreateMatch = clean.match(/\b(?:buat(?:kan)?|tambah(?:kan)?|bikin|create|add)\s+(?:habit|kebiasaan|rutinitas)\s+(.+)/i);
  if (!habitCreateMatch) return null;

  let remaining = habitCreateMatch[1];

  const timeResult = extractTimeFromText(remaining);
  if (timeResult) remaining = timeResult.textWithoutTime;

  const name = cleanHabitTargetName(remaining);
  if (!name) return null;

  const timeStr = timeResult ? timeResult.time : undefined;
  const existing = findExistingHabit(context.habits || [], name);

  if (existing) {
    return {
      reply: `Habit "${existing.name}" sudah ada.${timeStr ? ` Saat ini waktu terset ${existing.time || timeStr}.` : ''}`.trim(),
      references: [{
        type: 'habit',
        id: existing.id,
        title: `${existing.icon || '🔥'} ${existing.name}`,
        subtitle: formatHabitSubtitle(existing),
        section: 'habit'
      }],
      engine: 'local',
      intent: 'habits'
    };
  }

  return {
    reply: `Siap! Habit "${name}" dibuat${timeStr ? ` pada ${timeStr}` : ''}.`,
    references: [{
      type: 'habit',
      title: `🔥 ${name}`,
      subtitle: timeStr ? `Waktu: ${timeStr}` : 'Habit harian',
      section: 'habit'
    }],
    engine: 'local',
    intent: 'habits',
    actions: [{
      type: 'create_habit',
      payload: {
        taskName: name,
        time: timeStr
      }
    }]
  };
}

/**
 * Natural language task action parser for offline use.
 * Handles:
 * - create task ("buat task A jam 9", default "Inbox", duplicate detection)
 * - mark done / undone ("mark done task A", "selesaikan tugas B")
 * - update ("update task A jam 10", "ubah task A pukul 14:00")
 * - move ("pindah task A ke Kerja")
 */

/**
 * Natural language task action parser for offline use.
 * Handles:
 * - create task ("buat task A jam 9", default "Inbox", duplicate detection)
 * - mark done / undone ("mark done task A", "selesaikan tugas B")
 * - update ("update task A jam 10", "ubah task A pukul 14:00")
 * - move ("pindah task A ke Kerja")
 */
export function parseOfflineTaskCommand(query: string, context: KnowledgeContext): AssistantAnswer | null {
  const clean = query.trim();

  // 1. Move task
  const moveMatch = clean.match(/\b(?:pindah(?:kan)?|move)\s+(?:task|tugas)?\s*(.+?)\s+(?:ke\s+(?:kategori\s+)?|to\s+(?:category\s+)?)(.+)/i);
  if (moveMatch) {
    const targetTaskName = cleanTaskTargetName(moveMatch[1]);
    const targetCategoryName = moveMatch[2].trim();
    const existing = findExistingTask(context.categories || [], targetTaskName);

    if (existing) {
      return {
        reply: `Tugas "${existing.task.name}" berhasil dipindahkan dari kategori "${existing.categoryName}" ke "${targetCategoryName}".`,
        references: [{
          type: 'task',
          title: existing.task.name,
          subtitle: `[${targetCategoryName}] ${existing.task.done ? 'Selesai' : 'Pending'} • Jam: ${existing.task.time || '-'}`,
          category: targetCategoryName,
          section: 'tasks'
        }],
        engine: 'local',
        intent: 'tasks',
        actions: [{
          type: 'move_task',
          payload: {
            taskName: existing.task.name,
            categoryName: existing.categoryName,
            targetCategoryName
          }
        }]
      };
    }

    return {
      reply: `Saya tidak menemukan tugas "${targetTaskName}" untuk dipindahkan.`,
      references: [],
      engine: 'local',
      intent: 'tasks'
    };
  }

  // 2. Mark Done / Undone
  const undoneMatch = clean.match(/\b(?:unmark|tandai\s*(?:belum\s*)?selesai|batal(?:kan)?\s*selesai|belum\s+selesai)\s+(?:task|tugas)?\s*(.+)/i)
    || clean.match(/^(.+?)\s+(?:belum\s+selesai|batal\s+selesai|unmark)$/i);
  if (undoneMatch) {
    const targetTaskName = cleanTaskTargetName(undoneMatch[1]);
    const existing = findExistingTask(context.categories || [], targetTaskName);
    if (existing) {
      return {
        reply: `Tugas "${existing.task.name}" ditandai belum selesai.`,
        references: [{
          type: 'task',
          title: existing.task.name,
          subtitle: `[${existing.categoryName}] Pending • Jam: ${existing.task.time || '-'}`,
          category: existing.categoryName,
          section: 'tasks'
        }],
        engine: 'local',
        intent: 'tasks',
        actions: [{
          type: 'set_task_done',
          payload: {
            taskName: existing.task.name,
            categoryName: existing.categoryName,
            done: false
          }
        }]
      };
    }
    return {
      reply: `Saya tidak menemukan tugas "${targetTaskName}" untuk diperbarui statusnya.`,
      references: [],
      engine: 'local',
      intent: 'tasks'
    };
  }

  const doneMatch = clean.match(/\b(?:mark\s*done|tandai\s*(?:sudah\s*)?selesai|selesaikan|sudah\s+selesai|centang)\s+(?:task|tugas)?\s*(.+)/i)
    || clean.match(/^(.+?)\s+(?:sudah\s+selesai|mark\s*done)$/i);
  if (doneMatch) {
    const targetTaskName = cleanTaskTargetName(doneMatch[1]);
    const existing = findExistingTask(context.categories || [], targetTaskName);
    if (existing) {
      return {
        reply: `Tugas "${existing.task.name}" telah ditandai selesai ✓.`,
        references: [{
          type: 'task',
          title: existing.task.name,
          subtitle: `[${existing.categoryName}] Selesai • Jam: ${existing.task.time || '-'}`,
          category: existing.categoryName,
          section: 'tasks'
        }],
        engine: 'local',
        intent: 'tasks',
        actions: [{
          type: 'set_task_done',
          payload: {
            taskName: existing.task.name,
            categoryName: existing.categoryName,
            done: true
          }
        }]
      };
    }
    return {
      reply: `Saya tidak menemukan tugas "${targetTaskName}" untuk ditandai selesai.`,
      references: [],
      engine: 'local',
      intent: 'tasks'
    };
  }

  // 3. Update task
  const updateMatch = clean.match(/\b(?:update|ubah|ganti)\s+(?:task|tugas|jadwal|jam|deadline)?\s*(.+)/i);
  if (updateMatch) {
    let remaining = updateMatch[1];
    const timeResult = extractTimeFromText(remaining);
    if (timeResult) remaining = timeResult.textWithoutTime;
    const deadlineResult = extractDeadlineFromText(remaining);
    if (deadlineResult) remaining = deadlineResult.textWithoutDeadline;

    const targetTaskName = cleanTaskTargetName(remaining.replace(/\b(?:jadi|menjadi|ke|pada)\b/gi, ' '));
    const existing = findExistingTask(context.categories || [], targetTaskName);

    if (existing) {
      const newTime = timeResult ? timeResult.time : existing.task.time;
      const newDeadline = deadlineResult ? deadlineResult.deadline : existing.task.deadline;
      const changes: string[] = [];
      if (timeResult) changes.push(`jam ${newTime}`);
      if (deadlineResult) changes.push(`deadline ${newDeadline}`);

      return {
        reply: `Tugas "${existing.task.name}" berhasil diubah${changes.length ? ` (${changes.join(', ')})` : ''}.`,
        references: [{
          type: 'task',
          title: existing.task.name,
          subtitle: `[${existing.categoryName}] ${existing.task.done ? 'Selesai' : 'Pending'} • Jam: ${newTime || '-'}`,
          category: existing.categoryName,
          section: 'tasks'
        }],
        engine: 'local',
        intent: 'tasks',
        actions: [{
          type: 'update_task',
          payload: {
            taskName: existing.task.name,
            categoryName: existing.categoryName,
            time: newTime,
            deadline: newDeadline
          }
        }]
      };
    }

    if (targetTaskName.length > 0) {
      return {
        reply: `Saya tidak menemukan tugas "${targetTaskName}" untuk diperbarui.`,
        references: [],
        engine: 'local',
        intent: 'tasks'
      };
    }
  }

  // 4. Create task
  const createMatch = clean.match(/\b(?:buat(?:kan)?|tambah(?:kan)?|bikin|create|add)\s+(?:task|tugas)?\s*(.+)/i)
    || clean.match(/\b(?:task|tugas)\s+(.+?)\s+(?:jam|pukul)\s*(\d{1,2}.*)/i);
  if (createMatch) {
    let remaining = createMatch[1];
    if (createMatch[2]) remaining = `${createMatch[1]} jam ${createMatch[2]}`;

    const catResult = extractCategoryFromText(remaining);
    if (catResult) remaining = catResult.textWithoutCategory;

    const timeResult = extractTimeFromText(remaining);
    if (timeResult) remaining = timeResult.textWithoutTime;

    const deadlineResult = extractDeadlineFromText(remaining);
    if (deadlineResult) remaining = deadlineResult.textWithoutDeadline;

    const taskName = cleanTaskTargetName(remaining);
    if (!taskName) return null;

    const categoryName = catResult?.category || 'Inbox';
    const timeStr = timeResult ? timeResult.time : '';
    const deadlineStr = deadlineResult ? deadlineResult.deadline : getLocalTodayDate();

    // Check duplicate detection as requested:
    // "terus kalo tasknya sudah ada maka ai juga harus bisa menjawab task a sudah ada di jam a"
    const existing = findExistingTask(context.categories || [], taskName);
    if (existing) {
      const timeInfo = existing.task.time ? `jam ${existing.task.time}` : 'belum diatur jamnya';
      return {
        reply: `Tugas "${existing.task.name}" sudah ada di ${timeInfo} (kategori ${existing.categoryName}).`,
        references: [{
          type: 'task',
          title: existing.task.name,
          subtitle: `[${existing.categoryName}] ${existing.task.done ? 'Selesai' : 'Pending'} • Jam: ${existing.task.time || 'belum diatur'}`,
          category: existing.categoryName,
          section: 'tasks'
        }],
        engine: 'local',
        intent: 'tasks'
      };
    }

    return {
      reply: `Siap! Tugas "${taskName}" telah dibuat${timeStr ? ` untuk jam ${timeStr}` : ''} di kategori ${categoryName}.`,
      references: [{
        type: 'task',
        title: taskName,
        subtitle: `[${categoryName}] Pending • Jam: ${timeStr || '-'}`,
        category: categoryName,
        section: 'tasks'
      }],
      engine: 'local',
      intent: 'tasks',
      actions: [{
        type: 'create_task',
        payload: {
          taskName,
          categoryName,
          time: timeStr,
          deadline: deadlineStr,
          priority: 'low'
        }
      }]
    };
  }

  return null;
}

/**
 * Local-First Rule-Based Knowledge Retrieval Engine.
 * Bekerja 100% offline, zero latency, mengamati Tasks, Notes, dan Habits.
 */
export function searchLocalKnowledge(query: string, context: KnowledgeContext): AssistantAnswer {
  const lowerQuery = query.toLowerCase().trim();
  const keywords = extractSearchKeywords(query);
  const isAskingToday = /\b(?:hari\s+ini|today)\b/i.test(lowerQuery);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const flatTasks = flattenTasks(context.categories || []);
  const notes = context.notes || [];
  const habits = context.habits || [];

  const matchedTasks: { task: Task; categoryName: string; score: number }[] = [];
  const matchedNotes: { note: Note; score: number }[] = [];
  const matchedHabits: { habit: Habit; score: number }[] = [];

  const isAskingSchedule = isAskingToday || /\b(?:kapan|jadwal|deadline|tanggal|jam|waktu)\b/i.test(lowerQuery);
  const isAskingNotesOnly = /\b(?:catatan|note|notes)\b/i.test(lowerQuery) && !/\b(?:task|tugas)\b/i.test(lowerQuery);
  const isAskingTasksOnly = /\b(?:task|tasks|tugas|kerjaan|todo)\b/i.test(lowerQuery) && !/\b(?:catatan|note)\b/i.test(lowerQuery);
  const isAskingHabitsOnly = /\b(?:habit|habits|kebiasaan|rutinitas)\b/i.test(lowerQuery);
  const isAskingSummary = /\b(?:semua|rekap|ringkasan|apa saja|daftar|overview|status)\b/i.test(lowerQuery);

  // 1. Scoring Tasks
  for (const { task, categoryName } of flatTasks) {
    if (isAskingToday && task.deadline !== today) continue;

    let score = 0;
    const taskNameLower = task.name;
    const taskNoteLower = task.note || '';
    const catLower = categoryName;
    const tagsLower = (task.tags || []).join(' ');

    if (keywords.length === 0 && (isAskingSummary || isAskingToday)) {
      if (isAskingToday) score += 2;
      else if (!task.done) score += 1;
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
      engine: 'local',
      intent: 'lifeFlow'
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
    engine: 'local',
    intent: 'lifeFlow'
  };
}

/**
 * Gemini LLM Retrieval Engine.
 * Mengirim ringkasan context data ke model Gemini 1.5 Flash untuk penalaran natural.
 */
export async function queryGeminiWithContext(
  query: string,
  context: KnowledgeContext,
  apiKey: string,
  conversation: AssistantConversationTurn[] = []
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
5. Gunakan riwayat percakapan untuk memahami pertanyaan lanjutan seperti "yang kedua" atau "detailnya". Jangan mengarang fakta yang tidak tersedia di data.
6. Format keluaran WAJIB berupa JSON murni dengan skema:
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
    conversation: conversation.map(turn => ({
      role: turn.role,
      text: turn.text,
      references: turn.role === 'assistant' ? turn.references?.map(reference => reference.title) : undefined
    })),
    userData: {
      tasks: tasksSummary,
      notes: notesSummary,
      habits: habitsSummary
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await requestGemini(apiKey, {
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: JSON.stringify(payload) }
              ]
            }
          ],
          generationConfig: { responseMimeType: 'application/json' }
        }, controller.signal);

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
        engine: 'gemini',
        intent: 'lifeFlow'
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
async function queryGeminiGeneral(
  query: string,
  apiKey: string,
  conversation: AssistantConversationTurn[]
): Promise<AssistantAnswer> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await requestGemini(apiKey, {
          contents: [{
            parts: [
              { text: 'Anda adalah Jofi AI, asisten yang ramah. Jawab pertanyaan umum dengan jelas dan ringkas dalam bahasa pengguna. Anda tidak menerima atau mengetahui data Tasks, Notes, Habits, atau data pribadi LifeFlow pengguna. Jika pertanyaan kurang jelas, tanyakan detail yang diperlukan.' },
              { text: JSON.stringify({
                conversation: conversation.map(({ role, text }) => ({ role, text })),
                userQuery: query
              }) }
            ]
          }]
        }, controller.signal);

    if (!response.ok) throw await getGeminiHttpError(response);
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) throw new Error('Empty response from Gemini');
    return { reply, references: [], engine: 'gemini', intent: 'general' };
  } finally {
    clearTimeout(timeoutId);
  }
}

function getNoKeyGeneralAnswer(): AssistantAnswer {
  return {
    reply: 'Saya bisa membantu secara lokal dengan Tasks, Notes, Habits, dan jadwal LifeFlow. Untuk pertanyaan umum di luar data LifeFlow, atur Gemini API Key di Settings agar saya bisa menjawabnya.',
    references: [],
    engine: 'local',
    intent: 'general'
  };
}

async function getGeminiHttpError(response: Response): Promise<Error> {
  let details = '';
  try {
    const body = await response.json();
    const apiError = body?.error;
    const reason = Array.isArray(apiError?.details)
      ? apiError.details.map((detail: { reason?: unknown }) => detail.reason).filter(Boolean).join(' ')
      : '';
    details = [apiError?.status, reason, apiError?.message].filter(Boolean).join(' ');
  } catch {
    // Keep the HTTP status useful even when the server did not return JSON.
  }
  return new Error(`Gemini API returned status ${response.status}${details ? ` ${details}` : ''}`);
}

function getGeminiFailureReply(error: unknown): string {
  if (error instanceof Error && error.name === 'AbortError') {
    return 'Gemini terlalu lama merespons. Coba lagi sebentar.';
  }
  const message = error instanceof Error ? error.message : '';
  const status = message.match(/status (\d+)/)?.[1];
  if (status === '400' && /API_KEY_INVALID|API key not valid/i.test(message)) {
    return 'API Key Gemini tidak valid. Periksa atau buat ulang key di Google AI Studio, lalu simpan kembali di Settings.';
  }
  if (status === '400') return 'Gemini menolak format permintaan. Perbarui aplikasi lalu coba lagi.';
  if (status === '401') return 'Gemini menolak API Key. Periksa kembali key di Settings.';
  if (status === '403') return 'API Key tidak memiliki akses ke Gemini. Periksa izin atau pengaturan project Google AI.';
  if (status === '404') return 'Model Gemini tidak tersedia. Perbarui aplikasi atau coba lagi nanti.';
  if (status === '402') return 'Project Gemini memerlukan pengaturan billing atau kredit API sudah habis.';
  if (status === '429') return 'Kuota Gemini sedang habis. Coba lagi nanti atau periksa batas penggunaan API.';
  if (status === '500' || status === '502' || status === '503' || status === '504') {
    return 'Layanan Gemini sedang bermasalah. Coba lagi beberapa saat.';
  }
  if (error instanceof TypeError) {
    return 'Browser gagal menghubungi Gemini. Periksa koneksi, VPN/ad blocker, atau izin jaringan aplikasi.';
  }
  return 'Gemini tidak dapat dihubungi sekarang. Periksa koneksi internet lalu coba lagi.';
}

export async function askAssistant(
  query: string,
  context: KnowledgeContext,
  apiKey?: string,
  conversation: AssistantConversationTurn[] = []
): Promise<AssistantAnswer> {
  const cleanQuery = query.trim();
  if (isGreeting(cleanQuery) || /^(?:kamu siapa|siapa kamu|siapa nama kamu|who are you|what(?:'s| is) your name)[?.!\s]*$/i.test(cleanQuery)) {
    return getGreetingAnswer();
  }
  if (/^(?:terima kasih|makasih|thanks|thank you)[!.\s]*$/i.test(cleanQuery)) {
    return { reply: 'Sama-sama! Ada hal lain yang bisa saya bantu di LifeFlow?', references: [], engine: 'local', intent: 'greeting' };
  }

  // Check offline natural language commands first (notes/habits/tasks mutations)
  const noteCommandAnswer = parseOfflineNoteCommand(cleanQuery, context);
  if (noteCommandAnswer) {
    return noteCommandAnswer;
  }

  const habitCommandAnswer = parseOfflineHabitCommand(cleanQuery, context);
  if (habitCommandAnswer) {
    return habitCommandAnswer;
  }

  const taskCommandAnswer = parseOfflineTaskCommand(cleanQuery, context);
  if (taskCommandAnswer) {
    return taskCommandAnswer;
  }

  const isGeneralQuestion = isGeneralKnowledgeQuestion(cleanQuery);
  if (!isGeneralQuestion && /\b(?:hari\s+ini|today)\b/i.test(cleanQuery)) {
    return searchLocalKnowledge(cleanQuery, context);
  }

  const broadTopic = isGeneralQuestion ? null : getBroadTopic(cleanQuery);
  if (broadTopic) return answerBroadTopic(broadTopic, context);

  const previousTopic = [...conversation].reverse().find(turn =>
    turn.role === 'assistant' && ['tasks', 'notes', 'habits', 'calendar'].includes(turn.intent)
  );
  const isVagueFollowUp = /^(?:yang|itu|tadi|detailnya|rincian|nomor\s+\d|ke\s+\d|first|second|third|the\s+(?:first|second|third)|number\s+\d|it|that|those|and\s+(?:it|that))\b/i.test(cleanQuery);
  const previousTaskList = [...conversation].reverse().find(turn =>
    turn.role === 'assistant' && turn.intent === 'tasks' && turn.references?.some(reference => reference.type === 'task')
  );
  const listIndex = getTaskListIndex(cleanQuery);
  if (isVagueFollowUp && listIndex && previousTaskList) {
    const selectedReference = previousTaskList.references?.[listIndex - 1];
    const selectedTask = selectedReference && flattenTasks(context.categories || []).find(({ task, categoryName }) =>
      task.name === selectedReference.title && categoryName === selectedReference.category
    );
    if (selectedTask) return answerTaskDetails(selectedTask.task, selectedTask.categoryName);
  }

  const requestedPriority = getRequestedPriority(cleanQuery);
  if (requestedPriority && (previousTopic?.intent === 'tasks' || /\b(?:task|tasks|tugas|pekerjaan|kerjaan|todo)\b/i.test(cleanQuery))) {
    return answerTaskPriority(requestedPriority, context);
  }

  const hasLifeFlowTerm = /\b(?:task|tasks|tugas|pekerjaan|kerjaan|todo|catatan|note|notes|habit|habits|kebiasaan|rutinitas|kalender|calendar|jadwal|deadline|kategori|category)\b/i.test(cleanQuery);
  const localMatch = isGeneralQuestion ? null : searchLocalKnowledge(cleanQuery, context);
  const isLifeFlowQuestion = !isGeneralQuestion && (hasLifeFlowTerm || (isVagueFollowUp && Boolean(previousTopic)) || Boolean(localMatch?.references.length));

  if (apiKey?.trim() && isLifeFlowQuestion) {
    const answer = await queryGeminiWithContext(cleanQuery, context, apiKey.trim(), getLifeFlowHistory(conversation));
    return { ...answer, intent: getLifeFlowIntent(cleanQuery, answer.references, previousTopic, isVagueFollowUp) };
  }

  if (isLifeFlowQuestion) {
    const answer = localMatch || searchLocalKnowledge(cleanQuery, context);
    const taskReference = answer.references.find(reference => reference.type === 'task');
    if (taskReference && (previousTopic?.intent === 'tasks' || /\b(?:detail|rincian|info|informasi)\b/i.test(cleanQuery))) {
      const selectedTask = flattenTasks(context.categories || []).find(({ task, categoryName }) =>
        task.name === taskReference.title && categoryName === taskReference.category
      );
      if (selectedTask) return answerTaskDetails(selectedTask.task, selectedTask.categoryName);
    }
    if (!answer.references.length && isVagueFollowUp && previousTopic?.intent === 'tasks') {
      return {
        reply: 'Tugas yang mana yang ingin Anda bahas? Sebutkan nama task atau pilih salah satu dari daftar sebelumnya.',
        references: previousTopic.references || [],
        engine: 'local',
        intent: 'tasks'
      };
    }
    return { ...answer, intent: getLifeFlowIntent(cleanQuery, answer.references, previousTopic, isVagueFollowUp) };
  }

  if (apiKey?.trim()) {
    try {
      return await queryGeminiGeneral(cleanQuery, apiKey.trim(), getGeneralHistory(conversation));
    } catch (error) {
      console.warn('Gemini general query failed:', error);
      return {
        reply: `${getGeminiFailureReply(error)} Saya tetap bisa membantu mencari data di LifeFlow.`,
        references: [],
        engine: 'local',
        intent: 'general'
      };
    }
  }

  return getNoKeyGeneralAnswer();
}

