import { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc } from "./firebase-config.js";
import { showToast } from "../core/utils.js";

export function initAuth(onDataSyncedCallback) {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.querySelector(".sidebar-name");
  const userEmailEl = document.querySelector(".sidebar-email");
  const userImgEl = document.querySelector(".sidebar-profile-img");

  if (window.location.hostname === "127.0.0.1") {
    console.warn("Warning: Google Firebase login might fail on 127.0.0.1. Use localhost.");
  }

  // Fungsi Login Menggunakan Popup
  loginBtn?.addEventListener("click", async () => {
    try {
      if (loginBtn) {
        loginBtn.textContent = "Opening Popup...";
        loginBtn.disabled = true;
      }
      
      const result = await signInWithPopup(auth, provider);
      console.log("Login successful:", result.user.email);

    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to login. If popup is blocked, please allow popups for this site. Error: " + error.message);
      
      if (loginBtn) {
        loginBtn.textContent = "Login with Google";
        loginBtn.disabled = false;
      }
    }
  });

  // Fungsi Logout
  logoutBtn?.addEventListener("click", () => {
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
      if(userImgEl) userImgEl.src = "./assets/icons/icon.jpg";
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
