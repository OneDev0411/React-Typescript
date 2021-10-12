import { useState, useEffect } from 'react'

export function useSingleAndDoubleClick(
  actionSingleClick: () => void,
  actionDoubleClick: () => void,
  delay = 250
) {
  const [click, setClick] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (click === 1) {
        actionSingleClick()
      }

      setClick(0)
    }, delay)

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (click === 2) {
      setTimeout(actionDoubleClick, Math.max(delay, 500))
    }

    return () => clearTimeout(timer)
  }, [click, delay, actionSingleClick, actionDoubleClick])

  return () => setClick(prev => prev + 1)
}
