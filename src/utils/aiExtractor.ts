export interface ExtractedTask {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  sourceText?: string;
  selected: boolean;
}

export interface ExtractionResult {
  tasks: ExtractedTask[];
  engine: 'local' | 'gemini';
}

/**
 * Local-First Rule-Based Action Item Extractor.
 * Operates offline, zero latency, and zero vendor lock-in.
 */
export function extractTasksLocal(content: string): ExtractedTask[] {
  if (!content || !content.trim()) return [];

  const lines = content.split('\n');
  const results: ExtractedTask[] = [];
  const seen = new Set<string>();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    let candidate = '';
    let priority: 'low' | 'medium' | 'high' = 'low';

    // 1. Markdown unchecked checkbox: - [ ] Task or * [ ] Task or [ ] Task
    const checkboxMatch = line.match(/^[-*+]?\s*\[\s\]\s+(.+)$/i);
    if (checkboxMatch) {
      candidate = checkboxMatch[1];
    } else {
      // 2. Explicit action prefix: TODO:, TASK:, FIXME:, ACTION:
      const prefixMatch = line.match(/^[-*+]?\s*(?:TODO|TASK|FIXME|ACTION):\s*(.+)$/i);
      if (prefixMatch) {
        candidate = prefixMatch[1];
      } else {
        // 3. Bullet points or sentences starting with action keywords
        // Strip leading list markers (- , * , 1. , etc.)
        const stripped = line.replace(/^[-*+]\s+/, '').replace(/^\d+[.)]\s+/, '');

        // Action verbs regex (Indonesian & English)
        const actionVerbRegex = /^(?:tolong\s+|perlu\s+|harus\s+|wajib\s+|jangan lupa\s+(?:untuk\s+)?|kerjakan\s+|selesaikan\s+|buat\s+|kirim\s+|bayar\s+|beli\s+|hubungi\s+|jadwalkan\s+|cek\s+|periksa\s+|review\s+|siapkan\s+|perbaiki\s+|need to\s+|must\s+|have to\s+|don't forget to\s+|remember to\s+|create\s+|build\s+|fix\s+|send\s+|update\s+|check\s+|follow up\s+|schedule\s+|prepare\s+|buy\s+|call\s+)/i;

        if (actionVerbRegex.test(stripped)) {
          candidate = stripped;
        }
      }
    }

    if (candidate) {
      // Clean candidate string
      const cleaned = candidate
        .replace(/^\[\s*\]\s*/, '')
        .replace(/[.,;:]+$/, '')
        .trim();

      // Priority cues
      if (/\b(?:urgent|asap|penting|darurat|segera|high priority)\b/i.test(cleaned)) {
        priority = 'high';
      } else if (/\b(?:medium|sedang)\b/i.test(cleaned)) {
        priority = 'medium';
      }

      // Check min length and duplicates
      const normalizedKey = cleaned.toLowerCase();
      if (cleaned.length >= 3 && !seen.has(normalizedKey)) {
        seen.add(normalizedKey);
        results.push({
          id: `ext_local_${Date.now()}_${results.length}`,
          name: cleaned,
          priority,
          sourceText: rawLine,
          selected: true
        });
      }
    }
  }

  return results;
}

/**
 * Optional Gemini LLM Extractor.
 * Uses Google Gemini REST API without any external dependencies.
 */
export async function extractTasksWithGemini(content: string, apiKey: string): Promise<ExtractedTask[]> {
  const prompt = `Extract all actionable tasks or to-do items from the following note content.
Return ONLY a valid JSON array of objects with keys "name" (string, concise actionable task title) and "priority" ("low" | "medium" | "high"). Do not include markdown code block quotes or any other text.
Content:
${content}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
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
    if (!text) return [];

    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item, idx) => ({
        id: `ext_gemini_${Date.now()}_${idx}`,
        name: String(item.name || '').trim(),
        priority: (item.priority === 'high' ? 'high' : item.priority === 'medium' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        selected: true
      }))
      .filter(t => t.name.length >= 3);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Unified Extractor (Invisible AI Architecture).
 * Tries Gemini if apiKey is provided, otherwise falls back smoothly to local extraction.
 */
export async function extractTasks(content: string, apiKey?: string): Promise<ExtractionResult> {
  if (apiKey && apiKey.trim()) {
    try {
      const geminiTasks = await extractTasksWithGemini(content, apiKey.trim());
      if (geminiTasks.length > 0) {
        return { tasks: geminiTasks, engine: 'gemini' };
      }
    } catch (e) {
      console.warn('Gemini extraction failed or timed out, falling back to local extractor:', e);
    }
  }

  return {
    tasks: extractTasksLocal(content),
    engine: 'local'
  };
}
