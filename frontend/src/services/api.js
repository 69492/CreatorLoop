import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cl_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect to auth on 401 (unless we're already on auth endpoints)
    if (
      error?.response?.status === 401 &&
      !error?.config?.url?.includes('/api/auth/')
    ) {
      localStorage.removeItem('cl_token')
      localStorage.removeItem('cl_user')
      // Only redirect if we're in the browser and not on a public page
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth'
      }
    }

    const message =
      error?.response?.data?.detail ??
      error?.message ??
      'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  }
)

export default apiClient
