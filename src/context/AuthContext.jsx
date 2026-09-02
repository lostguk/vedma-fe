import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getToken, setToken, removeToken } from '../api/client'
import * as authApi from '../api/auth'
import * as profileApi from '../api/profile'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    profileApi
      .getProfile()
      .then((res) => setUser(res.data.data))
      .catch(() => removeToken())
      .finally(() => setLoading(false))
  }, [])

  const applySession = useCallback((token, userData) => {
    setToken(token)
    setUser(userData)
  }, [])

  const signIn = useCallback(async (email, password) => {
    const res = await authApi.login(email, password)
    const { token, user: userData } = res.data.data
    applySession(token, userData)
    return res.data
  }, [applySession])

  const register = useCallback(async (data) => {
    const res = await authApi.register(data)
    return res.data
  }, [])

  const signOut = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      /* ignore */
    }
    removeToken()
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data) => {
    const res = await profileApi.updateProfile(data)
    setUser(res.data.data)
    return res.data
  }, [])

  const forgotPassword = useCallback(async (email) => {
    const res = await authApi.forgotPassword(email)
    return res.data
  }, [])

  const resetPassword = useCallback(async (data) => {
    const res = await authApi.resetPassword(data)
    return res.data
  }, [])

  const changePassword = useCallback(async (data) => {
    const res = await authApi.changePassword(data)
    return res.data
  }, [])

  const refreshUser = useCallback(async () => {
    const res = await profileApi.getProfile()
    setUser(res.data.data)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      applySession,
      signIn,
      register,
      signOut,
      updateProfile,
      forgotPassword,
      resetPassword,
      changePassword,
      refreshUser,
      isAuthenticated: Boolean(user),
    }),
    [
      user,
      loading,
      applySession,
      signIn,
      register,
      signOut,
      updateProfile,
      forgotPassword,
      resetPassword,
      changePassword,
      refreshUser,
    ],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
