import apiClient from './api'

/**
 * Project management API.
 * All paths are relative to the apiClient base URL.
 */
export const projectService = {
  /**
   * GET /api/projects
   * Returns paginated list + stats. Supports search, platform filter, sorting.
   */
  list: ({ search = '', platform = '', sortBy = 'updated_at', page = 1, perPage = 20 } = {}) => {
    const params = { page, per_page: perPage, sort_by: sortBy }
    if (search) params.search = search
    if (platform) params.platform = platform
    return apiClient.get('/api/projects', { params }).then((r) => r.data)
  },

  /**
   * GET /api/projects/:id
   */
  get: (id) => apiClient.get(`/api/projects/${id}`).then((r) => r.data),

  /**
   * POST /api/projects
   * body: { title, idea, goal, platform, length, analysis, brainstorm, ... }
   */
  create: (body) => apiClient.post('/api/projects', body).then((r) => r.data),

  /**
   * PUT /api/projects/:id
   * body: partial ProjectUpdate — auto-save compatible
   */
  update: (id, body) => apiClient.put(`/api/projects/${id}`, body).then((r) => r.data),

  /**
   * DELETE /api/projects/:id
   */
  remove: (id) => apiClient.delete(`/api/projects/${id}`),

  /**
   * POST /api/projects/:id/duplicate
   */
  duplicate: (id) => apiClient.post(`/api/projects/${id}/duplicate`).then((r) => r.data),

  /**
   * GET /api/projects/:id/export/:fmt
   * fmt: 'pdf' | 'docx' | 'markdown'
   * Returns blob for download.
   */
  exportUrl: (id, fmt) => `${apiClient.defaults.baseURL}/api/projects/${id}/export/${fmt}`,
}
