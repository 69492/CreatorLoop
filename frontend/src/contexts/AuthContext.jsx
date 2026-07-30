import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService } from '@/services/authService'
import apiClient from '@/services/api'

const TOKEN_KEY  = 'cl_token'
const USER_KEY   = 'cl_user'
const DRAFT_KEY  = 'cl_create_draft'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  // Inject token into every request
  useEffect(() => {
    const interceptorId = apiClient.interceptors.request.use((config) => {
      const t = localStorage.getItem(TOKEN_KEY)
      if (t) config.headers.Authorization = `Bearer ${t}`
      return config
    })
    return () => apiClient.interceptors.request.eject(interceptorId)
  }, [])

  // Validate stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (!storedToken) { setLoading(false); return }

    authService.me()
      .then((userData) => {
        setUser(userData)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const _persistSession = useCallback((tokenResponse) => {
    localStorage.setItem(TOKEN_KEY, tokenResponse.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(tokenResponse.user))
    setToken(tokenResponse.access_token)
    setUser(tokenResponse.user)
    // Update apiClient header immediately
    apiClient.defaults.headers.common.Authorization = `Bearer ${tokenResponse.access_token}`
  }, [])

  const register = useCallback(async (email, password, fullName) => {
    const resp = await authService.register({ email, password, full_name: fullName || undefined })
    _persistSession(resp)
    return resp.user
  }, [_persistSession])

  const login = useCallback(async (email, password) => {
    const resp = await authService.login({ email, password })
    _persistSession(resp)
    return resp.user
  }, [_persistSession])

  const googleLogin = useCallback(async (credential) => {
    const resp = await authService.googleAuth(credential)
    _persistSession(resp)
    return resp.user
  }, [_persistSession])

  const logout = useCallback(() => {
    // Clear all auth tokens and user data
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    // Clear draft data on logout
    localStorage.removeItem(DRAFT_KEY)
    // Remove all cl_ prefixed keys (project cache, etc.)
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('cl_')) localStorage.removeItem(key)
    })
    // Clear session storage entirely
    try { sessionStorage.clear() } catch { /* ignore */ }
    delete apiClient.defaults.headers.common.Authorization
    setToken(null)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data) => {
    const updated = await authService.updateProfile(data)
    setUser(updated)
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
    return updated
  }, [])

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    await authService.changePassword({ current_password: currentPassword, new_password: newPassword })
  }, [])

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      register,
      login,
      googleLogin,
      logout,
      updateProfile,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
