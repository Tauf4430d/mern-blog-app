// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mean-blog-89069.firebaseapp.com",
  projectId: "mean-blog-89069",
  storageBucket: "mean-blog-89069.appspot.com",
  messagingSenderId: "328541749451",
  appId: "1:328541749451:web:877817cbcd469655f19b4e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);