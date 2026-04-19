import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Fill these from your Firebase project settings.
// In Vite, you should store them in `.env` as VITE_* variables.
const firebaseConfig = {
  apiKey: "AIzaSyDME-89G0qplcVg9Uo7OQlgVgsC79FJXaY",
  authDomain: "loan-managment-7ce6e.firebaseapp.com",
  projectId: "loan-managment-7ce6e",
  storageBucket: "loan-managment-7ce6e.firebasestorage.app",
  messagingSenderId: "630622279376",
  appId: "1:630622279376:web:d965532843a38d5c7a30d5",
  measurementId: "G-3988DW7TE5" }

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

