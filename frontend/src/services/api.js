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

// ── Request interceptor: attach JWT ─────────────────────────────────────────
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

// ── Response interceptor: normalise errors ───────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / offline
    if (!error.response) {
      if (!navigator.onLine) {
        return Promise.reject(new Error('You appear to be offline. Please check your internet connection.'))
      }
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('The request timed out. Please try again.'))
      }
      return Promise.reject(new Error('Network error. Please try again.'))
    }

    const status = error.response.status

    // 401 — unauthenticated
    if (status === 401 && !error.config?.url?.includes('/api/auth/')) {
      localStorage.removeItem('cl_token')
      localStorage.removeItem('cl_user')
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.location.replace('/auth/signin')
      }
    }

    // Extract the most helpful error message from the response
    const detail = error.response?.data?.detail
    let message = ''

    if (typeof detail === 'string') {
      message = detail
    } else if (Array.isArray(detail)) {
      // FastAPI validation errors come as an array
      message = detail.map((d) => d.msg || d.message || String(d)).join('. ')
    } else if (typeof detail === 'object' && detail !== null) {
      message = detail.msg || detail.message || JSON.stringify(detail)
    }

    if (!message) {
      switch (status) {
        case 400: message = 'Invalid request. Please check your input.'; break
        case 401: message = 'Your session has expired. Please sign in again.'; break
        case 403: message = 'You do not have permission to perform this action.'; break
        case 404: message = 'The requested resource was not found.'; break
        case 409: message = 'A conflict occurred. The resource may already exist.'; break
        case 422: message = 'Validation failed. Please check your input.'; break
        case 429: message = 'Too many requests. Please slow down and try again.'; break
        case 500: message = 'A server error occurred. Our team has been notified.'; break
        case 502:
        case 503:
        case 504: message = 'The service is temporarily unavailable. Please try again shortly.'; break
        default:  message = error.message || 'An unexpected error occurred.'
      }
    }

    return Promise.reject(new Error(message))
  }
)

export default apiClient
