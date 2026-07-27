import apiClient from './api'

export const workspaceService = {
  /**
   * Run the full AI creative pipeline (single Groq call).
   * Returns the structured GenerateResponse.
   */
  generate: (payload) =>
    apiClient
      .post('/api/workspace/generate', payload, { timeout: 60000 })
      .then((res) => res.data),

  /**
   * Validate a request and get pipeline metadata (no AI call).
   */
  create: (payload) =>
    apiClient
      .post('/api/workspace/create', payload)
      .then((res) => res.data),
}
