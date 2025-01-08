// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATc0GSuUS5k6FYQCOH_skap4pBPMmMF_g",
  authDomain: "spendsense-c9a2e.firebaseapp.com",
  projectId: "spendsense-c9a2e",
  storageBucket: "spendsense-c9a2e.firebasestorage.app",
  messagingSenderId: "76446510957",
  appId: "1:76446510957:web:574d9266740865678f7464",
  measurementId: "G-CJ22JKB0JF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
