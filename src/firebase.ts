import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyCiILlGI3X0dqn0k9fy_C8y-JipgeMQ-o8",
  authDomain: "sobriweb-5e71f.firebaseapp.com",
  projectId: "sobriweb-5e71f",
  storageBucket: "sobriweb-5e71f.firebasestorage.appspot.com", 
  messagingSenderId: "650849259591",
  appId: "1:650849259591:web:2b2a44b1afc95ec405e162",
  measurementId: "G-6YPNHSD5W2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
