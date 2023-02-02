import { useState } from 'react'

import { useEffectOnce } from 'react-use'

import { useIframe } from './use-iframe'

export function useIframeFonts() {
  const iframe = useIframe()
  const [fonts, setFonts] = useState<FontFace[]>([])

  useEffectOnce(() => {
    iframe.contentDocument!.fonts.ready.then(() => {
      setFonts(Array.from(iframe.contentDocument!.fonts))
    })
  })

  return fonts
}
