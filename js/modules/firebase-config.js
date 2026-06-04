// Menggunakan CDN Firebase versi 10.8.1
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBU92AgOUJQdXEAj49DcmMvIBkFohRK9oA",
  authDomain: "lifeflow-cd351.firebaseapp.com",
  projectId: "lifeflow-cd351",
  storageBucket: "lifeflow-cd351.firebasestorage.app",
  messagingSenderId: "522144197699",
  appId: "1:522144197699:web:50206a63b8e2c87a83b8f6",
  measurementId: "G-MB9B1B8PSN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

// Kita tetap paksa dia agar memilih akun setiap kali login
provider.setCustomParameters({
  prompt: 'select_account'
});

export { signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc };