import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAhuR4nCNuqFL6Wli23umx9yLQNs5oxgbg",
    authDomain: "ph-b12-a13-microtask.firebaseapp.com",
    projectId: "ph-b12-a13-microtask",
    storageBucket: "ph-b12-a13-microtask.firebasestorage.app",
    messagingSenderId: "333813834564",
    appId: "1:333813834564:web:1d9d3b26f4c97d8ceaad11",
    measurementId: "G-FYXQL1JGQB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
