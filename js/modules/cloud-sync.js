import { auth, db, provider, signInWithRedirect, signInWithPopup, getRedirectResult, signOut, onAuthStateChanged, doc, setDoc, getDoc } from "./firebase-config.js";
import { showToast } from "../core/utils.js";
import { state } from "../core/state.js";

export function initAuth(onDataSyncedCallback) {
  const loginBtn = document.getElementById("loginBtn");
  const modalLoginBtn = document.getElementById("modalLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.querySelector(".sidebar-name");
  const userEmailEl = document.querySelector(".sidebar-email");
  const userImgEl = document.querySelector(".sidebar-profile-img");
  const authModal = document.getElementById("authModal");
  const skipAuthBtn = document.getElementById("skipAuthBtn");
  const navLoginBtn = document.getElementById("navLoginBtn");
  const navUserImg = document.getElementById("navUserImg");
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if ((isStandalone || window.innerWidth <= 1100) && authModal) {
    authModal.style.display = "none";
  }

  if (window.location.hostname === "127.0.0.1") {
    console.warn("Warning: Google Firebase login might fail on 127.0.0.1. Use localhost.");
  }

  // Handle redirect result from previous redirect login
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        console.log("Redirect login successful:", result.user);
        sessionStorage.removeItem("guestMode");
        if (authModal) authModal.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Redirect login error:", error);
      showToast("Login failed. Check console for details.");
    });

  const handleLogin = async (btn) => {
    const originalText = btn?.textContent || "Login";
    try {
      if (btn) {
        btn.textContent = "Membuka Popup...";
        btn.disabled = true;
      }
      
      // Kita kembali menggunakan Popup karena signInWithRedirect 
      // TIDAK didukung di Github Pages oleh browser modern (karena Third-Party Cookies diblokir).
      // Jika popup ini stuck/hang, itu berarti domain Github Pages atau localhost Anda BELUM ditambahkan 
      // ke "Authorized Domains" di Firebase Console.
      await signInWithPopup(auth, provider);
      
      sessionStorage.removeItem("guestMode");
      if (authModal) authModal.style.display = "none";
    } catch (error) {
      console.error("Firebase Login Error:", error.code, error.message);
      
      if (error.code === 'auth/popup-closed-by-user') {
        showToast("Login dibatalkan.");
      } else if (error.code === 'auth/unauthorized-domain') {
        showToast("Error: Domain ini belum diizinkan di Firebase Console.");
      } else {
        showToast("Login gagal. Periksa koneksi atau console.");
      }
      
      if (btn) {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    }
  };

  // Event Listeners for Login
  loginBtn?.addEventListener("click", () => handleLogin(loginBtn));
  modalLoginBtn?.addEventListener("click", () => handleLogin(modalLoginBtn));
  
  // Navbar button opens choices modal
  navLoginBtn?.addEventListener("click", () => {
    if (authModal) authModal.style.display = "flex";
  });

  // Click profile photo in navbar to open sidebar
  navUserImg?.addEventListener("click", () => {
    document.getElementById("sidebarToggle")?.click();
  });

  // Skip Auth / Guest Mode
  skipAuthBtn?.addEventListener("click", () => {
    if (authModal) authModal.style.display = "none";
    sessionStorage.setItem("guestMode", "true");
  });

  // Logout Function
  logoutBtn?.addEventListener("click", () => {
    sessionStorage.removeItem("guestMode");
    signOut(auth).catch((err) => console.error("Failed to logout", err));
  });

  // Account Status Change Listener
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Logged in
      if(loginBtn) loginBtn.style.display = "none";
      if(logoutBtn) logoutBtn.style.display = "block";
      if(userNameEl) userNameEl.textContent = user.displayName;
      if(userEmailEl) userEmailEl.textContent = user.email;
      if(userImgEl) {
        userImgEl.src = user.photoURL || "./assets/icons/icon.svg";
        userImgEl.onerror = () => { userImgEl.src = "./assets/icons/icon.svg"; };
      }
      if(authModal) authModal.style.display = "none";
      sessionStorage.removeItem("guestMode");
      
      if(navLoginBtn) navLoginBtn.style.display = "none";
      if(navUserImg) {
        navUserImg.style.display = "block";
        navUserImg.src = user.photoURL || "./assets/icons/icon.svg";
        navUserImg.onerror = () => { navUserImg.src = "./assets/icons/icon.svg"; };
      }

      // Pull data
      await syncDataFromCloud(user.uid, onDataSyncedCallback);
    } else {
      // Not logged in / Guest
      if(loginBtn) {
        loginBtn.style.display = "block";
        loginBtn.textContent = "Login with Google";
        loginBtn.disabled = false;
      }
      if(logoutBtn) logoutBtn.style.display = "none";
      if(userNameEl) userNameEl.textContent = "Guest User";
      if(userEmailEl) userEmailEl.textContent = "Login to save data online";
      if(userImgEl) userImgEl.src = "./assets/icons/icon.svg";
      
      if(navLoginBtn) navLoginBtn.style.display = "block";
      if(navUserImg) navUserImg.style.display = "none";

      if (typeof onDataSyncedCallback === 'function') onDataSyncedCallback(state);
    }
  });
}

// Save Data Function
export async function saveToCloud(appStateData) {
  const user = auth.currentUser;
  if (!user) return; 
  
  try {
    await setDoc(doc(db, "users", user.uid), { data: appStateData }, { merge: true });
  } catch (error) {
    console.error("Failed to save to cloud:", error);
    showToast("Failed to save to Cloud. Check your connection.");
  }
}

/**
 * Merges local state with cloud data to prevent data loss.
 * Simple strategy: Cloud data takes precedence for existing tasks, 
 * but local categories/tasks not in cloud are preserved.
 */
function mergeState(local, cloud) {
  if (!cloud) return local;
  
  const mergedAppData = [...cloud.appData || []];
  
  // Add local categories that don't exist in cloud (by name)
  if (local.appData) {
    local.appData.forEach(localCat => {
      const cloudCat = mergedAppData.find(c => c.name === localCat.name);
      if (!cloudCat) {
        mergedAppData.push(localCat);
      } else {
        // Merge tasks within the same category
        localCat.tasks.forEach(localTask => {
          const hasTask = cloudCat.tasks.some(t => t.name === localTask.name);
          if (!hasTask) cloudCat.tasks.push(localTask);
        });
      }
    });
  }

  return {
    ...local,
    ...cloud,
    appData: mergedAppData,
    xp: Math.max(local.xp || 0, cloud.xp || 0)
  };
}

// Pull Data Function
async function syncDataFromCloud(uid, callback) {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const cloudData = docSnap.data().data;
      if (cloudData) {
        const mergedData = mergeState(state, cloudData);
        callback(mergedData);
        showToast("Data synced from cloud");
      }
    } else {
      // If new user (no data in cloud yet), 
      // immediately upload local data (guest data) to their new account
      console.log("New user detected, uploading local data...");
      await saveToCloud(state);
      showToast("Account initialized with your local data");
    }
  } catch (error) {
    console.error("Failed to fetch data from cloud:", error);
    showToast("Sync failed. Using local data.");
  }
}
