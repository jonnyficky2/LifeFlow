import { renderCalendar } from "../task/calendar.js";
import { refreshStatsUI } from "../stats/stats.js";
import { renderNotes } from "../core/notes.js";

export function showSection(section) {
  const homeSection = document.getElementById("homeSection");
  const calendarSection = document.getElementById("calendarSection");
  const habitSection = document.getElementById("habitSection");
  const statsSection = document.getElementById("statsSection");
  const notesSection = document.getElementById("notesSection");

  homeSection.style.display = "none";
  calendarSection.style.display = "none";
  habitSection.style.display = "none";
  statsSection.style.display = "none";
  notesSection.style.display = "none";

  if (section === "home") {
    homeSection.style.display = "block";
  } else if (section === "calendar") {
    calendarSection.style.display = "block";
    renderCalendar();
  } else if (section === "habit") {
    habitSection.style.display = "block";
  } else if (section === "stats") {
    statsSection.style.display = "block";
    refreshStatsUI();
  } else if (section === "notes") {
    notesSection.style.display = "block";
    renderNotes();
  }
}