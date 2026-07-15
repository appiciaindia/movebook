// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaujS5ryZ7REp2r0mDkS_GwTrH6KW2-kI",
  authDomain: "authentication-509ce.firebaseapp.com",
  projectId: "authentication-509ce",
  storageBucket: "authentication-509ce.firebasestorage.app",
  messagingSenderId: "668419545614",
  appId: "1:668419545614:web:505037caada47b81f97a5f",
  measurementId: "G-ERVDC5XH2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);