import { useState, useCallback } from 'react'
import { workspaceService } from '@/services/workspaceService'

/**
 * Pipeline stage labels shown in the UI progress bar.
 */
export const PIPELINE_STAGES = [
  { id: 'idea_analysis', label: 'Idea Analysis', emoji: '🔍' },
  { id: 'brainstorm', label: 'Brainstorm', emoji: '💡' },
  { id: 'creative_direction', label: 'Direction', emoji: '🎯' },
  { id: 'content_development', label: 'Writing', emoji: '✍️' },
  { id: 'platform_adaptation', label: 'Adaptation', emoji: '🌐' },
  { id: 'creative_suggestions', label: 'Suggestions', emoji: '✨' },
]

const STAGE_DURATIONS_MS = [2000, 3000, 2500, 4000, 3500, 2500]

/**
 * Manages the full AI generation lifecycle:
 *   idle → loading (with animated stages) → done | error
 *
 * Returns { generate, status, currentStage, results, error, reset }
 */
export function useWorkspace() {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [currentStage, setCurrentStage] = useState(-1)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const advanceStages = useCallback(() => {
    return new Promise((resolve) => {
      let idx = 0
      const tick = () => {
        setCurrentStage(idx)
        if (idx < PIPELINE_STAGES.length - 1) {
          idx++
          setTimeout(tick, STAGE_DURATIONS_MS[idx - 1] ?? 2000)
        } else {
          // Keep final stage active until the API resolves
          resolve()
        }
      }
      tick()
    })
  }, [])

  const generate = useCallback(async (payload) => {
    setStatus('loading')
    setCurrentStage(0)
    setError(null)
    setResults(null)

    // Run animated stages in parallel with the real API call
    const [data] = await Promise.all([
      workspaceService.generate(payload),
      advanceStages(),
    ]).catch((err) => {
      const message =
        err?.response?.data?.detail ??
        err?.message ??
        'Something went wrong. Please try again.'
      setError(message)
      setStatus('error')
      setCurrentStage(-1)
      throw err
    })

    setResults(data)
    setCurrentStage(PIPELINE_STAGES.length) // all done
    setStatus('done')
    return data
  }, [advanceStages])

  const reset = useCallback(() => {
    setStatus('idle')
    setCurrentStage(-1)
    setResults(null)
    setError(null)
  }, [])

  return { generate, status, currentStage, results, error, reset }
}
