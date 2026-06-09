import { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc } from "./firebase-config.js";
import { showToast } from "../core/utils.js";

export function initAuth(onDataSyncedCallback) {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.querySelector(".sidebar-name");
  const userEmailEl = document.querySelector(".sidebar-email");
  const userImgEl = document.querySelector(".sidebar-profile-img");

  if (window.location.hostname === "127.0.0.1") {
    console.warn("Perhatian: Login Google Firebase mungkin gagal di 127.0.0.1. Buka via localhost.");
  }

  // Fungsi Login Menggunakan Popup
  loginBtn?.addEventListener("click", async () => {
    try {
      if (loginBtn) {
        loginBtn.textContent = "Membuka Popup...";
        loginBtn.disabled = true;
      }
      
      const result = await signInWithPopup(auth, provider);
      console.log("Login sukses:", result.user.email);

    } catch (error) {
      console.error("Login gagal:", error);
      alert("Gagal login. Jika Popup diblokir, pastikan Anda mengizinkan popup untuk situs ini. Error: " + error.message);
      
      if (loginBtn) {
        loginBtn.textContent = "Login dengan Google";
        loginBtn.disabled = false;
      }
    }
  });

  // Fungsi Logout
  logoutBtn?.addEventListener("click", () => {
    signOut(auth).catch((err) => console.error("Gagal logout", err));
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
        loginBtn.textContent = "Login dengan Google";
        loginBtn.disabled = false;
      }
      if(logoutBtn) logoutBtn.style.display = "none";
      if(userNameEl) userNameEl.textContent = "Guest User";
      if(userEmailEl) userEmailEl.textContent = "Login untuk simpan data online";
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
    console.error("Gagal menyimpan ke cloud:", error);
    showToast("Gagal menyimpan ke Cloud. Periksa koneksi Anda.");
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
    console.error("Gagal mengambil data dari cloud:", error);
  }
}
