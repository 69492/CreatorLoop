import { useState, useEffect, useCallback, useRef } from 'react'

const DRAFT_KEY = 'cl_create_draft'

/**
 * useDraft — persists and restores Create Wizard state via localStorage.
 *
 * Returns:
 *   draft          — the persisted draft object (or null)
 *   saveDraft(data)— immediately saves draft
 *   clearDraft()   — removes draft from storage
 *   hasDraft       — boolean, true if a draft exists
 */
export function useDraft() {
  const [hasDraft, setHasDraft] = useState(() => {
    try {
      return !!localStorage.getItem(DRAFT_KEY)
    } catch {
      return false
    }
  })

  const saveDraft = useCallback((data) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, savedAt: new Date().toISOString() }))
      setHasDraft(true)
    } catch {
      // Storage quota exceeded — silently ignore
    }
  }, [])

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY)
      setHasDraft(false)
    } catch {
      // ignore
    }
  }, [])

  const loadDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [])

  return { hasDraft, saveDraft, clearDraft, loadDraft }
}
