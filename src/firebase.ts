// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId
}

console.log('firebaseConfig', firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Function to login with Google
const provider = new GoogleAuthProvider()

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    console.log('Google sign-in successful:', result.user)
    return result.user
  } catch (error) {
    console.error('Error during Google sign-in:', error)
    throw error
  }
}

// Export the authentication and Firestore instances
export { auth, db }
