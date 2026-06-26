import { resetEditingTask } from "../task/task.js";
import { resetEditingNote } from "../core/notes.js";

export function openTaskModal() {
  document.getElementById("taskModal").classList.add("show");
}

export function closeTaskModal() {
  document.getElementById("taskModal").classList.remove("show");
  resetEditingTask();
}

export function openHabitModal() {
  document.getElementById("habitModal").classList.add("show");
}

export function closeHabitModal() {
  document.getElementById("habitModal").classList.remove("show");
}

export function openNoteModal() {
  document.getElementById("noteModal").classList.add("show");
}

export function closeNoteModal() {
  document.getElementById("noteModal").classList.remove("show");
  resetEditingNote();
}