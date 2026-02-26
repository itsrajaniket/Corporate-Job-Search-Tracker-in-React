import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE-P5SZ8o_M70P_hhrxcfyUDDnJGIgMDU",
  authDomain: "corporate-job-search-tracker.firebaseapp.com",
  projectId: "corporate-job-search-tracker",
  storageBucket: "corporate-job-search-tracker.firebasestorage.app",
  messagingSenderId: "687653387267",
  appId: "1:687653387267:web:6a5054468f7a2f132ee236",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set up the Login System
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Set up the Database
export const db = getFirestore(app);
