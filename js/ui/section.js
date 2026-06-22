import { renderCalendar } from "../task/calendar.js";
import { refreshStatsUI } from "../stats/stats.js";
import { renderNotes } from "../core/notes.js";

export function showSection(section, addToHistory = true) {
  const homeSection = document.getElementById("homeSection");
  const calendarSection = document.getElementById("calendarSection");
  const habitSection = document.getElementById("habitSection");
  const statsSection = document.getElementById("statsSection");
  const notesSection = document.getElementById("notesSection");
  const settingsSection = document.getElementById("settingsSection");
  const focusSection = document.getElementById("focusSection");

  if (homeSection) homeSection.style.display = "none";
  if (calendarSection) calendarSection.style.display = "none";
  if (habitSection) habitSection.style.display = "none";
  if (statsSection) statsSection.style.display = "none";
  if (notesSection) notesSection.style.display = "none";
  if (settingsSection) settingsSection.style.display = "none";
  if (focusSection) focusSection.style.display = "none";

  if (section === "home" && homeSection) {
    homeSection.style.display = "block";
  } else if (section === "calendar" && calendarSection) {
    calendarSection.style.display = "block";
    renderCalendar();
  } else if (section === "habit" && habitSection) {
    habitSection.style.display = "block";
  } else if (section === "stats" && statsSection) {
    statsSection.style.display = "block";
    refreshStatsUI();
  } else if (section === "notes" && notesSection) {
    notesSection.style.display = "block";
    renderNotes();
  } else if (section === "settings" && settingsSection) {
    settingsSection.style.display = "block";
  } else if (section === "focus" && focusSection) {
    focusSection.style.display = "block";
  }

  if (addToHistory) {
    window.history.pushState({ section }, "", `#${section}`);
  }
}