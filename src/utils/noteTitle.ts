import type { Note } from '../types';

// Judul catatan yang tampil di UI: pakai title eksplisit, kalau kosong ambil 2 kata pertama isi.
// 'Untitled Note' adalah judul bawaan catatan lama, jadi diperlakukan sama seperti judul kosong.
export const noteDisplayTitle = (note: Pick<Note, 'title' | 'content'> | { title?: string; content?: string }): string => {
  const title = (note.title || '').trim();
  if (title && title !== 'Untitled Note') return title;

  const fromContent = (note.content || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join(' ');
  return fromContent || 'Untitled Note';
};
