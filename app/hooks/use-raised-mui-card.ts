import { useState } from 'react'

export default function useRaisedMuiCard() {
  const [isRaised, setIsRaised] = useState(false)

  function raise() {
    setIsRaised(true)
  }

  function stopRaise() {
    setIsRaised(false)
  }

  return { isRaised, raise, stopRaise }
}
