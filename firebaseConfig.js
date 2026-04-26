import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, terminate, clearIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC66YSETgpWEgkljV19ysmD0Z1dqqKeGr0",
  authDomain: "mealbridge-77c80.firebaseapp.com",
  projectId: "mealbridge-77c80",
  storageBucket: "mealbridge-77c80.firebasestorage.app",
  messagingSenderId: "276552966393",
  appId: "1:276552966393:web:941912279e88be27990228",
  measurementId: "G-4H3X69EDB3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use these settings ONLY - they are designed for tunnels
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Standardizes the connection
  useFetchStreams: false,             // Prevents the "blue circle" hang
});