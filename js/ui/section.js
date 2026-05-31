import { renderCalendar } from "../task/calendar.js";
import { refreshStatsUI } from "../stats/stats.js";

export function showSection(section) {
  const homeSection = document.getElementById("homeSection");
  const calendarSection = document.getElementById("calendarSection");
  const habitSection = document.getElementById("habitSection");
  const statsSection = document.getElementById("statsSection");

  homeSection.style.display = "none";
  calendarSection.style.display = "none";
  habitSection.style.display = "none";
  statsSection.style.display = "none";

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
  }
}