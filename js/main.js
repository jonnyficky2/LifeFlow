
import { state } from "./core/state.js";
import { quotes } from "./core/quotes.js";
import {
  getToday,
  getLocalDate,
  showToast,
  celebrate
} from "./core/utils.js";
import {
  saveToLocal,
  saveState,
  importData,
  exportData
} from "./core/storage.js";

import {
  renderHabits,
  toggleHabit,
  addHabit,
  addHabitCategory,
  toggleRepeatOptions
} from "./habit/habit.js";

import { openTaskModal, closeTaskModal, openHabitModal, closeHabitModal, openNoteModal, closeNoteModal } from "./ui/modal.js";
import { initSidebar } from "./navbar/navbar.js";
import { showSection } from "./ui/section.js";
import { renderCalendar, changeMonth } from "./task/calendar.js";
import { saveTaskModal, toggleTask, editTask, deleteTask, addCategory, editCategory, deleteCategory, renderTasks, searchTask, setFilter } from "./task/task.js";
import { getLevelData, updateLevel, updateQuickStats, updateProgressRing, generateHeatmap, updateImproveStats, refreshStatsUI } from "./stats/stats.js";
import { loadTheme, toggleTheme } from "./modules/theme.js";
import { saveNoteModal, renderNotes } from "./core/notes.js";
import { initShare, triggerShare } from "./modules/share.js";
import { initAuth, saveToCloud } from "./modules/cloud-sync.js";

let deferredPrompt = null;

function setSidebarActive(navKey) {
  document.querySelectorAll(".app-nav .sidebar-item").forEach((item) => {
    if (item.dataset.nav === navKey) {
      item.classList.add("is-active");
    } else {
      item.classList.remove("is-active");
    }
  });
}

function navigateToSection(section, navKey) {
  showSection(section);
  setSidebarActive(navKey ?? getNavKeyForSection(section));
}

function getNavKeyForSection(section) {
  if (section === "home") return "dashboard";
  if (section === "stats") return "stats";
  if (section === "habit") return "tasks";
  return section;
}

/* =========================
   STATE
========================= */



/* =========================
   ELEMENT
========================= */

function setupUIEventListeners() {
  const importFile =
    document.getElementById("importFile");

  document.getElementById("undoBtn")?.addEventListener(
    "click",
    undo
  );

  document.getElementById("redoBtn")?.addEventListener(
    "click",
    redo
  );

  document.getElementById("toggleTheme")?.addEventListener(
    "click",
    toggleTheme
  );

  document.getElementById("desktopThemeToggle")?.addEventListener(
    "click",
    toggleTheme
  );

  document.getElementById("desktopMenuToggle")?.addEventListener(
    "click",
    () => document.getElementById("sidebar")?.classList.toggle("sidebar-open")
  );

  document.getElementById("exportBtn")?.addEventListener(
    "click",
    exportData
  );

  document.getElementById("importBtn")?.addEventListener(
    "click",
    () => importFile?.click()
  );

  importFile?.addEventListener(
    "change",
    importData
  );

  document
    .getElementById("searchInput")
    ?.addEventListener(
      "input",
      searchTask
    );

  document
    .getElementById("filterAllBtn")
    ?.addEventListener(
      "click",
      () => setFilter("all")
    );

  document
    .getElementById("filterPendingBtn")
    ?.addEventListener(
      "click",
      () => setFilter("pending")
    );

  document
    .getElementById("filterDoneBtn")
    ?.addEventListener(
      "click",
      () => setFilter("done")
    );

  document.querySelectorAll("[data-filter-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filterTab;
      setFilter(filter);
      document.querySelectorAll("[data-filter-tab]").forEach((tab) => {
        if (tab === button) {
          tab.classList.add("is-active");
        } else {
          tab.classList.remove("is-active");
        }
      });
    });
  });

  document
    .getElementById("addCategoryBtn")
    ?.addEventListener(
      "click",
      addCategory
    );

  const focusCategoryInput = () => {
    showSection("home");
    setSidebarActive("category");
    document.getElementById("categoryInput")?.focus();
  };

  const openTaskFromDashboard = () => {
    if (state.appData.length === 0) {
      showToast("Buat category dulu");
      focusCategoryInput();
      return;
    }

    state.currentCategoryIndex =
      state.currentCategoryIndex ?? state.appData.length - 1;

    openTaskModal();
  };

  document.getElementById("quickAddTaskBtn")?.addEventListener(
    "click",
    openTaskFromDashboard
  );

  document.getElementById("emptyAddTaskBtn")?.addEventListener(
    "click",
    openTaskFromDashboard
  );

  document.getElementById("quickAddCategoryBtn")?.addEventListener(
    "click",
    focusCategoryInput
  );

  document.getElementById("categoryPanelAddBtn")?.addEventListener(
    "click",
    focusCategoryInput
  );

  document.getElementById("viewCategoriesBtn")?.addEventListener(
    "click",
    focusCategoryInput
  );

  document.getElementById("quickCalendarBtn")?.addEventListener(
    "click",
    () => navigateToSection("calendar")
  );

  document.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateToSection(button.dataset.section, button.dataset.nav);
    });
  });

  document.querySelectorAll("[data-action='category']").forEach((button) => {
    button.addEventListener("click", () => {
      focusCategoryInput();
    });
  });

  document.querySelectorAll("[data-action='settings']").forEach((button) => {
    button.addEventListener("click", () => {
      setSidebarActive(button.dataset.nav);
    });
  });

  document
    .getElementById("prevMonthBtn")
    ?.addEventListener(
      "click",
      () => changeMonth(-1)
    );

  document
    .getElementById("nextMonthBtn")
    ?.addEventListener(
      "click",
      () => changeMonth(1)
    );

  document
    .getElementById("closeDayTasksModalBtn")
    ?.addEventListener(
      "click",
      () =>
        document
          .getElementById(
            "dayTasksModal"
          )
          .classList.remove("show")
    );

  document
    .getElementById("addHabitCategoryBtn")
    ?.addEventListener(
      "click",
      addHabitCategory
    );

  document
    .getElementById("navHomeBtn")
    ?.addEventListener(
      "click",
      () => navigateToSection("home", "dashboard")
    );

  document
    .getElementById("navCalendarBtn")
    ?.addEventListener(
      "click",
      () => navigateToSection("calendar")
    );

  document
    .getElementById("navHabitBtn")
    ?.addEventListener(
      "click",
      () => navigateToSection("habit")
    );

  document
    .getElementById("navStatsBtn")
    ?.addEventListener(
      "click",
      () => navigateToSection("stats")
    );

  document
    .getElementById("navNotesBtn")
    ?.addEventListener(
      "click",
      () => navigateToSection("notes")
    );

  document
    .getElementById("closeTaskModalBtn")
    ?.addEventListener(
      "click",
      closeTaskModal
    );

  document
    .getElementById("saveTaskModalBtn")
    ?.addEventListener(
      "click",
      saveTaskModal
    );

  document
    .getElementById("habitRepeatInput")
    ?.addEventListener(
      "change",
      toggleRepeatOptions
    );

  document
    .getElementById("closeHabitModalBtn")
    ?.addEventListener(
      "click",
      closeHabitModal
    );

  document
    .getElementById("addHabitBtn")
    ?.addEventListener(
      "click",
      addHabit
    );

  document
    .getElementById("addNoteBtn")
    ?.addEventListener(
      "click",
      openNoteModal
    );

  document
    .getElementById("closeNoteModalBtn")
    ?.addEventListener(
      "click",
      closeNoteModal
    );

  document
    .getElementById("shareStatsBtn")
    ?.addEventListener(
      "click",
      triggerShare
    );

  document
    .getElementById("saveNoteModalBtn")
    ?.addEventListener(
      "click",
      saveNoteModal
    );
}

/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    try {
      updateSplashWelcome();
    } catch (e) {
      console.error("Error updating splash screen:", e);
    }

    try {
      resetHabitsDaily();
      resetTasksDaily();
      refreshUI();
      checkTaskReminders();
      checkDeadlines();
      loadTheme();
    } catch (e) {
      console.error("Error during initialization:", e);
    }

    // Inisialisasi Firebase Auth & Sinkronisasi
    initAuth((cloudData) => {
      console.log("Data berhasil ditarik dari cloud:", cloudData);
      
      // Update state lokal dengan data dari cloud
      if(cloudData.appData) state.appData = cloudData.appData;
      if(cloudData.xp) state.xp = cloudData.xp;
      if(cloudData.habits) state.habits = cloudData.habits;
      if(cloudData.habitHistory) state.habitHistory = cloudData.habitHistory;
      if(cloudData.streakData) state.streakData = cloudData.streakData;
      if(cloudData.historyData) state.historyData = cloudData.historyData;
      if(cloudData.notes) state.notes = cloudData.notes;

      // Simpan paksa ke LocalStorage agar tersinkronisasi
      localStorage.setItem("appData", JSON.stringify(state.appData));
      localStorage.setItem("xp", state.xp.toString());
      localStorage.setItem("habits", JSON.stringify(state.habits));
      localStorage.setItem("habitHistory", JSON.stringify(state.habitHistory));
      localStorage.setItem("streakData", JSON.stringify(state.streakData));
      localStorage.setItem("historyData", JSON.stringify(state.historyData));
      localStorage.setItem("notes", JSON.stringify(state.notes));

      // Render ulang layar
      refreshUI();
      showToast("Data disinkronisasi dengan Cloud!");
    });

    const splash = document.getElementById(
      "splashScreen"
    );

    const hideSplashScreen = () => {
      if (splash && !splash.classList.contains("splash-hide")) {
        splash.classList.add("splash-hide");
      }
    };

    if (splash) {
      setTimeout(hideSplashScreen, 2500);
      window.addEventListener("load", () => {
        setTimeout(hideSplashScreen, 2500);
      });
      // Fallback: ensure splash hides after 5 seconds even if error occurs
      setTimeout(() => {
        if (splash && !splash.classList.contains("splash-hide")) {
          console.warn("Force hiding splash screen due to timeout");
          hideSplashScreen();
        }
      }, 5000);
    }

    initSidebar();
    setupUIEventListeners();
    initShare();

    navigateToSection("home", "dashboard");
    registerServiceWorker();

    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.section) {
        showSection(e.state.section, false);
        setSidebarActive(getNavKeyForSection(e.state.section));
      } else {
        showSection("home", false);
        setSidebarActive("dashboard");
      }
    });
  }
);

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("./sw.js")
      .then((registration) => {
        if (registration.waiting) {
          showToast("Update tersedia. Refresh halaman untuk versi terbaru.");
        }

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                showToast("Update tersedia. Reload untuk memuat versi terbaru.");
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn("ServiceWorker registration failed:", error);
      });
  }
}

function resetHabitsDaily(){

  const today =
    new Date()
    .toISOString()
    .split("T")[0];

  const lastReset =
    localStorage.getItem(
      "habitResetDate"
    );

  if(lastReset === today)
    return;

  state.habits.forEach(category=>{

    category.habits.forEach(habit=>{

      habit.done = false;
    });
  });

  localStorage.setItem(
    "habitResetDate",
    today
  );
  saveToLocal();
}

function resetTasksDaily(){

  const today =
    getToday();

  const lastReset =
    localStorage.getItem(
      "taskResetDate"
    );

  if(lastReset === today)
    return;

  state.appData.forEach(category=>{

    category.tasks.forEach(task=>{

      task.done = false;
    });
  });

  localStorage.setItem(
    "taskResetDate",
    today
  );

  saveToLocal();
}

/* =========================
   REFRESH UI
========================= */

export function refreshUI() {
  
  refreshTaskUI()
refreshStatsUI()
refreshHabitUI()
refreshCalendarUI()
renderNotes()
  
}

function refreshTaskUI(){

  renderTasks();

  if (state.appData.length > 0) {
    document.body.classList.add("has-categories");
  } else {
    document.body.classList.remove("has-categories");
  }

  updateLevel();
  updateQuickStats();
  updateProgressRing();

  generateHeatmap();

  loadRandomQuote();

  updateImproveStats();
}


function refreshHabitUI(){

  renderHabits();
}

function refreshCalendarUI(){

  renderCalendar();
}

function loadRandomQuote() {

  if (!quotes.length) return;

  const today =
    new Date()
    .toDateString();

  let savedDate =
    localStorage.getItem(
      "quoteDate"
    );

  let savedQuote =
    localStorage.getItem(
      "dailyQuote"
    );

  // if today
  if (savedDate !== today) {

    const random =
      quotes[
        Math.floor(
          Math.random() * quotes.length
        )
      ];

    savedQuote =
      JSON.stringify(random);

    localStorage.setItem(
      "dailyQuote",
      savedQuote
    );

    localStorage.setItem(
      "quoteDate",
      today
    );
  }

  const quote =
    JSON.parse(savedQuote);

  document.getElementById(
    "quoteText"
  ).innerText =
    `"${quote.text}"`;

  document.getElementById(
    "quoteAuthor"
  ).innerText =
    `— ${quote.author}`;
}

/* =========================
   UNDO REDO
========================= */

function undo() {

  if (!state.undoStack.length)
    return;

  state.redoStack.push(
    JSON.stringify({
      appData: state.appData,
      xp: state.xp,
      habits: state.habits,
      historyData: state.historyData,
      streakData: state.streakData
    })
  );

  const prev =
    JSON.parse(
      state.undoStack.pop()
    );

  state.appData =
    prev.appData;

  state.xp =
    prev.xp;

  state.habits =
    prev.habits;

  state.historyData =
    prev.historyData;

  state.streakData =
    prev.streakData;

  saveToLocal();

  refreshUI();
}

function redo() {

  if (!state.redoStack.length)
    return;

  state.undoStack.push(
    JSON.stringify({
      appData: state.appData,
      xp: state.xp,
      habits: state.habits,
      historyData: state.historyData,
      streakData: state.streakData
    })
  );

  const next =
    JSON.parse(
      state.redoStack.pop()
    );

  state.appData =
    next.appData;

  state.xp =
    next.xp;

  state.habits =
    next.habits;

  state.historyData =
    next.historyData;

  state.streakData =
    next.streakData;

  saveToLocal();

  refreshUI();
}

/* =========================
   FLOATING BUTTON
========================= */

document
  .getElementById(
    "floatingAddBtn"
  )
  .addEventListener(
    "click",
    () => {

      // CEK CATEGORY ADA
      if (
        state.appData.length === 0
      ) {

        showToast(
          "Buat category dulu"
        );

        return;
      }

      // DEFAULT KE CATEGORY PERTAMA
      state.currentCategoryIndex = 
      state.appData.length -1;

      openTaskModal();
    }
  );

/* =========================
   SPLASH
========================= */

/* =========================
   SPLASH WELCOME
========================= */

function updateSplashWelcome(){

  let level =
    getLevelData().level;

  if(level > 10){
    level = 10;
  }

  const splashData = [

    {
      title:
        "Welcome, Rookie 👋",

      quote:
        "Every great person started from zero."
    },

    {
      title:
        "Welcome, Grinder 🔥",

      quote:
        "Small daily consistency beats momentary motivation."
    },

    {
      title:
        "Welcome, Focused 🎯",

      quote:
        "Focus on progress, not perfection."
    },

    {
      title:
        "Welcome, Achiever ⚡",

      quote:
        "Productivity is not being busy, but getting important things done."
    },

    {
      title:
        "Welcome, Discipline 🧠",

      quote:
        "Discipline keeps you going when motivation is gone.."
    },

    {
      title:
        "Welcome, Advanced 🚀",

      quote:
        "You've come further than most people.."
    },

    {
      title:
        "Welcome, Elite 👑",

      quote:
        "High levels come from thousands of small steps."
    },

    {
      title:
        "Welcome, MasterMind 🔥",

      quote:
        "A master is not one who is perfect, but one who continues to develop."
    },

    {
      title:
        "Welcome, Legend ⚔️",

      quote:
        "Legends are shaped by years of consistency."
    },

    {
      title:
        "Welcome, Monster 💀",

      quote:
        "You are no longer chasing others. You are surpassing yourself."
    }
  ];

  const data =
    splashData[level - 1];

  const levelEl = document.getElementById("splashLevelText");
  const quoteEl = document.getElementById("splashQuote");

  if (levelEl && data) {
    levelEl.innerText = data.title;
  }

  if (quoteEl && data) {
    quoteEl.innerText = data.quote;
  }
}

// Removed automatic hide on window.load to ensure configured timeout applies

/* =========================
   INSTALL PWA
========================= */

window.addEventListener(
  "beforeinstallprompt",
  (e) => {

    e.preventDefault();

    deferredPrompt = e;

    document.getElementById(
      "installBtn"
    ).style.display =
      "block";
  }
);

document
  .getElementById(
    "installBtn"
  )
  .addEventListener(
    "click",
    async () => {

      if (!deferredPrompt)
        return;

      deferredPrompt.prompt();

      deferredPrompt = null;
    }
  );
  
  /* =========================
   TASK REMINDER
========================= */

function checkDeadlines(){

  if(
    !("Notification" in window)
  ) return;

  if(
    Notification.permission !==
    "granted"
  ) return;

  const today = new Date();

  state.appData.forEach((category) => {
    category.tasks.forEach((task) => {
      if (task.done || !task.deadline) return;

      const deadline = new Date(task.deadline);
      const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

      if (diff === 0) {
        const notifyKey = `deadline_${task.name}_${task.deadline}`;
        if (localStorage.getItem(notifyKey)) return;

        localStorage.setItem(notifyKey, "sent");
        new Notification("⏰ Deadline Hari Ini", {
          body: task.name
        });
        showToast("Deadline hari ini!");
      }
    });
  });
}

/* =========================
   TASK TIME REMINDER
========================= */

function checkTaskReminders(){

  if(
    !("Notification" in window)
  ) return;

  if(
    Notification.permission !==
    "granted"
  ) return;

  const now = new Date();
  const currentDate = getLocalDate(now);
  const currentHour = String(now.getHours()).padStart(2, "0");
  const currentMinute = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${currentHour}:${currentMinute}`;

  state.appData.forEach((category) => {
    category.tasks.forEach((task) => {
      if (task.done || !task.deadline || !task.time) return;
      if (task.deadline !== currentDate) return;

      if (task.time === currentTime) {
        const notifyKey = `notif_${task.name}_${currentDate}_${currentTime}`;
        if (localStorage.getItem(notifyKey)) return;

        new Notification("🔔 Reminder Task", {
          body: `${task.name}\n• ${task.time}`
        });

        showToast(`Reminder:\n${task.name}`);
        localStorage.setItem(notifyKey, "sent");
      }
    });
  });
}

document.addEventListener(
  "visibilitychange",
  () => {

    if(!document.hidden){
      checkTaskReminders();
    }
  }
);


setInterval(()=>{
  checkTaskReminders();
},60000);

  
