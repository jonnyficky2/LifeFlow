import { refreshStatsUI } from "../stats/stats.js";

export function loadTheme(){

  const saved =
    localStorage.getItem("theme");

  if(saved === "light"){

    document.body.classList.add(
      "light-mode"
    );

  }else{

    document.body.classList.remove(
      "light-mode"
    );
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
