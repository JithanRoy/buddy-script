import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBLgC4hGP0uCFj3BdZ6zHGYnozsZZjfLvc",
  authDomain: "buddy-script-5b493.firebaseapp.com",
  projectId: "buddy-script-5b493",
  storageBucket: "buddy-script-5b493.firebasestorage.app",
  messagingSenderId: "579675494814",
  appId: "1:579675494814:web:9c381b44dd7d9e50a21e8f",
  measurementId: "G-50MG9F7271",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
