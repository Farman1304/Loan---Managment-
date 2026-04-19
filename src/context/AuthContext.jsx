/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const snap = await getDoc(doc(db, 'users', u.uid))
        setProfile(snap.exists() ? snap.data() : null)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  async function signup({ email, password, displayName, role }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }

    const userDoc = {
      userId: cred.user.uid,
      email,
      displayName: displayName || '',
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'users', cred.user.uid), userDoc, { merge: true })
    setProfile(userDoc)
    return cred.user
  }

  async function login({ email, password }) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  async function logout() {
    await signOut(auth)
  }

  const value = useMemo(
    () => ({ user, profile, loading, signup, login, logout }),
    [user, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

