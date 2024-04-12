// Import the functions you need from the SDKs you need
const initializeApp = require("firebase/app").initializeApp;
const getStorage = require("firebase/storage").getStorage;

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
const storage = getStorage(app);

module.exports = {storage}