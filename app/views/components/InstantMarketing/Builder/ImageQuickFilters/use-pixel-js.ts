import { useState } from 'react'

import { useEffectOnce } from 'react-use'

export function useLoadPixelJs() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffectOnce(() => {
    const script = document.createElement('script')

    script.onload = () => setIsLoaded(true)

    script.src =
      'https://cdn.jsdelivr.net/gh/silvia-odwyer/pixels.js/dist/Pixels.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
      setIsLoaded(false)
    }
  })

  return isLoaded
}
