import { Icon } from '../ui/Icon';
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useHabitContext } from '../../context/HabitContext';
import { useNoteContext } from '../../context/NoteContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { useTaskContext } from '../../context/TaskContext';
import { useNotes } from '../../hooks/useNotes';
import { useHabits } from '../../hooks/useHabits';
import { useTasks } from '../../hooks/useTasks';
import { askAssistant } from '../../utils/aiAssistant';
import type { AssistantAnswer, AssistantConversationTurn, AssistantIntent, AssistantReference } from '../../utils/aiAssistant';
import './AiChatDrawer.css';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  intent?: AssistantIntent;
  answer?: AssistantAnswer;
}

export const AiChatDrawer: React.FC = () => {
  const { isAiChatOpen, setAiChatOpen, setActiveSection } = useAppContext();
  const { appData, setTaskModalOpen, setEditingTask } = useTaskContext();
  const { notes, setActiveNoteId } = useNoteContext();
  const { habits } = useHabitContext();
  const { settings } = useSettingsContext();
  const { addNote, updateNote } = useNotes();
  const { addHabit } = useHabits();
  const { executeAssistantAction } = useTasks();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(0);

  const handleReferenceClick = (reference: AssistantReference) => {
    if (reference.type === 'task') {
      const refTitleNorm = reference.title.trim().toLowerCase();
      for (let cIdx = 0; cIdx < appData.length; cIdx++) {
        const cat = appData[cIdx];
        if (!cat.tasks) continue;
        const tIdx = cat.tasks.findIndex(t => t.name.trim().toLowerCase() === refTitleNorm);
        if (tIdx !== -1) {
          setEditingTask({ catIndex: cIdx, taskIndex: tIdx });
          setTaskModalOpen(true);
          return;
        }
      }
      setActiveSection('tasks');
    } else if (reference.type === 'note') {
      if (reference.id) {
        setActiveNoteId(reference.id);
      } else {
        const foundNote = notes.find(n => n.title.trim().toLowerCase() === reference.title.trim().toLowerCase());
        if (foundNote) setActiveNoteId(foundNote.id);
      }
      setActiveSection('notes');
      setAiChatOpen(false);
    } else if (reference.type === 'habit') {
      setActiveSection('habits');
      setAiChatOpen(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending]);

  useEffect(() => {
    if (!isAiChatOpen) return;
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAiChatOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAiChatOpen, setAiChatOpen]);

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = question.trim();
    if (!text || isSending) return;

    setQuestion('');
    setIsSending(true);
    const userMessageId = ++messageId.current;
    const conversation: AssistantConversationTurn[] = messages.slice(-8).map(message => ({
      role: message.role,
      text: message.text,
      intent: message.intent || 'general',
      references: message.role === 'assistant' ? message.answer?.references : undefined
    }));
    setMessages(previous => [...previous, { id: userMessageId, role: 'user', text }]);
    try {
      const answer = await askAssistant(text, { categories: appData, notes, habits }, settings?.geminiApiKey as string | undefined, conversation);
      if (answer.actions && answer.actions.length > 0) {
        for (const action of answer.actions) {
          if (action.type === 'create_task' || action.type === 'update_task' || action.type === 'set_task_done' || action.type === 'move_task') {
            executeAssistantAction(action);
            continue;
          }

          if (action.type === 'create_note') {
            const title = action.payload.taskName;
            const newId = addNote(title);
            if (action.payload.deadline || action.payload.time) {
              updateNote(newId, {
                deadline: action.payload.deadline,
                time: action.payload.time
              });
            }
            continue;
          }

          if (action.type === 'update_note') {
            const title = action.payload.taskName;
            const target = notes.find(n => n.title.trim().toLowerCase() === title.trim().toLowerCase());
            if (target) {
              updateNote(target.id, {
                deadline: action.payload.deadline,
                time: action.payload.time
              });
            }
            continue;
          }

          if (action.type === 'create_habit') {
            const name = action.payload.taskName;
            addHabit(name, 'var(--primary-color)', 'target', undefined, action.payload.time);
            continue;
          }
        }
      }
      setMessages(previous => [
        ...previous.map(message => message.id === userMessageId ? { ...message, intent: answer.intent } : message),
        { id: ++messageId.current, role: 'assistant', text: answer.reply, intent: answer.intent, answer }
      ]);
    } catch {
      setMessages(previous => [
        ...previous.map(message => message.id === userMessageId ? { ...message, intent: 'general' as const } : message),
        { id: ++messageId.current, role: 'assistant', text: 'Maaf, saya belum bisa memproses pertanyaan itu. Silakan coba lagi.', intent: 'general' }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isAiChatOpen) return null;

  return (
    <div className="ai-chat-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setAiChatOpen(false);
    }}>
      <section className="ai-chat-drawer" role="dialog" aria-modal="true" aria-labelledby="ai-chat-title">
        <header className="ai-chat-header">
          <div className="ai-chat-heading">
            <span className="ai-chat-mark" aria-hidden="true"><Icon name="spark" /></span>
            <div>
              <h2 id="ai-chat-title">LifeFlow AI</h2>
              <p>Asisten pribadi berbasis data Anda</p>
            </div>
          </div>
          <button type="button" className="ai-chat-close" aria-label="Tutup LifeFlow AI" onClick={() => setAiChatOpen(false)}>×</button>
        </header>

        <div className="ai-chat-messages" aria-live="polite">
          {messages.length === 0 ? (
            <div className="ai-chat-welcome">
              <span className="ai-chat-welcome-mark" aria-hidden="true">✧</span>
              <h3>Apa yang ingin Anda temukan?</h3>
              <p>Tanyakan tentang tugas, catatan, jadwal, atau kebiasaan Anda.</p>
              <div className="ai-chat-suggestions" aria-label="Contoh pertanyaan">
                <button type="button" onClick={() => setQuestion('Apa tugas saya yang masih pending?')}>Apa tugas saya yang masih pending?</button>
                <button type="button" onClick={() => setQuestion('Ada catatan tentang proyek saya?')}>Ada catatan tentang proyek saya?</button>
              </div>
            </div>
          ) : messages.map(message => (
            <article className={`ai-chat-message ai-chat-message--${message.role}`} key={message.id}>
              <p>{message.text}</p>
              {message.answer && message.answer.references.length > 0 && (
                <div className="ai-chat-results" aria-label="Referensi terkait">
                  {message.answer.references.map((reference, index) => (
                    <div
                      className={`ai-chat-result ai-chat-result--${reference.type}`}
                      key={`${reference.type}-${reference.id || reference.title}-${index}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleReferenceClick(reference)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleReferenceClick(reference);
                        }
                      }}
                      title="Buka item ini"
                    >
                      <span className="ai-chat-result-type">{reference.type}</span>
                      <strong>{reference.title}</strong>
                      {reference.subtitle && <span>{reference.subtitle}</span>}
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
          {isSending && <p className="ai-chat-thinking" role="status">Sedang mencari di LifeFlow…</p>}
          <div ref={messagesEndRef} />
        </div>

        <form className="ai-chat-composer" onSubmit={sendMessage}>
          <label className="visually-hidden" htmlFor="ai-chat-question">Tulis pertanyaan</label>
          <input
            id="ai-chat-question"
            ref={inputRef}
            value={question}
            onChange={event => setQuestion(event.target.value)}
            placeholder="Tanyakan sesuatu…"
            autoComplete="off"
            disabled={isSending}
          />
          <button type="submit" aria-label="Kirim pertanyaan" disabled={!question.trim() || isSending}>↑</button>
        </form>
        <p className="ai-chat-footnote">Jawaban menggunakan data LifeFlow Anda</p>
      </section>
    </div>
  );
};
