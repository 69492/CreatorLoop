import apiClient from './api'

export const healthService = {
  check: () => apiClient.get('/api/health').then((res) => res.data),
}
