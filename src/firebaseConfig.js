import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA83EaE-qDnT1KtT-1craVGE_JDpR_Kv3M",
  authDomain: "bookcore-library.firebaseapp.com",
  projectId: "bookcore-library",
  storageBucket: "bookcore-library.firebasestorage.app",
  messagingSenderId: "675363986163",
  appId: "1:675363986163:web:b0ae6f176030d727f83586",
  measurementId: "G-7CHJMJET3D"
};



const app = initializeApp(firebaseConfig);

// Export Firebase services you'll use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);