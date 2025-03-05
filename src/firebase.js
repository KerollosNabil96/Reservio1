// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQkgVpE_7RTWTwiV33hHzhtHeMMEIDp3k",
  authDomain: "reservio-77386.firebaseapp.com",
  databaseURL:
    "https://reservio-77386-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "reservio-77386",
  storageBucket: "reservio-77386.firebasestorage.app",
  messagingSenderId: "646436536543",
  appId: "1:646436536543:web:059a2822cae584d5d7296a",
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

export { ref, set, onValue, onAuthStateChanged, GoogleAuthProvider, signInWithPopup };
