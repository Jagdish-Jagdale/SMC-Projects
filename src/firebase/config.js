// Firebase configuration
// Replace these values with your actual Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBd-wx4sMvTYzpQz4XGSQx3V1tVVhj6mcE",
  authDomain: "advik-51f3c.firebaseapp.com",
  projectId: "advik-51f3c",
  databaseURL: "https://advik-51f3c-default-rtdb.firebaseio.com",
  storageBucket: "advik-51f3c.firebasestorage.app",
  messagingSenderId: "231219359245",
  appId: "1:231219359245:web:7806cfd660b5b91dca6f44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getDatabase(app); // Realtime Database
export const firestoreDb = getFirestore(app); // Firestore
export const storage = getStorage(app);

export default app;
