// Data Keys yang disimpan di LocalStorage
// Memisahkan nama key seperti ini mencegah typo di kemudian hari
export const STORAGE_KEYS = {
  APP_DATA: "appData",
  XP: "xp",
  HABITS: "habits",
  HABIT_HISTORY: "habitHistory",
  STREAK_DATA: "streakData",
  HISTORY_DATA: "historyData",
  NOTES: "notes"
};

// Fungsi helper kecil untuk mengambil dan parse JSON dari LocalStorage dengan aman
function getLocalData(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Gagal membaca ${key} dari LocalStorage:`, error);
    return defaultValue;
  }
}

// Global State Aplikasi
export const state = {
  // --- Persistent Data (Disimpan ke LocalStorage & Cloud) ---
  appData: getLocalData(STORAGE_KEYS.APP_DATA, []),
  xp: Number(localStorage.getItem(STORAGE_KEYS.XP)) || 0, // XP berupa angka, bukan JSON
  habits: getLocalData(STORAGE_KEYS.HABITS, []),
  habitHistory: getLocalData(STORAGE_KEYS.HABIT_HISTORY, {}),
  streakData: getLocalData(STORAGE_KEYS.STREAK_DATA, []),
  historyData: getLocalData(STORAGE_KEYS.HISTORY_DATA, {}),
  notes: getLocalData(STORAGE_KEYS.NOTES, []),

  // --- Temporary Data (Hanya saat aplikasi berjalan) ---
  undoStack: [],
  redoStack: [],
  searchValue: "",
  currentFilter: "all",
  currentDate: new Date(),
  currentCategoryIndex: null,
  currentHabitCategoryIndex: null
};