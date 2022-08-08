import { useState } from 'react'

import { useEffectOnce } from 'react-use'

export function useLoadScript(src: string) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffectOnce(() => {
    const script = document.createElement('script')

    script.onload = () => setIsLoaded(true)

    script.src = src
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
      setIsLoaded(false)
    }
  })

  return isLoaded
}
