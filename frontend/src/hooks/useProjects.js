import { useState, useCallback, useRef } from 'react'
import { projectService } from '@/services/projectService'
import { useToast } from '@/hooks/useToast'

/**
 * useProjects — state management for the project dashboard.
 *
 * Provides:
 *   projects, total, stats, loading, error
 *   fetchProjects(opts)
 *   saveProject(data)        — create new project, returns saved project
 *   updateProject(id, data)  — partial update (auto-save)
 *   deleteProject(id)
 *   duplicateProject(id)
 *   renameProject(id, title)
 */
export function useProjects() {
  const { toast } = useToast()
  const [projects, setProjects]   = useState([])
  const [total, setTotal]         = useState(0)
  const [stats, setStats]         = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const autoSaveTimer             = useRef(null)

  // ── Fetch / search / filter ────────────────────────────────────────────────
  const fetchProjects = useCallback(async (opts = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectService.list(opts)
      setProjects(data.projects)
      setTotal(data.total)
      setStats(data.stats)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [toast])

  // ── Create ─────────────────────────────────────────────────────────────────
  const saveProject = useCallback(async (data) => {
    try {
      const saved = await projectService.create(data)
      toast.success('Project saved!')
      await fetchProjects()
      return saved
    } catch (err) {
      toast.error(`Save failed: ${err.message}`)
      throw err
    }
  }, [fetchProjects, toast])

  // ── Auto-save (debounced PUT) ──────────────────────────────────────────────
  const updateProject = useCallback(async (id, data, { silent = false } = {}) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    return new Promise((resolve, reject) => {
      autoSaveTimer.current = setTimeout(async () => {
        try {
          const updated = await projectService.update(id, data)
          if (!silent) toast.success('Saved', { duration: 1500 })
          // Refresh the list entry in-place
          setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
          )
          resolve(updated)
        } catch (err) {
          if (!silent) toast.error('Auto-save failed')
          reject(err)
        }
      }, 600)
    })
  }, [toast])

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteProject = useCallback(async (id) => {
    try {
      await projectService.remove(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      setTotal((t) => t - 1)
      toast.success('Project deleted')
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`)
    }
  }, [toast])

  // ── Duplicate ──────────────────────────────────────────────────────────────
  const duplicateProject = useCallback(async (id) => {
    try {
      const copy = await projectService.duplicate(id)
      toast.success('Project duplicated')
      await fetchProjects()
      return copy
    } catch (err) {
      toast.error(`Duplicate failed: ${err.message}`)
    }
  }, [fetchProjects, toast])

  // ── Rename (convenience wrapper) ──────────────────────────────────────────
  const renameProject = useCallback(async (id, title) => {
    try {
      const updated = await projectService.update(id, { title })
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, title: updated.title } : p))
      )
      toast.success('Renamed')
      return updated
    } catch (err) {
      toast.error(`Rename failed: ${err.message}`)
    }
  }, [toast])

  return {
    projects,
    total,
    stats,
    loading,
    error,
    fetchProjects,
    saveProject,
    updateProject,
    deleteProject,
    duplicateProject,
    renameProject,
  }
}
