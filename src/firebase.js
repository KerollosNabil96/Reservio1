// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
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
initializeApp(firebaseConfig);
export const db = getDatabase();
export { ref, set, onValue };
