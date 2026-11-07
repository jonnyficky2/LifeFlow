import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useHabitContext } from '../../context/HabitContext';
import { useNoteContext } from '../../context/NoteContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { useTaskContext } from '../../context/TaskContext';
import { askAssistant } from '../../utils/aiAssistant';
import type { AssistantAnswer } from '../../utils/aiAssistant';
import './AiChatDrawer.css';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  answer?: AssistantAnswer;
}

export const AiChatDrawer: React.FC = () => {
  const { isAiChatOpen, setAiChatOpen } = useAppContext();
  const { appData } = useTaskContext();
  const { notes } = useNoteContext();
  const { habits } = useHabitContext();
  const { settings } = useSettingsContext();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(0);

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
    setMessages(previous => [...previous, { id: ++messageId.current, role: 'user', text }]);
    try {
      const answer = await askAssistant(text, { categories: appData, notes, habits }, settings?.geminiApiKey as string | undefined);
      setMessages(previous => [...previous, { id: ++messageId.current, role: 'assistant', text: answer.reply, answer }]);
    } catch {
      setMessages(previous => [...previous, {
        id: ++messageId.current,
        role: 'assistant',
        text: 'Maaf, saya belum bisa memproses pertanyaan itu. Silakan coba lagi.'
      }]);
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
            <span className="ai-chat-mark" aria-hidden="true">✦</span>
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
                    <div className="ai-chat-result" key={`${reference.type}-${reference.id || reference.title}-${index}`}>
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
