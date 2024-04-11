// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvf-wZjb94qHmYtRBM5GjoJeVcwCZVy-4",
  authDomain: "quetzai.firebaseapp.com",
  projectId: "quetzai",
  storageBucket: "quetzai.appspot.com",
  messagingSenderId: "534872798640",
  appId: "1:534872798640:web:52374c8ab8ef4bebcbd275",
  measurementId: "G-CLEPLGY8NG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize various Firebase roots. To save space, I also initialize my own backend root path here.
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const backend_root = "https://localhost:8000"; // This will change during hosting.
