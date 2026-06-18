import { state } from "../core/state.js";
import { saveState, exportData, importData } from "../core/storage.js";
import { showToast } from "../core/utils.js";
import { auth, db, signOut, doc, setDoc } from "./firebase-config.js";
import { onAuthStateChanged } from "./firebase-config.js";
import { sendEmailVerification, deleteUser } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { saveToCloud } from "./cloud-sync.js";

const VERSION = "1.2.0";
const BUILD_NUMBER = "20260516"; // Updated build number for this refactor

let currentSubmissionType = "Report"; // Flag untuk membedakan Report vs Request

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
    <div class="card settings-card" id="accountCard">
      <h3>👤 Account</h3>
      <div class="settings-profile">
        <img id="setProfileImg" src="./assets/icons/people.png" alt="Profile" referrerpolicy="no-referrer">
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
        <button id="aboutPrivacyPolicyBtn" style="background: transparent; border: none; color: var(--dash-blue); font-size: 13px; cursor: pointer; padding: 0;">Privacy Policy</button>
        <button id="aboutTermsOfServiceBtn" style="background: transparent; border: none; color: var(--dash-blue); font-size: 13px; cursor: pointer; padding: 0;">Terms of Service</button>
        <button id="aboutOpenSourceBtn" style="background: transparent; border: none; color: var(--dash-blue); font-size: 13px; cursor: pointer; padding: 0;">Open Source Licenses</button>
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
    const name = user.displayName || (user.email ? user.email.split('@')[0] : "User");
    document.getElementById("setProfileName").textContent = name;
    document.getElementById("setProfileEmail").textContent = user.email;
    const imgEl = document.getElementById("setProfileImg");
    imgEl.src = user.photoURL || "./assets/icons/people.png";
    imgEl.onerror = () => { imgEl.src = "./assets/icons/people.png"; };
    
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
    document.getElementById("setProfileImg").src = "./assets/icons/people.png";
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
    showToast("Redirecting to Google profile settings...");
  });

  document.getElementById("setChangePwdBtn")?.addEventListener("click", () => {
    window.open("https://myaccount.google.com/security", "_blank");
    showToast("Redirecting to Google security settings...");
  });

  document.getElementById("setVerifyBtn")?.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        showToast("Verification email has been sent to " + user.email);
      } catch (err) {
        showToast("Failed to send email: " + err.message);
      }
    }
  });

  document.getElementById("setDeleteAccBtn")?.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      // Jika guest, cukup hapus local storage
      if (confirm("Delete all local data? This action cannot be undone.")) {
        localStorage.clear();
        location.reload();
      }
      return;
    }

    if (confirm("Permanently delete account? All cloud data will also be deleted.")) {
      try {
        await deleteUser(user);
        showToast("Account deleted successfully.");
        setTimeout(() => location.reload(), 1500);
      } catch (err) {
        if (err.code === "auth/requires-recent-login") {
          showToast("Error: Please re-authenticate before deleting your account.");
        } else {
          showToast("Failed to delete account: " + err.message);
        }
      }
    }
  });

  // Legal & Information Actions (from the main section)
  document.getElementById("privacyPolicyBtn")?.addEventListener("click", () => {
    openLegalModal("Privacy Policy", getPrivacyPolicyContent());
  });

  document.getElementById("termsOfServiceBtn")?.addEventListener("click", () => {
    openLegalModal("Terms of Service", getTermsOfServiceContent());
  });

  document.getElementById("openSourceBtn")?.addEventListener("click", () => {
    openLegalModal("Open Source Licenses", getOpenSourceLicensesContent());
  });

  // Legal & Information Actions (from the About section)
  document.getElementById("aboutPrivacyPolicyBtn")?.addEventListener("click", () => openLegalModal("Privacy Policy", getPrivacyPolicyContent()));
  document.getElementById("aboutTermsOfServiceBtn")?.addEventListener("click", () => openLegalModal("Terms of Service", getTermsOfServiceContent()));
  document.getElementById("aboutOpenSourceBtn")?.addEventListener("click", () => openLegalModal("Open Source Licenses", getOpenSourceLicensesContent()));

  // Close Legal Modal handlers
  document.getElementById("closeLegalModalBtn")?.addEventListener("click", closeLegalModal);
  document.getElementById("legalModal")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      closeLegalModal();
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
    if (!auth.currentUser) {
      showToast("Please log in first to report a bug.");
      const authModal = document.getElementById("authModal");
      if (authModal) authModal.style.display = "flex";
      return;
    }
    
    currentSubmissionType = "Report";
    document.getElementById("reportModalTitle").textContent = "Report Bug / Issue";
    document.getElementById("reportModal")?.classList.add("show");
  });

  document.getElementById("closeReportModalBtn")?.addEventListener("click", () => {
    document.getElementById("reportModal")?.classList.remove("show");
  });

  document.getElementById("submitReportBtn")?.addEventListener("click", () => {
    const subject = document.getElementById("reportSubject").value.trim();
    const description = document.getElementById("reportDescription").value.trim();

    if (!subject || !description) {
      showToast("Please provide a subject and description.");
      return;
    }

    const userEmail = auth.currentUser ? auth.currentUser.email : "Guest";
    const prefix = currentSubmissionType === "Report" ? "[LifeFlow Report] " : "[LifeFlow Request] ";
    const bodyContent = `From: ${userEmail}\n\nDescription:\n${description}`;
    const mailtoLink = `mailto:jonnyficky2@gmail.com?subject=${encodeURIComponent(prefix + subject)}&body=${encodeURIComponent(bodyContent)}`;
    window.location.href = mailtoLink;

    showToast("Opening email client...");
    document.getElementById("reportModal").classList.remove("show");
    
    // Reset input setelah dikirim
    document.getElementById("reportSubject").value = "";
    document.getElementById("reportDescription").value = "";
  });

  document.getElementById("setRequestBtn")?.addEventListener("click", () => {
    if (!auth.currentUser) {
      showToast("Please log in first to request a feature.");
      const authModal = document.getElementById("authModal");
      if (authModal) authModal.style.display = "flex";
      return;
    }

    currentSubmissionType = "Request";
    document.getElementById("reportModalTitle").textContent = "Request New Feature";
    document.getElementById("reportModal")?.classList.add("show");
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

function openLegalModal(title, content) {
  const legalModal = document.getElementById("legalModal");
  const legalModalTitle = document.getElementById("legalModalTitle");
  const legalModalBody = document.getElementById("legalModalBody");

  if (legalModal && legalModalTitle && legalModalBody) {
    legalModalTitle.textContent = title;
    legalModalBody.innerHTML = content; // Use innerHTML to allow for HTML formatting
    legalModal.classList.add("show");
  }
}

function closeLegalModal() {
  const legalModal = document.getElementById("legalModal");
  if (legalModal) {
    legalModal.classList.remove("show");
  }
}

// Placeholder content functions
// These functions return HTML strings for the legal documents.
// In a real application, these would likely be loaded from external files or a CMS.
function getPrivacyPolicyContent() {
  return `
    <h3>LifeFlow Privacy Policy</h3>
    <p>This Privacy Policy describes how LifeFlow collects, uses, and discloses your personal information when you use our application.</p>
    <h4>Information We Collect</h4>
    <p>We collect information you provide directly to us, such as your name, email address, and profile picture when you sign up or log in using Google. We also collect data related to your tasks, habits, and notes within the app.</p>
    <h4>How We Use Your Information</h4>
    <p>We use the information we collect to:</p>
    <ul>
      <li>Provide, maintain, and improve our services.</li>
      <li>Personalize your experience.</li>
      <li>Communicate with you about your account or services.</li>
      <li>Sync your data across devices.</li>
    </ul>
    <h4>Data Sharing and Disclosure</h4>
    <p>We do not share or sell your personal information to third parties for their marketing purposes. We may share information with service providers who perform services on our behalf, such as hosting and analytics.</p>
    <h4>Security</h4>
    <p>We take reasonable measures to protect your information from unauthorized access, use, or disclosure.</p>
    <h4>Changes to This Policy</h4>
    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
    <p>Last updated: May 15, 2026</p>
  `;
}

function getTermsOfServiceContent() {
  return `
    <h3>LifeFlow Terms of Service</h3>
    <p>Welcome to LifeFlow! These Terms of Service ("Terms") govern your access to and use of the LifeFlow application and services ("Services").</p>
    <h4>Acceptance of Terms</h4>
    <p>By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.</p>
    <h4>Use of Services</h4>
    <p>You may use the Services only if you are 13 years or older and are not barred from using the Services under applicable law. You agree to use the Services only for lawful purposes.</p>
    <h4>Your Content</h4>
    <p>You retain ownership of any content you submit, post, or display on or through the Services. By submitting content, you grant LifeFlow a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content in any and all media or distribution methods.</p>
    <h4>Prohibited Conduct</h4>
    <p>You agree not to engage in any of the following prohibited activities:</p>
    <ul>
      <li>Using the Services for any illegal purpose.</li>
      <li>Interfering with or disrupting the integrity or performance of the Services.</li>
      <li>Attempting to gain unauthorized access to the Services or its related systems or networks.</li>
    </ul>
    <h4>Termination</h4>
    <p>We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
    <h4>Disclaimer</h4>
    <p>The Services are provided "as is" without warranties of any kind, either express or implied.</p>
    <p>Last updated: May 15, 2026</p>
  `;
}

function getOpenSourceLicensesContent() {
  return `
    <h3>LifeFlow Open Source Licenses</h3>
    <p>LifeFlow utilizes various open-source libraries and components. We are grateful to the open-source community for their contributions.</p>
    <p>Below is a list of some of the key open-source projects used in LifeFlow and their respective licenses:</p>
    <ul>
      <li><strong>Firebase SDK:</strong> Apache License 2.0</li>
      <li><strong>Chart.js:</strong> MIT License</li>
      <li><strong>Confetti.js:</strong> MIT License</li>
      <li><strong>Poppins Font:</strong> Open Font License (OFL)</li>
      <li><strong>Icons (from Feather Icons):</strong> MIT License</li>
      <li><strong>Color.js (kurkle/color):</strong> MIT License</li>
      <!-- Add more as needed -->
    </ul>
    <p>For full details on each license, please refer to the respective project's documentation.</p>
  `;
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
