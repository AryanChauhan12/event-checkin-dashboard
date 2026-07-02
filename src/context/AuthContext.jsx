import { useState } from 'react'
import * as authService from '@services/authService'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@constants'
import { AuthContext } from './authContextValue'

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(AUTH_USER_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getStoredUser)

  const login = async (email, password) => {
    const { token, user } = await authService.login(email, password)

    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    setCurrentUser(user)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
