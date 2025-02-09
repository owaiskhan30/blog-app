import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnxa7h5nkOHm6uI6rpqjpBhOlhxOSTyeo",
  authDomain: "blog-web-application-1acb0.firebaseapp.com",
  projectId: "blog-web-application-1acb0",
  storageBucket: "blog-web-application-1acb0.firebasestorage.app",
  messagingSenderId: "852168858722",
  appId: "1:852168858722:web:83032193530254049e853b",
  measurementId: "G-0Z9NR19JCL"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);