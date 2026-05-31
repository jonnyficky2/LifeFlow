export const state = {

  appData: JSON.parse(
    localStorage.getItem("appData") || "[]"
  ),

  xp: Number(
    localStorage.getItem("xp")
  ) || 0,

  habits: JSON.parse(
    localStorage.getItem("habits") || "[]"
  ),

  habitHistory: JSON.parse(
    localStorage.getItem("habitHistory") || "{}"
  ),

  streakData: JSON.parse(
    localStorage.getItem("streakData") || "[]"
  ),

  historyData: JSON.parse(
    localStorage.getItem("historyData") || "{}"
  ),

  undoStack: [],
  redoStack: [],

  searchValue: "",
  currentFilter: "all",

  currentDate: new Date(),

  currentCategoryIndex: null,
  currentHabitCategoryIndex: null
};

