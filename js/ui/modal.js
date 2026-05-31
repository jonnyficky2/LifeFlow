import { resetEditingTask } from "../task/task.js";

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