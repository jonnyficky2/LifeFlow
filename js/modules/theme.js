import { refreshStatsUI } from "../stats/stats.js";
import { state } from "../core/state.js";

export function loadTheme(){
  let theme = "system";
  if (state.settings && state.settings.theme) {
    theme = state.settings.theme;
  } else {
    const saved = localStorage.getItem("theme");
    if (saved) theme = saved;
  }

  if (theme === "light") {
    document.body.classList.add("light-mode");
  } else if (theme === "dark") {
    document.body.classList.remove("light-mode");
  } else {
    // system
    const isSystemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (isSystemLight) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }
}

export function toggleTheme(){

  document.body.classList.toggle(
    "light-mode"
  );

  const isLight =
    document.body.classList.contains(
      "light-mode"
    );

  localStorage.setItem(
    "theme",
    isLight ? "light" : "dark"
  );

  refreshStatsUI();
}
