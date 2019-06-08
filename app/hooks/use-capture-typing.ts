import { RefObject } from 'react'
import useStartTyping from 'react-use/esm/useStartTyping'

/**
 * Captures user typing into the target input, when no input is focused
 * and user starts typing. Useful for main search inputs in a page.
 */
export function useCaptureTyping(inputRef: RefObject<HTMLInputElement>) {
  useStartTyping(event => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.dispatchEvent(event)
    }
  })
}
