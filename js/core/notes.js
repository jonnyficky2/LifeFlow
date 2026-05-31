import { state } from "./state.js";
import { saveToLocal, saveState } from "./storage.js";
import { openNoteModal, closeNoteModal } from "../ui/modal.js";

export let editingNoteIndex = null;

export function resetEditingNote() {
  editingNoteIndex = null;
}

export function renderNotes() {
  const container = document.getElementById("notesContainer");
  if (!container) return;
  container.innerHTML = "";

  if (state.notes.length === 0) {
    container.innerHTML = "<p style='text-align:center; opacity:0.6; margin-top:20px;'>Belum ada catatan. Tambahkan sekarang!</p>";
    return;
  }

  const sortedNotes = state.notes
    .map((note, index) => ({ note, index }))
    .sort((a, b) => {
      if (a.note.pinned && !b.note.pinned) return -1;
      if (!a.note.pinned && b.note.pinned) return 1;
      return 0;
    });

  sortedNotes.forEach(({ note, index }) => {
    const card = document.createElement("div");
    card.className = "note-card" + (note.pinned ? " pinned" : "");

    const header = document.createElement("div");
    header.className = "note-card-header";

    const titleBox = document.createElement("div");
    const title = document.createElement("h3");
    title.innerText = (note.pinned ? "📌 " : "") + (note.title || "Tanpa Judul");
    
    const date = document.createElement("small");
    date.innerText = note.date || new Date().toLocaleString("id-ID");
    titleBox.append(title, date);

    const actions = document.createElement("div");
    actions.className = "task-right";
    
    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.onclick = () => editNote(index);

    const delBtn = document.createElement("button");
    delBtn.innerText = "🗑";
    delBtn.onclick = () => deleteNote(index);

    actions.append(editBtn, delBtn);
    header.append(titleBox, actions);

    const content = document.createElement("p");
    content.innerText = note.content;

    card.append(header, content);
    container.appendChild(card);
  });
}

export function saveNoteModal() {
  const title = document.getElementById("noteTitleInput").value;
  const content = document.getElementById("noteContentInput").value;
  const pinned = document.getElementById("notePinInput").checked;

  if (!content.trim()) return;
  saveState();

  if (editingNoteIndex !== null) {
    state.notes[editingNoteIndex].title = title;
    state.notes[editingNoteIndex].content = content;
    state.notes[editingNoteIndex].date = new Date().toLocaleString("id-ID");
    state.notes[editingNoteIndex].pinned = pinned;
    editingNoteIndex = null;
  } else {
    state.notes.unshift({ title, content, date: new Date().toLocaleString("id-ID"), pinned });
  }

  saveToLocal();
  renderNotes();

  document.getElementById("noteTitleInput").value = "";
  document.getElementById("noteContentInput").value = "";
  document.getElementById("notePinInput").checked = false;
  closeNoteModal();
}

export function editNote(index) {
  editingNoteIndex = index;
  const note = state.notes[index];
  document.getElementById("noteTitleInput").value = note.title || "";
  document.getElementById("noteContentInput").value = note.content || "";
  document.getElementById("notePinInput").checked = note.pinned || false;
  openNoteModal();
}

export function deleteNote(index) {
  if (!confirm("Hapus catatan ini?")) return;
  saveState();
  state.notes.splice(index, 1);
  saveToLocal();
  renderNotes();
}