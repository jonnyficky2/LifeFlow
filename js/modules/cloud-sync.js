import { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc } from "./firebase-config.js";
import { showToast } from "../core/utils.js";

export function initAuth(onDataSyncedCallback) {
  const loginBtn = document.getElementById("loginBtn");
  const modalLoginBtn = document.getElementById("modalLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.querySelector(".sidebar-name");
  const userEmailEl = document.querySelector(".sidebar-email");
  const userImgEl = document.querySelector(".sidebar-profile-img");
  const authModal = document.getElementById("authModal");
  const skipAuthBtn = document.getElementById("skipAuthBtn");

  if (window.location.hostname === "127.0.0.1") {
    console.warn("Warning: Google Firebase login might fail on 127.0.0.1. Use localhost.");
  }

  const handleLogin = async (btn) => {
    try {
      if (btn) {
        btn.textContent = "Opening Popup...";
        btn.disabled = true;
      }
      
      const result = await signInWithPopup(auth, provider);
      console.log("Login successful:", result.user.email);
      if (authModal) authModal.style.display = "none";

    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to login. If popup is blocked, please allow popups for this site. Error: " + error.message);
      
      if (btn) {
        btn.textContent = "Login with Google";
        btn.disabled = false;
      }
    }
  };

  // Event Listeners for Login
  loginBtn?.addEventListener("click", () => handleLogin(loginBtn));
  modalLoginBtn?.addEventListener("click", () => handleLogin(modalLoginBtn));

  // Skip Auth / Guest Mode
  skipAuthBtn?.addEventListener("click", () => {
    if (authModal) authModal.style.display = "none";
    sessionStorage.setItem("guestMode", "true");
  });

  // Fungsi Logout
  logoutBtn?.addEventListener("click", () => {
    sessionStorage.removeItem("guestMode");
    signOut(auth).catch((err) => console.error("Failed to logout", err));
  });

  // Listener Perubahan Status Akun
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Sedang login
      if(loginBtn) loginBtn.style.display = "none";
      if(logoutBtn) logoutBtn.style.display = "block";
      if(userNameEl) userNameEl.textContent = user.displayName;
      if(userEmailEl) userEmailEl.textContent = user.email;
      if(userImgEl) userImgEl.src = user.photoURL;
      if(authModal) authModal.style.display = "none";

      // Tarik data
      await syncDataFromCloud(user.uid, onDataSyncedCallback);
    } else {
      // Tidak login / Guest
      if(loginBtn) {
        loginBtn.style.display = "block";
        loginBtn.textContent = "Login with Google";
        loginBtn.disabled = false;
      }
      if(logoutBtn) logoutBtn.style.display = "none";
      if(userNameEl) userNameEl.textContent = "Guest User";
      if(userEmailEl) userEmailEl.textContent = "Login to save data online";
      if(userImgEl) userImgEl.src = "./assets/icons/icon.svg";

      // Prompt login if not in guest mode for this session
      if (authModal && !sessionStorage.getItem("guestMode")) {
        authModal.style.display = "flex";
      }
    }
  });
}

// Fungsi Simpan Data
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

// Fungsi Tarik Data
async function syncDataFromCloud(uid, callback) {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists() && docSnap.data().data) {
      callback(docSnap.data().data);
    }
  } catch (error) {
    console.error("Failed to fetch data from cloud:", error);
  }
}
