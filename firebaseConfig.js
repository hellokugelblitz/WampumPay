// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getReactNativePersistence, initializeAuth } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore, collection } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0iAZZzrDpcD-T0siJCGP6Tvrxi0LSeWM",
  authDomain: "wompampayapp.firebaseapp.com",
  projectId: "wompampayapp",
  storageBucket: "wompampayapp.appspot.com",
  messagingSenderId: "36522546764",
  appId: "1:36522546764:web:5c5a34bd0e728d70e886e9",
  measurementId: "G-8DSVN424ZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const paymentsRef = collection(db, 'payments');