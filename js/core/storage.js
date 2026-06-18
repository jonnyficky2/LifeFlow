import { state, STORAGE_KEYS } from "./state.js";
import { showToast } from "./utils.js";
import { saveToCloud } from "../modules/cloud-sync.js";

// Membatasi history maksimal 90 hari agar data tidak bengkak
export function trimHistory(historyData) {
  const keys = Object.keys(historyData);
  while (keys.length > 90) {
    delete historyData[keys.shift()];
  }
}

// Menyimpan state saat ini ke LocalStorage dan Cloud
export function saveToLocal() {
  trimHistory(state.historyData);

  // Simpan data persistent ke LocalStorage (Otomatis & Dinamis)
  localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(state.appData));
  localStorage.setItem(STORAGE_KEYS.XP, state.xp.toString()); // Angka dijadikan string
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(state.habits));
  localStorage.setItem(STORAGE_KEYS.HABIT_HISTORY, JSON.stringify(state.habitHistory));
  localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(state.streakData));
  localStorage.setItem(STORAGE_KEYS.HISTORY_DATA, JSON.stringify(state.historyData));
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(state.notes));

  // Sinkronisasi ke Cloud secara otomatis hanya jika sedang online
  if (navigator.onLine) {
    try {
      saveToCloud(state);
    } catch (error) {
      console.error("Failed to sync to Cloud:", error);
    }
  } else {
    console.warn("Offline: Data remains safe in local storage.");
  }
}

// Otomatis sinkronisasi data saat koneksi internet kembali (online)
window.addEventListener("online", () => {
  console.log("Connection restored! Syncing data...");
  saveToCloud(state); // saveToCloud is from cloud-sync.js
  showToast("Back online! Data synced to Cloud.", 'success');
});

// Menyimpan riwayat perubahan untuk fitur Undo
export function saveState() {
  const currentStateSnapshot = JSON.stringify({
    appData: state.appData,
    xp: state.xp,
    habits: state.habits,
    historyData: state.historyData,
    habitHistory: state.habitHistory,
    streakData: state.streakData,
    notes: state.notes
  });

  state.undoStack.push(currentStateSnapshot);
  
  // Batasi undo maksimal 30 langkah
  if (state.undoStack.length > 30) {
    state.undoStack.shift();
  }

  // Kosongkan redo saat ada aksi baru
  state.redoStack = [];
}

// Mengunduh data sebagai file JSON
export function exportData() {
  const exportPayload = {
    appData: state.appData,
    xp: state.xp,
    habits: state.habits,
    historyData: state.historyData,
    habitHistory: state.habitHistory,
    streakData: state.streakData,
    notes: state.notes
  };

  const dataString = JSON.stringify(exportPayload, null, 2); // Tambah formatting indent 2 spasi agar mudah dibaca manusia
  const blob = new Blob([dataString], { type: "application/json" });
  const a = document.createElement("a");
  
  a.href = URL.createObjectURL(blob);
  a.download = `lifeflow-backup-${new Date().toISOString().split('T')[0]}.json`; // Nama file lebih deskriptif dengan tanggal
  a.click();
  
  // Bersihkan URL object dari memori
  URL.revokeObjectURL(a.href);
  showToast("Data exported successfully!", 'success');
}

// Membaca dan menerapkan data dari file JSON
export function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);

      // Timpa state saat ini dengan data yang diimport
      state.appData = imported.appData || [];
      state.xp = Number(imported.xp) || 0;
      state.habits = imported.habits || [];
      state.historyData = imported.historyData || {};
      state.habitHistory = imported.habitHistory || {};
      state.streakData = imported.streakData || [];
      state.notes = imported.notes || [];

      // Simpan perubahan ke Local & Cloud
      saveToLocal();
      
      showToast("Data restored successfully!");
      
      // Reload halaman agar UI merender ulang dengan data baru
      setTimeout(() => window.location.reload(), 1000); // Reload to apply changes

    } catch (err) {
      console.error("Import error:", err);
      showToast("Corrupted or invalid file.", 'error');
    }
  };

  // Kosongkan value input agar bisa pilih file yang sama lagi jika perlu
  event.target.value = ""; 
  reader.readAsText(file);
}