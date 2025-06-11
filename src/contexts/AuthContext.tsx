"use client"

import { createContext, useContext, useEffect, useState } from "react"

type AuthData = {
  accessToken: string
  fullName: string
  email: string
}

type AuthContextType = {
  auth: AuthData | null
  authLoaded: boolean
  login: (data: AuthData) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  auth: null,
  authLoaded: false,
  login: () => { },
  logout: () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
const [auth, setAuth] = useState<AuthData | null>(null)
const [authLoaded, setAuthLoaded] = useState(false)
  // Load from localStorage on first render
  useEffect(() => {
    
    const accessToken = localStorage.getItem("accessToken")
    const fullName = localStorage.getItem("fullName")
    const email = localStorage.getItem("email")

    if (accessToken && fullName && email) {
      setAuth({ accessToken, fullName, email })
    }
    setAuthLoaded(true)
  }, [])

  // ✅ Save on login
  const login = (data: AuthData) => {
    setAuth(data)
    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("fullName", data.fullName)
    localStorage.setItem("email", data.email)
  }

  // Clear on logout
  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("fullName")
    localStorage.removeItem("email")
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, authLoaded  }}>
      {children}
    </AuthContext.Provider>
  )
}

// Optional hook for easier use
export const useAuth = () => useContext(AuthContext)
