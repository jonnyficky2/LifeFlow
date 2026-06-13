import { state } from "./state.js";
import { saveToLocal, saveState } from "./storage.js";
import { openNoteModal, closeNoteModal } from "../ui/modal.js";
import { showToast } from "./utils.js";

export let editingNoteIndex = null;

export function resetEditingNote() {
  editingNoteIndex = null;
}

export function renderNotes() {
  const container = document.getElementById("notesContainer");
  if (!container) return;
  container.innerHTML = "";

  if (state.notes.length === 0) {
    container.innerHTML = "<p style='text-align:center; opacity:0.6; margin-top:20px;'>No notes yet. Add one now!</p>";
    return;
  }

  const sortedNotes = state.notes
    .map((note, index) => ({ note, index }))
    .sort((a, b) => {
      if (a.note.pinned && !b.note.pinned) return -1;
      if (!a.note.pinned && b.note.pinned) return 1;
      return 0;
    });

  const fragment = document.createDocumentFragment();

  sortedNotes.forEach(({ note, index }) => {
    const card = document.createElement("div");
    card.className = "note-card" + (note.pinned ? " pinned" : "") + (note.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "note-checkbox";
    checkbox.checked = note.done || false;
    checkbox.onclick = () => toggleNoteDone(index);

    const body = document.createElement("div");
    body.className = "note-card-body";

    const header = document.createElement("div");
    header.className = "note-card-header";

    const titleBox = document.createElement("div");
    const title = document.createElement("h3");
    title.innerText = (note.pinned ? "📌 " : "") + (note.title || "Untitled");
    
    const date = document.createElement("small");
    date.innerText = note.date || new Date().toLocaleString("en-US");
    titleBox.append(title, date);

    const actions = document.createElement("div");
    actions.className = "task-right";
    
    const copyBtn = document.createElement("button");
    copyBtn.innerText = "📋";
    copyBtn.onclick = () => copyNoteContent(note.content);

    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.onclick = () => editNote(index);

    const delBtn = document.createElement("button");
    delBtn.innerText = "🗑";
    delBtn.onclick = () => deleteNote(index);

    actions.append(copyBtn, editBtn, delBtn);
    header.append(titleBox, actions);

    const content = document.createElement("p");
    content.innerText = note.content;

    body.append(header, content);
    card.append(checkbox, body);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

export function toggleNoteDone(index) {
  saveState();
  state.notes[index].done = !state.notes[index].done;
  saveToLocal();
  renderNotes();
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
    state.notes[editingNoteIndex].date = new Date().toLocaleString("en-US");
    state.notes[editingNoteIndex].pinned = pinned;
    editingNoteIndex = null;
  } else {
    state.notes.unshift({
      title,
      content,
      date: new Date().toLocaleString("en-US"),
      pinned,
      done: false
    });
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
  if (!confirm("Delete this note?")) return;
  saveState();
  state.notes.splice(index, 1);
  saveToLocal();
  renderNotes();
}

export function copyNoteContent(content) {
  navigator.clipboard.writeText(content).then(() => {
    showToast("Note copied successfully!");
  }).catch(err => {
    console.error("Gagal menyalin: ", err);
    showToast("Failed to copy note.");
  });
}