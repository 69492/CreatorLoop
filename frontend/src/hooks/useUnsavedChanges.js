import { useEffect, useCallback, useRef } from 'react'
import { useBeforeUnload, useBlocker } from 'react-router-dom'

/**
 * useUnsavedChanges
 *
 * Registers both browser-native beforeunload (refresh / tab close) and
 * React Router's navigation blocker (in-app route changes).
 *
 * @param {boolean}  isDirty   - Whether there are unsaved changes
 * @param {Function} onBlock   - Called with (proceed, cancel) when navigation is blocked
 */
export function useUnsavedChanges(isDirty, onBlock) {
  const onBlockRef = useRef(onBlock)
  useEffect(() => { onBlockRef.current = onBlock }, [onBlock])

  // ── Browser refresh / tab close ──────────────────────────────────────────
  useBeforeUnload(
    useCallback(
      (event) => {
        if (isDirty) {
          event.preventDefault()
          // Chrome requires returnValue to be set
          event.returnValue = ''
        }
      },
      [isDirty]
    )
  )

  // ── React Router in-app navigation ───────────────────────────────────────
  const blocker = useBlocker(
    useCallback(({ currentLocation, nextLocation }) => {
      return isDirty && currentLocation.pathname !== nextLocation.pathname
    }, [isDirty])
  )

  useEffect(() => {
    if (blocker.state === 'blocked') {
      onBlockRef.current(
        () => blocker.proceed(),
        () => blocker.reset()
      )
    }
  }, [blocker])
}
