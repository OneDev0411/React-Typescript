import usePrevious from 'react-use/lib/usePrevious'
import { useEffect } from 'react'

export function useOnOpen(open, cb) {
  const wasOpen = usePrevious(open)

  useEffect(() => {
    if (open && !wasOpen) {
      cb()
    }
  }, [cb, open, wasOpen])
}
