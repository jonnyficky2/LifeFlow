import { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc } from "./firebase-config.js";

export function initAuth(onDataSyncedCallback) {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.querySelector(".sidebar-name");
  const userEmailEl = document.querySelector(".sidebar-email");
  const userImgEl = document.querySelector(".sidebar-profile-img");

  // Fungsi Login
  loginBtn?.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login gagal:", error);
      alert("Gagal login: " + error.message);
    }
  });

  // Fungsi Logout
  logoutBtn?.addEventListener("click", () => {
    signOut(auth);
  });

  // Listener Perubahan Status Akun
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Kalau sedang login
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
      if(userNameEl) userNameEl.textContent = user.displayName;
      if(userEmailEl) userEmailEl.textContent = user.email;
      if(userImgEl) userImgEl.src = user.photoURL;

      // Tarik data pengguna dari cloud
      await syncDataFromCloud(user.uid, onDataSyncedCallback);
    } else {
      // Kalau tidak login (Guest)
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
      if(userNameEl) userNameEl.textContent = "Guest User";
      if(userEmailEl) userEmailEl.textContent = "Login untuk simpan data online";
      if(userImgEl) userImgEl.src = "./assets/icons/icon.jpg";
    }
  });
}

// Fungsi untuk menyimpan state / data saat ini ke Firebase Firestore
export async function saveToCloud(appStateData) {
  const user = auth.currentUser;
  if (!user) return; // Jika belum login, abaikan (data tetap tersimpan di LocalStorage)
  
  try {
    await setDoc(doc(db, "users", user.uid), { data: appStateData }, { merge: true });
  } catch (error) {
    console.error("Gagal menyimpan ke cloud:", error);
  }
}

async function syncDataFromCloud(uid, callback) {
  const docSnap = await getDoc(doc(db, "users", uid));
  if (docSnap.exists() && docSnap.data().data) {
    callback(docSnap.data().data); // Panggil fungsi callback agar UI merender data baru
  }
}