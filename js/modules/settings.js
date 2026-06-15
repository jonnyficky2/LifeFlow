import { state } from "../core/state.js";
import { saveState, exportData, importData } from "../core/storage.js";
import { showToast } from "../core/utils.js";
import { auth, db, signOut, doc, setDoc } from "./firebase-config.js";
import { onAuthStateChanged } from "./firebase-config.js";
import { sendEmailVerification, deleteUser } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { saveToCloud } from "./cloud-sync.js";

const VERSION = "1.2.0";
const BUILD_NUMBER = "20260515";

export function initSettings() {
  const settingsGrid = document.getElementById("settingsGrid");
  if (!settingsGrid) return;

  renderSettingsUI(settingsGrid);
  bindSettingsEvents();

  // Listen for auth state changes to update the Account card
  if (typeof onAuthStateChanged === "function") {
    onAuthStateChanged(auth, (user) => {
      updateAccountCard(user);
    });
  }
}

function renderSettingsUI(container) {
  container.innerHTML = `
    <!-- 1. Account -->
    <div class="settings-card" id="accountCard">
      <h3>👤 Account</h3>
      <div class="settings-profile">
        <img id="setProfileImg" src="./assets/icons/icon.svg" alt="Profile" referrerpolicy="no-referrer">
        <div class="settings-profile-info">
          <h4 id="setProfileName">Guest User</h4>
          <p id="setProfileEmail">Local Data Only</p>
          <span id="setProfileStatus" style="font-size: 12px; color: #48d66d; margin-top: 4px; display: inline-block;"></span>
        </div>
      </div>
      <div class="settings-row">
        <button class="settings-btn outline" id="setLoginBtn" style="width: 100%;">Sign In / Register</button>
      </div>
      <div id="setAccountActions" style="display: none; flex-direction: column; gap: 12px;">
        <div class="settings-row">
          <button class="settings-btn outline" id="setEditProfileBtn" style="flex: 1;">Edit Profile</button>
          <button class="settings-btn outline" id="setChangePwdBtn" style="flex: 1;">Change Password</button>
        </div>
        <div class="settings-row">
          <div class="settings-row-label">
            <span class="settings-row-title">Email Verification</span>
            <span class="settings-row-desc" id="setVerifyDesc">Check your verification status</span>
          </div>
          <button class="settings-btn outline" id="setVerifyBtn">Verify</button>
        </div>
        <button class="settings-btn danger" id="setLogoutBtn" style="width: 100%;">Sign Out</button>
      </div>
    </div>

    <!-- 2. Appearance -->
    <div class="settings-card">
      <h3>🎨 Appearance</h3>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Theme</span>
          <span class="settings-row-desc">Select your app theme</span>
        </div>
        <select class="settings-select" id="setThemeSelect">
          <option value="system">System Default</option>
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
        </select>
      </div>
    </div>

    <!-- 3. Notifications -->
    <div class="settings-card">
      <h3>🔔 Notifications</h3>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Habit Reminders</span>
          <span class="settings-row-desc">Get notified for incomplete habits</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="setNotifHabit" checked>
          <span class="slider"></span>
        </label>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Task Reminders</span>
          <span class="settings-row-desc">Get notified for upcoming tasks</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="setNotifTask" checked>
          <span class="slider"></span>
        </label>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Daily Summary</span>
          <span class="settings-row-desc">Morning overview of your day</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="setNotifSummary" checked>
          <span class="slider"></span>
        </label>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Sound Notification</span>
          <span class="settings-row-desc">Play sound on completion</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="setNotifSound" checked>
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <!-- 4. Productivity -->
    <div class="settings-card">
      <h3>⚡ Productivity</h3>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Start of Week</span>
          <span class="settings-row-desc">First day of the calendar</span>
        </div>
        <select class="settings-select" id="setStartWeek">
          <option value="monday">Monday</option>
          <option value="sunday">Sunday</option>
        </select>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Default Task Priority</span>
          <span class="settings-row-desc">When creating new tasks</span>
        </div>
        <select class="settings-select" id="setDefaultPriority">
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Default Calendar View</span>
          <span class="settings-row-desc">Initial view for calendar</span>
        </div>
        <select class="settings-select" id="setDefaultCalView">
          <option value="month" selected>Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Habit Goal Display</span>
          <span class="settings-row-desc">How to show progress</span>
        </div>
        <select class="settings-select" id="setHabitDisplay">
          <option value="percentage" selected>Percentage</option>
          <option value="count">Count (e.g., 2/5)</option>
        </select>
      </div>
    </div>

    <!-- 5. Data Management -->
    <div class="settings-card">
      <h3>💾 Data Management</h3>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Sync Status</span>
          <span class="settings-row-desc" id="setSyncStatusDesc">Not synced</span>
          <span id="setLastSyncTime" style="font-size: 11px; color: var(--dash-muted); display: block; margin-top: 4px;"></span>
        </div>
        <button class="settings-btn" id="setSyncBtn">Sync Now</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Backup Data</span>
          <span class="settings-row-desc">Download a backup JSON</span>
        </div>
        <button class="settings-btn outline" id="setExportBtn">Export</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Restore Data</span>
          <span class="settings-row-desc">Restore from JSON backup</span>
        </div>
        <button class="settings-btn outline" id="setImportBtn">Import</button>
        <input type="file" id="setImportInput" accept=".json" hidden>
      </div>
    </div>

    <!-- 6. Statistics Summary -->
    <div class="settings-card">
      <h3>📊 Your Statistics</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px;">
        <div>
          <span style="font-size: 12px; color: var(--dash-muted);">Total Tasks</span>
          <div style="font-size: 20px; font-weight: 600;" id="setStatTotalTasks">0</div>
        </div>
        <div>
          <span style="font-size: 12px; color: var(--dash-muted);">Completed Tasks</span>
          <div style="font-size: 20px; font-weight: 600; color: #48d66d;" id="setStatCompletedTasks">0</div>
        </div>
        <div>
          <span style="font-size: 12px; color: var(--dash-muted);">Total Habits</span>
          <div style="font-size: 20px; font-weight: 600;" id="setStatHabits">0</div>
        </div>
        <div>
          <span style="font-size: 12px; color: var(--dash-muted);">Completed Habits</span>
          <div style="font-size: 20px; font-weight: 600; color: #48d66d;" id="setStatCompletedHabits">0</div>
        </div>
        <div>
          <span style="font-size: 12px; color: var(--dash-muted);">Current Streak</span>
          <div style="font-size: 20px; font-weight: 600; color: #f2c94c;" id="setStatCurrStreak">0 Days</div>
        </div>
        <div>
          <span style="font-size: 12px; color: var(--dash-muted);">Longest Streak</span>
          <div style="font-size: 20px; font-weight: 600; color: #f2c94c;" id="setStatStreak">0 Days</div>
        </div>
        <div>
          <span style="font-size: 12px; color: var(--dash-muted);">Total Notes</span>
          <div style="font-size: 20px; font-weight: 600;" id="setStatNotes">0</div>
        </div>
        <div>
          <span style="font-size: 12px; color: var(--dash-muted);">Productivity Score</span>
          <div style="font-size: 20px; font-weight: 600; color: #91bdff;" id="setStatProdScore">0</div>
        </div>
      </div>
    </div>

    <!-- 7. Help & Support -->
    <div class="settings-card">
      <h3>❓ Help & Support</h3>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">FAQ</span>
          <span class="settings-row-desc">Frequently asked questions</span>
        </div>
        <button class="settings-btn outline" id="setFaqBtn">View</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Report a Bug</span>
          <span class="settings-row-desc">Help us improve</span>
        </div>
        <button class="settings-btn outline" id="setReportBtn">Report</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">Request Feature</span>
          <span class="settings-row-desc">Suggest a new idea</span>
        </div>
        <button class="settings-btn outline" id="setRequestBtn">Request</button>
      </div>
      <div class="settings-row" style="flex-direction: column; align-items: flex-start; gap: 12px;">
        <div class="settings-row-label">
          <span class="settings-row-title">Contact Developer</span>
          <span class="settings-row-desc">Connect with me on social media</span>
        </div>
        <div style="display: flex; gap: 8px; width: 100%; flex-wrap: wrap;">
          <button class="settings-btn outline" id="setInstaBtn" style="flex: 1; min-width: 110px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            Instagram
          </button>
          <button class="settings-btn outline" id="setEmailBtn" style="flex: 1; min-width: 110px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Email
          </button>
          <button class="settings-btn outline" id="setLinkedinBtn" style="flex: 1; min-width: 110px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            LinkedIn
          </button>
          <button class="settings-btn outline" id="setGithubBtn" style="flex: 1; min-width: 110px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            GitHub
          </button>
        </div>
      </div>
    </div>

    <!-- 8. About -->
    <div class="settings-card">
      <h3>ℹ️ About</h3>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title">LifeFlow Version</span>
          <span class="settings-row-desc">Build ${BUILD_NUMBER}</span>
        </div>
        <span style="font-weight: 600;">v${VERSION}</span>
      </div>
      <div class="settings-row" style="justify-content: center; gap: 16px; margin-top: 16px;">
        <a href="#" style="color: var(--dash-blue); font-size: 13px;">Privacy Policy</a>
        <a href="#" style="color: var(--dash-blue); font-size: 13px;">Terms of Service</a>
        <a href="#" style="color: var(--dash-blue); font-size: 13px;">Open Source Licenses</a>
      </div>
    </div>

    <!-- 9. Danger Zone -->
    <div class="settings-card" style="border-color: rgba(255, 77, 77, 0.3);">
      <h3 style="color: #ff4d4d;">⚠️ Danger Zone</h3>
      <div class="settings-row">
        <div class="settings-row-label">
          <span class="settings-row-title" style="color: #ff4d4d;">Delete Account</span>
          <span class="settings-row-desc">Permanently delete all your data</span>
        </div>
        <button class="settings-btn danger" id="setDeleteAccBtn">Delete</button>
      </div>
    </div>
  `;

  // Apply saved preferences to UI
  if (state.settings) {
    document.getElementById("setThemeSelect").value = state.settings.theme || "dark";
    document.getElementById("setNotifHabit").checked = state.settings.notifHabit !== false;
    document.getElementById("setNotifTask").checked = state.settings.notifTask !== false;
    document.getElementById("setNotifSummary").checked = state.settings.notifSummary !== false;
    document.getElementById("setNotifSound").checked = state.settings.notifSound !== false;
    document.getElementById("setStartWeek").value = state.settings.startWeek || "monday";
    document.getElementById("setDefaultPriority").value = state.settings.defaultPriority || "medium";
    document.getElementById("setDefaultCalView").value = state.settings.defaultCalView || "month";
    document.getElementById("setHabitDisplay").value = state.settings.habitDisplay || "percentage";
  }

  updateStatsUI();
}

function updateAccountCard(user) {
  const loginBtnContainer = document.getElementById("setLoginBtn")?.parentElement;
  const actionsContainer = document.getElementById("setAccountActions");
  
  if (user) {
    document.getElementById("setProfileName").textContent = user.displayName || "User";
    document.getElementById("setProfileEmail").textContent = user.email;
    const imgEl = document.getElementById("setProfileImg");
    imgEl.src = user.photoURL || "./assets/icons/icon.svg";
    imgEl.onerror = () => { imgEl.src = "./assets/icons/icon.svg"; };
    
    document.getElementById("setVerifyDesc").textContent = user.emailVerified ? "Email verified" : "Email not verified";
    document.getElementById("setVerifyBtn").style.display = user.emailVerified ? "none" : "block";
    document.getElementById("setProfileStatus").textContent = user.emailVerified ? "✓ Verified" : "";

    document.getElementById("setSyncStatusDesc").textContent = `Synced with ${user.email}`;
    const lastSync = state.lastSync ? new Date(state.lastSync).toLocaleString() : "Never";
    const lastSyncEl = document.getElementById("setLastSyncTime");
    if (lastSyncEl) lastSyncEl.textContent = `Last sync: ${lastSync}`;

    if (loginBtnContainer) loginBtnContainer.style.display = "none";
    if (actionsContainer) actionsContainer.style.display = "flex";
  } else {
    document.getElementById("setProfileName").textContent = "Guest User";
    document.getElementById("setProfileEmail").textContent = "Local Data Only";
    document.getElementById("setProfileImg").src = "./assets/icons/icon.svg";
    document.getElementById("setProfileStatus").textContent = "";
    document.getElementById("setSyncStatusDesc").textContent = "Not synced (Guest)";
    const lastSyncEl = document.getElementById("setLastSyncTime");
    if (lastSyncEl) lastSyncEl.textContent = "";

    if (loginBtnContainer) loginBtnContainer.style.display = "flex";
    if (actionsContainer) actionsContainer.style.display = "none";
  }
}

function updateStatsUI() {
  // Hitung Task dari appData
  let totalTasks = 0;
  let completedTasks = 0;
  (state.appData || []).forEach(cat => {
    (cat.tasks || []).forEach(t => {
      totalTasks++;
      if (t.done) completedTasks++;
    });
  });

  const habits = (state.habits || []).flatMap(cat => cat.habits || []);
  const notes = state.notes || [];
  
  document.getElementById("setStatTotalTasks").textContent = totalTasks;
  document.getElementById("setStatCompletedTasks").textContent = completedTasks;
  
  const completedHabits = habits.filter(h => h.done).length;
  document.getElementById("setStatHabits").textContent = habits.length;
  document.getElementById("setStatCompletedHabits").textContent = completedHabits;
  
  // Streak dari data global
  const currentStreak = state.streakData ? state.streakData.length : 0;
  document.getElementById("setStatCurrStreak").textContent = currentStreak + " Days";

  // Hitung rekor streak tertinggi
  let streaks = habits.map(h => h.streak || 0);
  if (currentStreak > 0) streaks.push(currentStreak);
  const longestStreak = streaks.length > 0 ? Math.max(...streaks) : 0;
  document.getElementById("setStatStreak").textContent = longestStreak + " Days";

  document.getElementById("setStatNotes").textContent = notes.length;

  const prodScore = Math.floor((completedTasks * 10) + (completedHabits * 15) + (currentStreak * 5));
  document.getElementById("setStatProdScore").textContent = prodScore;
}

function bindSettingsEvents() {
  // Theme
  document.getElementById("setThemeSelect")?.addEventListener("change", (e) => {
    saveSetting("theme", e.target.value);
    applyTheme(e.target.value);
  });

  // Notifs
  document.getElementById("setNotifHabit")?.addEventListener("change", (e) => {
    saveSetting("notifHabit", e.target.checked);
  });
  document.getElementById("setNotifTask")?.addEventListener("change", (e) => {
    saveSetting("notifTask", e.target.checked);
  });
  document.getElementById("setNotifSummary")?.addEventListener("change", (e) => {
    saveSetting("notifSummary", e.target.checked);
  });
  document.getElementById("setNotifSound")?.addEventListener("change", (e) => {
    saveSetting("notifSound", e.target.checked);
  });

  // Productivity
  document.getElementById("setStartWeek")?.addEventListener("change", (e) => {
    saveSetting("startWeek", e.target.value);
  });
  document.getElementById("setDefaultPriority")?.addEventListener("change", (e) => {
    saveSetting("defaultPriority", e.target.value);
  });
  document.getElementById("setDefaultCalView")?.addEventListener("change", (e) => {
    saveSetting("defaultCalView", e.target.value);
  });
  document.getElementById("setHabitDisplay")?.addEventListener("change", (e) => {
    saveSetting("habitDisplay", e.target.value);
  });

  // Auth actions
  document.getElementById("setLoginBtn")?.addEventListener("click", () => {
    const authModal = document.getElementById("authModal");
    if (authModal) authModal.style.display = "flex";
  });
  
  document.getElementById("setLogoutBtn")?.addEventListener("click", async () => {
    try {
      if (typeof signOut === "function" && auth) {
        await signOut(auth);
        sessionStorage.removeItem("guestMode");
        showToast("Logged out successfully");
      }
    } catch (e) {
      showToast("Error logging out");
      console.error(e);
    }
  });

  // Account Management
  document.getElementById("setEditProfileBtn")?.addEventListener("click", () => {
    // Karena menggunakan Google Auth, profil dikelola via Google
    window.open("https://myaccount.google.com/personal-info", "_blank");
    showToast("Mengalihkan ke pengaturan profil Google...");
  });

  document.getElementById("setChangePwdBtn")?.addEventListener("click", () => {
    window.open("https://myaccount.google.com/security", "_blank");
    showToast("Mengalihkan ke pengaturan keamanan Google...");
  });

  document.getElementById("setVerifyBtn")?.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        showToast("Email verifikasi telah dikirim ke " + user.email);
      } catch (err) {
        showToast("Gagal mengirim email: " + err.message);
      }
    }
  });

  document.getElementById("setDeleteAccBtn")?.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      // Jika guest, cukup hapus local storage
      if (confirm("Hapus semua data lokal? Tindakan ini tidak bisa dibatalkan.")) {
        localStorage.clear();
        location.reload();
      }
      return;
    }

    if (confirm("Hapus Akun Permanen? Semua data di cloud akan ikut terhapus.")) {
      try {
        await deleteUser(user);
        showToast("Akun berhasil dihapus.");
        setTimeout(() => location.reload(), 1500);
      } catch (err) {
        if (err.code === "auth/requires-recent-login") {
          showToast("Error: Silakan login ulang sebelum menghapus akun.");
        } else {
          showToast("Gagal menghapus akun: " + err.message);
        }
      }
    }
  });

  // Sync
  document.getElementById("setSyncBtn")?.addEventListener("click", async () => {
    if (auth && auth.currentUser) {
      try {
        const btn = document.getElementById("setSyncBtn");
        btn.textContent = "Syncing...";
        btn.disabled = true;
        await saveToCloud(state);
        
        state.lastSync = new Date().toISOString();
        saveState();
        const lastSyncEl = document.getElementById("setLastSyncTime");
        if (lastSyncEl) lastSyncEl.textContent = `Last sync: ${new Date(state.lastSync).toLocaleString()}`;
        
        showToast("Data synced to cloud successfully!");
        btn.textContent = "Sync Now";
        btn.disabled = false;
      } catch (err) {
        showToast("Sync failed");
        console.error(err);
        document.getElementById("setSyncBtn").textContent = "Sync Now";
        document.getElementById("setSyncBtn").disabled = false;
      }
    } else {
      showToast("Please log in to sync data.");
    }
  });

  // Export / Import
  document.getElementById("setExportBtn")?.addEventListener("click", exportData);
  
  const importInput = document.getElementById("setImportInput");
  document.getElementById("setImportBtn")?.addEventListener("click", () => {
    importInput.click();
  });
  importInput?.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      importData(e);
    }
  });

  // Help & Support Actions
  document.getElementById("setFaqBtn")?.addEventListener("click", () => {
    // Simulasi membuka bantuan
    window.open("https://github.com/jonnyficky2/LifeFlow#readme", "_blank");
  });

  document.getElementById("setReportBtn")?.addEventListener("click", () => {
    showToast("Membuka pelaporan bug di GitHub...");
    window.open("https://github.com/jonnyficky2/LifeFlow/issues", "_blank");
  });

  document.getElementById("setRequestBtn")?.addEventListener("click", () => {
    showToast("Kirim saran fitur Anda!");
    window.open("https://github.com/jonnyficky2", "_blank");
  });

  document.getElementById("setInstaBtn")?.addEventListener("click", () => {
    window.open("https://www.instagram.com/jonny.ficky", "_blank");
  });

  document.getElementById("setEmailBtn")?.addEventListener("click", () => {
    window.open("mailto:jonnyficky2@gmail.com", "_blank");
  });

  document.getElementById("setLinkedinBtn")?.addEventListener("click", () => {
    window.open("https://www.linkedin.com/in/jonnyficky-felyang-0a2654416", "_blank");
  });

  document.getElementById("setGithubBtn")?.addEventListener("click", () => {
    window.open("https://github.com/jonnyficky2", "_blank");
  });
}

function saveSetting(key, value) {
  if (!state.settings) state.settings = {};
  state.settings[key] = value;
  saveState();
}

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light-mode");
    localStorage.setItem("lifeflow-theme", "light");
  } else if (theme === "dark") {
    document.body.classList.remove("light-mode");
    localStorage.setItem("lifeflow-theme", "dark");
  } else {
    // system
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    localStorage.setItem("lifeflow-theme", "system");
  }
}
