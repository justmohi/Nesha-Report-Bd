import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD5f9G5JJhpMG4tu2LUD4KJ2qKgqcHA0lY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'nesha-report-bd.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nesha-report-bd',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'nesha-report-bd.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '370622278585',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:370622278585:web:de2872d03dd5c6d5fea468',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your_firebase_api_key'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
  }
}

export { app, auth, db };
export default firebaseConfig;
