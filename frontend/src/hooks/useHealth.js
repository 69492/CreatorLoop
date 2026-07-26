import { useState, useEffect } from 'react'
import { healthService } from '@/services/healthService'

/**
 * Polls the backend health endpoint once on mount.
 * Returns { status, loading, error }.
 */
export function useHealth() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    healthService
      .check()
      .then((data) => {
        if (!cancelled) setStatus(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { status, loading, error }
}
