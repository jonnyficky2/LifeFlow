import { auth, db, provider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, doc, setDoc, getDoc } from "./firebase-config.js";

export function initAuth(onDataSyncedCallback) {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.querySelector(".sidebar-name");
  const userEmailEl = document.querySelector(".sidebar-email");
  const userImgEl = document.querySelector(".sidebar-profile-img");

  if (window.location.hostname === "127.0.0.1") {
    console.warn("Perhatian: Login Google Firebase mungkin gagal di 127.0.0.1. Tolong buka web ini menggunakan http://localhost:" + window.location.port);
  }

  // 1. Cek hasil dari Redirect (PENTING untuk menghentikan loop)
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        // Berhasil login dari redirect
        console.log("Login sukses via redirect:", result.user);
      }
    })
    .catch((error) => {
      console.error("Gagal saat proses kembali dari Google:", error);
      alert("Error saat memproses login: " + error.message);
      // Kembalikan tombol jika error
      if (loginBtn) {
        loginBtn.textContent = "Login dengan Google";
        loginBtn.disabled = false;
      }
    });

  // 2. Fungsi Tombol Login
  loginBtn?.addEventListener("click", () => {
    if (loginBtn) loginBtn.textContent = "Membuka Google...";
    if (loginBtn) loginBtn.disabled = true;
    
    // Langsung redirect
    signInWithRedirect(auth, provider).catch((error) => {
       console.error("Gagal memulai redirect:", error);
       if (loginBtn) {
         loginBtn.textContent = "Login dengan Google";
         loginBtn.disabled = false;
       }
    });
  });

  // 3. Fungsi Logout
  logoutBtn?.addEventListener("click", () => {
    signOut(auth);
  });

  // 4. Listener Perubahan Status Akun
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Kalau sedang login
      if(loginBtn) loginBtn.style.display = "none";
      if(logoutBtn) logoutBtn.style.display = "block";
      if(userNameEl) userNameEl.textContent = user.displayName;
      if(userEmailEl) userEmailEl.textContent = user.email;
      if(userImgEl) userImgEl.src = user.photoURL;

      // Tarik data pengguna dari cloud
      await syncDataFromCloud(user.uid, onDataSyncedCallback);
    } else {
      // Kalau tidak login (Guest)
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

// Fungsi untuk menyimpan state / data saat ini ke Firebase Firestore
export async function saveToCloud(appStateData) {
  const user = auth.currentUser;
  if (!user) return; // Jika belum login, abaikan
  
  try {
    await setDoc(doc(db, "users", user.uid), { data: appStateData }, { merge: true });
  } catch (error) {
    console.error("Gagal menyimpan ke cloud:", error);
  }
}

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