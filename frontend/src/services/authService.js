/**
 * Auth service — wraps API calls for authentication.
 */
import apiClient from './api'

export const authService = {
  register: (data) =>
    apiClient.post('/api/auth/register', data).then((r) => r.data),

  login: (data) =>
    apiClient.post('/api/auth/login', data).then((r) => r.data),

  googleAuth: (credential) =>
    apiClient.post('/api/auth/google', { credential }).then((r) => r.data),

  me: () =>
    apiClient.get('/api/auth/me').then((r) => r.data),

  updateProfile: (data) =>
    apiClient.put('/api/auth/me', data).then((r) => r.data),

  changePassword: (data) =>
    apiClient.post('/api/auth/change-password', data).then((r) => r.data),
}
