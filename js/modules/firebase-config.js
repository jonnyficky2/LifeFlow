import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "MASUKKAN_API_KEY_ASLI_KAMU_DISINI",
  authDomain: "MASUKKAN_AUTH_DOMAIN_ASLI_KAMU_DISINI",
  projectId: "MASUKKAN_PROJECT_ID_ASLI_KAMU_DISINI",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc };
