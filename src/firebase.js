// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  get,
  remove,
  update,
} from "firebase/database";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU6X4lJ_bFanc3x6GExHlRTqfSgdxG8ZI",
  authDomain: "reservio-f608f.firebaseapp.com",
  projectId: "reservio-f608f",
  storageBucket: "reservio-f608f.firebasestorage.app",
  messagingSenderId: "431688922050",
  appId: "1:431688922050:web:21daf5a90cf9ba0f925c5b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase();
export const auth = getAuth(app);

// Set persistence to local to keep user logged in even after page refresh
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export {
  ref,
  set,
  onValue,
  get,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  remove,
  update,
};
