import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return !error
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <AdminAuthContext.Provider value={{ session, isLoggedIn: !!session, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}